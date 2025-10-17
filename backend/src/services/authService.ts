import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { query } from '../db';
import { User } from '../models/types';

const SALT_ROUNDS = 10;
const JWT_SECRET = process.env.JWT_SECRET || 'dev-secret-change-in-production';

export async function registerUser(email: string, password: string, name?: string): Promise<{ user: User; token: string }> {
  // Check if user exists
  const existingUser = await query('SELECT id FROM users WHERE email = $1', [email]);
  if (existingUser.rows.length > 0) {
    throw new Error('User already exists');
  }

  // Hash password
  const password_hash = await bcrypt.hash(password, SALT_ROUNDS);

  // Insert user
  const result = await query(
    'INSERT INTO users (email, password_hash, name) VALUES ($1, $2, $3) RETURNING id, email, name, created_at',
    [email, password_hash, name]
  );

  const user = result.rows[0];
  const token = jwt.sign({ userId: user.id, email: user.email }, JWT_SECRET, { expiresIn: '7d' });

  return { user, token };
}

export async function loginUser(email: string, password: string): Promise<{ user: User; token: string }> {
  // Get user
  const result = await query('SELECT * FROM users WHERE email = $1', [email]);
  if (result.rows.length === 0) {
    throw new Error('Invalid credentials');
  }

  const user = result.rows[0];

  // Verify password
  const isValid = await bcrypt.compare(password, user.password_hash);
  if (!isValid) {
    throw new Error('Invalid credentials');
  }

  // Generate token
  const token = jwt.sign({ userId: user.id, email: user.email }, JWT_SECRET, { expiresIn: '7d' });

  // Remove password hash from response
  delete user.password_hash;

  return { user, token };
}

export async function getUserById(userId: number): Promise<User | null> {
  const result = await query('SELECT id, email, name, created_at FROM users WHERE id = $1', [userId]);
  return result.rows.length > 0 ? result.rows[0] : null;
}

export function verifyToken(token: string): { userId: number; email: string } {
  try {
    return jwt.verify(token, JWT_SECRET) as { userId: number; email: string };
  } catch (err) {
    throw new Error('Invalid token');
  }
}
