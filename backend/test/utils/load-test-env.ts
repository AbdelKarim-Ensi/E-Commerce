import * as dotenv from 'dotenv';
import * as path from 'path';

// Force NODE_ENV=test AVANT que ConfigModule ne lise process.env, pour que
// ConfigModule.forRoot() dans app.module.ts charge .env.test au lieu de .env
process.env.NODE_ENV = 'test';

dotenv.config({ path: path.resolve(__dirname, '../../.env.test') });