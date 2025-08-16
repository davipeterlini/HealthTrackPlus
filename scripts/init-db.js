import { drizzle } from 'drizzle-orm/neondb';
import { neon } from '@neondatabase/serverless';
import 'dotenv/config';

const sql = neon(process.env.DATABASE_URL);
const db = drizzle(sql);

async function main() {
  console.log('Setting up database...');
  
  try {
    // Add any initial seed data here if needed
    console.log('Database setup completed successfully.');
  } catch (error) {
    console.error('Error setting up database:', error);
    process.exit(1);
  }
}

main();