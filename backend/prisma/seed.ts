import { PrismaClient, Role } from '@prisma/client';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();

const IMG_BASE = '/assets/products';

// Même coût que AuthService (backend/src/modules/auth/auth.service.ts)
// — garder les deux synchronisés si l'un change un jour.
const SALT_ROUNDS = 12;

async function seedAdmin() {
  const adminEmail = process.env.ADMIN_EMAIL;
  const adminPassword = process.env.ADMIN_PASSWORD;

  if (!adminEmail || !adminPassword) {
    throw new Error(
      'ADMIN_EMAIL et ADMIN_PASSWORD doivent être définis dans backend/.env avant de lancer le seed.',
    );
  }

  if (adminPassword.length < 8) {
    throw new Error('ADMIN_PASSWORD doit contenir au moins 8 caractères.');
  }

  const passwordHash = await bcrypt.hash(adminPassword, SALT_ROUNDS);

  // upsert : idempotent, on peut relancer le seed sans dupliquer ni planter
  // si le compte admin existe déjà (ex. re-déploiement, reset partiel de DB).
  const admin = await prisma.user.upsert({
    where: { email: adminEmail },
    update: {
      passwordHash,
      role: Role.ADMIN,
      emailVerified: true,
    },
    create: {
      email: adminEmail,
      passwordHash,
      firstName: 'Admin',
      lastName: 'TechGear',
      role: Role.ADMIN,
      emailVerified: true,
    },
  });

  console.log(`✅ Compte ADMIN prêt : ${admin.email} (id: ${admin.id})`);
}

/**
 * Promeut des comptes EXISTANTS en ADMIN, à partir d'une liste d'emails
 * (ADMIN_EMAILS, séparés par des virgules) — sans jamais toucher au
 * passwordHash. Contrairement à seedAdmin() (qui crée/écrase un compte
 * de service avec un mot de passe fixe), cette fonction sert à donner
 * les droits ADMIN à des comptes déjà créés normalement (register ou
 * Google), sans écraser leur vrai mot de passe.
 * Ignore silencieusement les emails qui n'existent pas encore en base.
 */
async function promoteExistingAdmins() {
  const raw = process.env.ADMIN_EMAILS;
  if (!raw) return;

  const emails = raw
    .split(',')
    .map((e) => e.trim())
    .filter(Boolean);

  for (const email of emails) {
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
      console.warn(`⚠️  ADMIN_EMAILS: aucun compte trouvé pour ${email}, ignoré.`);
      continue;
    }
    if (user.role === Role.ADMIN) {
      console.log(`ℹ️  ${email} est déjà ADMIN.`);
      continue;
    }
    await prisma.user.update({
      where: { email },
      data: { role: Role.ADMIN },
    });
    console.log(`✅ ${email} promu ADMIN (mot de passe inchangé).`);
  }
}

