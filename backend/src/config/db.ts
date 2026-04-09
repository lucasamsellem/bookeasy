import mysql from 'mysql2/promise';
import dotenv from 'dotenv';
dotenv.config();

const fs = require('fs');

export const db = mysql.createPool({
  uri: process.env.DATABASE_URL,
  ssl: {
    ca: fs.readFileSync(process.env.CA_PATH),
    rejectUnauthorized: true,
  },
});

export async function connectDB() {
  try {
    const connection = await db.getConnection();
    console.log('✅ MySQL connected');
    connection.release();
  } catch (error) {
    console.error('❌ MySQL connection failed:', error);
    process.exit(1);
  }
}
