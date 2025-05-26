import mysql from 'mysql2/promise';
import dotenv from 'dotenv';
dotenv.config();

console.log('DB_HOST:', process.env.DB_HOST);
console.log('DB_USER:', process.env.DB_USER);
console.log('DB_PASSWORD:', process.env.DB_PASSWORD ? '***' : '(empty)');
console.log('DB_NAME:', process.env.DB_NAME);
console.log('DB_CONNECTION_LIMIT:', process.env.DB_CONNECTION_LIMIT);


const db = mysql.createPool({
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || '',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || '',
  waitForConnections: true,
  connectionLimit: parseInt(process.env.DB_CONNECTION_LIMIT || '10', 10),
});

export default db;