async function seedCatalog() {
  console.log('🧹 Nettoyage des données existantes...');
  await prisma.orderItem.deleteMany();
  await prisma.product.deleteMany();
  await prisma.category.deleteMany();

  console.log('📁 Création des catégories...');
  const categories = await Promise.all([
    prisma.category.create({ data: { name: 'Smartphones', slug: 'smartphones', emoji: '📱' } }),
    prisma.category.create({ data: { name: 'Laptops', slug: 'laptops', emoji: '💻' } }),
    prisma.category.create({ data: { name: 'Audio', slug: 'audio', emoji: '🎧' } }),
    prisma.category.create({ data: { name: 'Smart Home', slug: 'smart-home', emoji: '🏠' } }),
    prisma.category.create({ data: { name: 'Gaming', slug: 'gaming', emoji: '🎮' } }),
    prisma.category.create({ data: { name: 'Wearables', slug: 'wearables', emoji: '⌚' } }),
  ]);

  const catId = (name: string) => categories.find((c) => c.name === name)!.id;

  console.log('📦 Création des produits...');

  const products = [
    {
      name: 'Sony WH-1000XM5',
      slug: 'sony-wh-1000xm5',
      brand: 'Sony',
      categoryId: catId('Audio'),
      price: 279,
      originalPrice: 399,
      discountPercent: 30,
      stock: 12,
      isFeatured: true,
      description: 'Industry-leading noise canceling with eight microphones. Optimized for calls and voice control. Exceptional sound quality with 30-hour battery life.',
      imageUrl: `${IMG_BASE}/sony-wh1000xm5.jpg`,
      thumbnailUrl: `${IMG_BASE}/sony-wh1000xm5.jpg`,
      images: [`${IMG_BASE}/sony-wh1000xm5.jpg`],
      attributes: {
        specs: ['ANC', '30hr Battery', 'Hi-Res Audio'],
        specDetails: { 'Driver Size': '30mm', 'Frequency': '4Hz–40kHz', 'Weight': '250g', 'Connectivity': 'Bluetooth 5.2', 'Battery': '30 hours' },
        colors: [{ name: 'Midnight Black', hex: '#1a1a1a' }, { name: 'Platinum Silver', hex: '#c8bfaa' }],
      },
    },
    {
      name: 'Apple iPhone 15 Pro',
      slug: 'apple-iphone-15-pro',
      brand: 'Apple',
      categoryId: catId('Smartphones'),
      price: 999,
      originalPrice: 1199,
      discountPercent: 17,
      stock: 34,
      isFeatured: true,
      description: 'Titanium design meets the most pro camera system ever on iPhone. A17 Pro chip delivers unprecedented performance.',
      imageUrl: `${IMG_BASE}/iphone-15-pro.jpg`,
      thumbnailUrl: `${IMG_BASE}/iphone-15-pro.jpg`,
      images: [`${IMG_BASE}/iphone-15-pro.jpg`],
      attributes: {
        specs: ['A17 Pro Chip', '48MP Camera', 'USB-C'],
        specDetails: { 'Display': '6.1" OLED ProMotion', 'Chip': 'A17 Pro', 'Camera': '48MP Main + 12MP Ultra Wide', 'Battery': '3274 mAh', 'OS': 'iOS 17' },
        colors: [{ name: 'Natural Titanium', hex: '#c2b9a7' }, { name: 'Black Titanium', hex: '#3a3a3c' }, { name: 'White Titanium', hex: '#f5f5f0' }],
        storage: ['128GB', '256GB', '512GB', '1TB'],
      },
    },
    {
      name: 'MacBook Air M3',
      slug: 'macbook-air-m3',
      brand: 'Apple',
      categoryId: catId('Laptops'),
      price: 1099,
      originalPrice: 1299,
      discountPercent: 15,
      stock: 21,
      isFeatured: true,
      description: 'Strikingly thin design, exceptional performance with the M3 chip, and all-day battery life.',
      imageUrl: `${IMG_BASE}/macbook-air-m3.jpg`,
      thumbnailUrl: `${IMG_BASE}/macbook-air-m3.jpg`,
      images: [`${IMG_BASE}/macbook-air-m3.jpg`],
      attributes: {
        specs: ['M3 Chip', '18hr Battery'],
        specDetails: { 'Chip': 'Apple M3', 'RAM': '8GB/16GB', 'Storage': '256GB–2TB SSD', 'Display': '13.6" Liquid Retina', 'Battery': '18 hours' },
        colors: [{ name: 'Midnight', hex: '#1d1d3a' }, { name: 'Starlight', hex: '#f0e6d3' }],
      },
    },
    {
      name: 'Apple Watch Ultra 2',
      slug: 'apple-watch-ultra-2',
      brand: 'Apple',
      categoryId: catId('Wearables'),
      price: 599,
      originalPrice: 799,
      discountPercent: 25,
      stock: 21,
      isFeatured: true,
      description: 'The most rugged and capable Apple Watch, built for endurance, exploration, and adventure.',
      imageUrl: `${IMG_BASE}/apple-watch-ultra2.jpg`,
      thumbnailUrl: `${IMG_BASE}/apple-watch-ultra2.jpg`,
      images: [`${IMG_BASE}/apple-watch-ultra2.jpg`],
      attributes: {
        specs: ['GPS + Cellular', '36hr Battery'],
        specDetails: { 'Display': '49mm Always-On Retina', 'Water Resistance': '100m', 'Battery': '36 hours' },
        colors: [{ name: 'Titanium', hex: '#8a8a82' }],
      },
    },
    {
      name: 'Samsung Galaxy Buds3 Pro',
      slug: 'samsung-galaxy-buds3-pro',
      brand: 'Samsung',
      categoryId: catId('Audio'),
      price: 189,
      originalPrice: 249,
      discountPercent: 24,
      stock: 45,
      isFeatured: true,
      description: 'Premium sound with intelligent ANC, blade-shaped design for maximum comfort and stability.',
      imageUrl: `${IMG_BASE}/galaxy-buds3-pro.jpg`,
      thumbnailUrl: `${IMG_BASE}/galaxy-buds3-pro.jpg`,
      images: [`${IMG_BASE}/galaxy-buds3-pro.jpg`],
      attributes: {
        specs: ['ANC', '30hr Total'],
        specDetails: { 'Driver': '10mm + 6.1mm', 'Battery': '6h (30h with case)', 'Connectivity': 'Bluetooth 5.3' },
        colors: [{ name: 'Silver', hex: '#c7c9cc' }],
      },
    },
    {
      name: 'Logitech G Pro X Superlight 2',
      slug: 'logitech-g-pro-x-superlight-2',
      brand: 'Logitech',
      categoryId: catId('Gaming'),
      price: 119,
      originalPrice: 159,
      discountPercent: 25,
      stock: 60,
      isFeatured: false,
      description: 'Ultra-lightweight wireless gaming mouse trusted by esports pros, with HERO 2 sensor precision.',
      imageUrl: `${IMG_BASE}/logitech-superlight2.jpg`,
      thumbnailUrl: `${IMG_BASE}/logitech-superlight2.jpg`,
      images: [`${IMG_BASE}/logitech-superlight2.jpg`],
      attributes: {
        specs: ['HERO 2 Sensor', '95hr Battery'],
        specDetails: { 'Weight': '60g', 'DPI': 'up to 32000', 'Connectivity': 'LIGHTSPEED Wireless' },
        colors: [{ name: 'Black', hex: '#1a1a1a' }, { name: 'White', hex: '#ffffff' }],
      },
    },
    {
      name: 'Samsung Galaxy S24 Ultra',
      slug: 'samsung-galaxy-s24-ultra',
      brand: 'Samsung',
      categoryId: catId('Smartphones'),
      price: 1199,
      originalPrice: 1399,
      discountPercent: 14,
      stock: 40,
      isFeatured: false,
      description: 'The ultimate Galaxy experience with a built-in S Pen and a 200MP camera system.',
      imageUrl: `${IMG_BASE}/galaxy-s24-ultra.jpg`,
      thumbnailUrl: `${IMG_BASE}/galaxy-s24-ultra.jpg`,
      images: [`${IMG_BASE}/galaxy-s24-ultra.jpg`],
      attributes: {
        specs: ['200MP Camera', 'S Pen'],
        specDetails: { 'Display': '6.8" Dynamic AMOLED 2X', 'Chip': 'Snapdragon 8 Gen 3', 'Battery': '5000 mAh' },
        colors: [{ name: 'Titanium Black', hex: '#1a1a1a' }, { name: 'Titanium Gray', hex: '#8a8a8a' }],
        storage: ['256GB', '512GB', '1TB'],
      },
    },
    {
      name: 'Dell XPS 15 OLED',
      slug: 'dell-xps-15-oled',
      brand: 'Dell',
      categoryId: catId('Laptops'),
      price: 1799,
      originalPrice: 2199,
      discountPercent: 18,
      stock: 15,
      isFeatured: false,
      description: 'Stunning 4K OLED display, powerful Intel Core i9 performance for creators and professionals.',
      imageUrl: `${IMG_BASE}/dell-xps15-oled.jpg`,
      thumbnailUrl: `${IMG_BASE}/dell-xps15-oled.jpg`,
      images: [`${IMG_BASE}/dell-xps15-oled.jpg`],
      attributes: {
        specs: ['Intel Core i9', 'RTX 4070'],
        specDetails: { 'Display': '15.6" 4K OLED', 'RAM': '32GB', 'Storage': '1TB SSD', 'GPU': 'RTX 4070' },
        colors: [{ name: 'Platinum Silver', hex: '#c8bfaa' }],
      },
    },
    {
      name: 'Amazon Echo Show 10',
      slug: 'amazon-echo-show-10',
      brand: 'Amazon',
      categoryId: catId('Smart Home'),
      price: 149,
      originalPrice: 249,
      discountPercent: 40,
      stock: 50,
      isFeatured: false,
      description: 'Smart display that moves with you, with premium sound and motion tracking.',
      imageUrl: `${IMG_BASE}/echo-show10.jpg`,
      thumbnailUrl: `${IMG_BASE}/echo-show10.jpg`,
      images: [`${IMG_BASE}/echo-show10.jpg`],
      attributes: {
        specs: ['10" HD Display', 'Motion Tracking'],
        specDetails: { 'Display': '10.1" HD', 'Camera': '13MP', 'Connectivity': 'Wi-Fi, Bluetooth' },
        colors: [{ name: 'Charcoal', hex: '#3a3a3c' }],
      },
    },
    {
      name: 'iPad Pro M4 12.9"',
      slug: 'ipad-pro-m4-12-9',
      brand: 'Apple',
      categoryId: catId('Smartphones'),
      price: 1299,
      originalPrice: null,
      discountPercent: null,
      stock: 25,
      isFeatured: false,
      description: 'The thinnest Apple product ever, supercharged by the M4 chip with Tandem OLED display.',
      imageUrl: `${IMG_BASE}/ipad-pro-m4.jpg`,
      thumbnailUrl: `${IMG_BASE}/ipad-pro-m4.jpg`,
      images: [`${IMG_BASE}/ipad-pro-m4.jpg`],
      attributes: {
        specs: ['M4 Chip', 'Tandem OLED'],
        specDetails: { 'Display': '12.9" Tandem OLED', 'Chip': 'Apple M4', 'Battery': 'Up to 10 hours' },
        colors: [{ name: 'Space Black', hex: '#1a1a1a' }, { name: 'Silver', hex: '#e8e8e8' }],
        storage: ['256GB', '512GB', '1TB', '2TB'],
      },
    },
    {
      name: 'Razer BlackWidow V4 Pro',
      slug: 'razer-blackwidow-v4-pro',
      brand: 'Razer',
      categoryId: catId('Gaming'),
      price: 229,
      originalPrice: null,
      discountPercent: null,
      stock: 30,
      isFeatured: false,
      description: 'Premium mechanical gaming keyboard with a command dial and multi-function media roller.',
      imageUrl: `${IMG_BASE}/razer-blackwidow-v4.jpg`,
      thumbnailUrl: `${IMG_BASE}/razer-blackwidow-v4.jpg`,
      images: [`${IMG_BASE}/razer-blackwidow-v4.jpg`],
      attributes: {
        specs: ['Green Mechanical Switches', 'RGB Chroma'],
        specDetails: { 'Switch Type': 'Razer Green', 'Connectivity': 'Wired USB-C', 'Backlight': 'Razer Chroma RGB' },
        colors: [{ name: 'Black', hex: '#1a1a1a' }],
      },
    },
    {
      name: 'LG UltraWide 34" Curved',
      slug: 'lg-ultrawide-34-curved',
      brand: 'LG',
      categoryId: catId('Smart Home'),
      price: 449,
      originalPrice: null,
      discountPercent: null,
      stock: 18,
      isFeatured: false,
      description: 'Immersive 34-inch curved ultrawide monitor, ideal for productivity and gaming.',
      imageUrl: `${IMG_BASE}/lg-ultrawide-34.jpg`,
      thumbnailUrl: `${IMG_BASE}/lg-ultrawide-34.jpg`,
      images: [`${IMG_BASE}/lg-ultrawide-34.jpg`],
      attributes: {
        specs: ['3440x1440 WQHD', '144Hz'],
        specDetails: { 'Panel': 'IPS', 'Resolution': '3440x1440', 'Refresh Rate': '144Hz', 'Curvature': '1900R' },
        colors: [{ name: 'Black', hex: '#1a1a1a' }],
      },
    },
  ];

  for (const p of products) {
    await prisma.product.create({ data: p });
  }

  console.log(`✅ ${categories.length} catégories et ${products.length} produits créés.`);
}

async function main() {
  await seedAdmin();
  await promoteExistingAdmins();
  await seedCatalog();
}

main()
  .catch((e) => {
    console.error('❌ Erreur pendant le seed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });