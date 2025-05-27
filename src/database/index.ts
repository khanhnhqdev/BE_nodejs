import mysql from 'mysql2/promise';
import dotenv from 'dotenv';
dotenv.config();

const db = mysql.createPool({
	host: process.env.DB_HOST || 'localhost',
	user: process.env.DB_USER || '',
	password: process.env.DB_PASSWORD || '',
	database: process.env.DB_NAME || '',
	waitForConnections: true,
	connectionLimit: parseInt(process.env.DB_CONNECTION_LIMIT || '10', 10),
});

export default db;