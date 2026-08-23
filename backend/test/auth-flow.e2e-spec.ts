import { INestApplication } from '@nestjs/common';
import request from 'supertest';
import { randomUUID } from 'crypto';
import { createTestApp } from './utils/test-app.setup';
import { PrismaService } from '../src/prisma/prisma.service';

const TEST_PASSWORD = 'Password123!';

describe('Auth flow (e2e)', () => {
  let app: INestApplication;
  let prisma: PrismaService;

  const emailsToClean: string[] = [];

  function uniqueEmail(prefix: string) {
    const email = `e2e-${prefix}-${randomUUID()}@test.local`;
    emailsToClean.push(email);
    return email;
  }

  function extractCookie(res: request.Response, name: string): string {
    const rawCookies = res.headers['set-cookie'];
    const cookies = Array.isArray(rawCookies) ? rawCookies : [rawCookies];
    const found = cookies.find((c) => c.startsWith(`${name}=`));
    if (!found) throw new Error(`Cookie ${name} not found in response`);
    return found.split(';')[0];
  }

  // Contourne la vérification d'email pour les tests : simule la confirmation
  // que ferait normalement l'utilisateur en cliquant sur le lien reçu par mail.
  async function verifyEmail(email: string) {
    await prisma.user.update({
      where: { email },
      data: { emailVerified: true },
    });
  }

  beforeAll(async () => {
    app = await createTestApp();
    prisma = app.get(PrismaService);
  });

  afterAll(async () => {
    if (emailsToClean.length > 0) {
      await prisma.user.deleteMany({ where: { email: { in: emailsToClean } } });
    }
    await app.close();
  });

  it('registers a new user and sets auth cookies', async () => {
    const email = uniqueEmail('register');

    const res = await request(app.getHttpServer())
      .post('/auth/register')
      .send({ email, password: TEST_PASSWORD, firstName: 'Test' })
      .expect(201);

    expect(res.body.user.email).toBe(email);
    expect(res.body.user.role).toBe('CLIENT');
    expect(res.body.user.passwordHash).toBeUndefined();
    expect(() => extractCookie(res, 'access_token')).not.toThrow();
    expect(() => extractCookie(res, 'refresh_token')).not.toThrow();
  });

  it('rejects registration with an already-used email', async () => {
    const email = uniqueEmail('dup');

    await request(app.getHttpServer())
      .post('/auth/register')
      .send({ email, password: TEST_PASSWORD })
      .expect(201);

    await request(app.getHttpServer())
      .post('/auth/register')
      .send({ email, password: TEST_PASSWORD })
      .expect(409);
  });

  it('rejects login with a wrong password', async () => {
    const email = uniqueEmail('badpass');
    await request(app.getHttpServer())
      .post('/auth/register')
      .send({ email, password: TEST_PASSWORD })
      .expect(201);

    await request(app.getHttpServer())
      .post('/auth/login')
      .send({ email, password: 'WrongPassword123!' })
      .expect(401);
  });

  it('logs in and can access /auth/me with the resulting cookie', async () => {
    const email = uniqueEmail('me');
    await request(app.getHttpServer())
      .post('/auth/register')
      .send({ email, password: TEST_PASSWORD })
      .expect(201);

    await verifyEmail(email);

    const loginRes = await request(app.getHttpServer())
      .post('/auth/login')
      .send({ email, password: TEST_PASSWORD })
      .expect(200);

    const accessCookie = extractCookie(loginRes, 'access_token');

    const meRes = await request(app.getHttpServer())
      .get('/auth/me')
      .set('Cookie', accessCookie)
      .expect(200);

    expect(meRes.body.email).toBe(email);
    expect(meRes.body.role).toBe('CLIENT');
  });

  it('rejects /auth/me without any cookie', async () => {
    await request(app.getHttpServer()).get('/auth/me').expect(401);
  });

  it('rotates the refresh token and invalidates the old one after reuse (theft detection)', async () => {
    const email = uniqueEmail('rotation');
    await request(app.getHttpServer())
      .post('/auth/register')
      .send({ email, password: TEST_PASSWORD })
      .expect(201);

    await verifyEmail(email);

    const loginRes = await request(app.getHttpServer())
      .post('/auth/login')
      .send({ email, password: TEST_PASSWORD })
      .expect(200);

    const oldRefreshCookie = extractCookie(loginRes, 'refresh_token');

    // 1. Rotation normale : le refresh token valide est échangé contre une nouvelle paire.
    const refreshRes = await request(app.getHttpServer())
      .post('/auth/refresh')
      .set('Cookie', oldRefreshCookie)
      .expect(200);

    const newRefreshCookie = extractCookie(refreshRes, 'refresh_token');
    expect(newRefreshCookie).not.toBe(oldRefreshCookie);

    // 2. Rejouer l'ANCIEN refresh token (déjà consommé) doit être traité comme
    //    un vol : rejeté, et TOUTES les sessions de l'utilisateur sont révoquées.
    await request(app.getHttpServer())
      .post('/auth/refresh')
      .set('Cookie', oldRefreshCookie)
      .expect(401);

    // 3. Conséquence : même le nouveau token (pourtant légitime) est maintenant
    //    révoqué, puisque la détection de vol a tout invalidé pour cet utilisateur.
    await request(app.getHttpServer())
      .post('/auth/refresh')
      .set('Cookie', newRefreshCookie)
      .expect(401);
  });

  it('logout invalidates the refresh token', async () => {
    const email = uniqueEmail('logout');
    await request(app.getHttpServer())
      .post('/auth/register')
      .send({ email, password: TEST_PASSWORD })
      .expect(201);

    await verifyEmail(email);

    const loginRes = await request(app.getHttpServer())
      .post('/auth/login')
      .send({ email, password: TEST_PASSWORD })
      .expect(200);

    const refreshCookie = extractCookie(loginRes, 'refresh_token');

    await request(app.getHttpServer())
      .post('/auth/logout')
      .set('Cookie', refreshCookie)
      .expect(200);

    // Le refresh token utilisé avant le logout ne doit plus être utilisable.
    await request(app.getHttpServer())
      .post('/auth/refresh')
      .set('Cookie', refreshCookie)
      .expect(401);
  });
});