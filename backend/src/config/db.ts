import mysql from 'mysql2/promise';

export const db = mysql.createPool({
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'bookeasy',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
});

export async function connectDB() {
  try {
    const connection = await db.getConnection();
    console.log('MySQL connected');
    connection.release();
  } catch (error) {
    console.error('MySQL connection failed:', error);
    process.exit(1);
  }
}
