import dotenv from 'dotenv';
import { createApp } from './app.js';
import { runMigrations } from './migrate.js';
import { seedDatabase } from './seed.js';

dotenv.config();

const port = Number(process.env.PORT || 3001);

await runMigrations();
await seedDatabase();

const app = createApp();

app.listen(port, () => {
  console.log(`API server listening on http://127.0.0.1:${port}`);
});
