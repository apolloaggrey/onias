import mysql from 'mysql2/promise';
import fs from 'fs';

const dbConfig: mysql.ConnectionOptions = {
  host: process.env.DB_HOST,
  port: Number(process.env.DB_PORT),
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  ssl: process.env.DB_SSL_CA
    ? { ca: fs.readFileSync(process.env.DB_SSL_CA) }
    : undefined,
};

export async function getConnection() {
  if (!process.env.DB_HOST || !process.env.DB_USER || !process.env.DB_PASSWORD || !process.env.DB_NAME) {
    throw new Error(
      'Missing required environment variables: DB_HOST, DB_USER, DB_PASSWORD, or DB_NAME'
    );
  }

  try {
    console.log('Attempting to connect with config:', {
      host: dbConfig.host,
      port: dbConfig.port,
      user: dbConfig.user,
      database: dbConfig.database,
      ssl: !!dbConfig.ssl,
    });
    const connection = await mysql.createConnection(dbConfig);
    console.log('Database connected successfully');
    return connection;
  } catch (error) {
    console.error('Database connection failed:', error);
    throw error;
  }
}