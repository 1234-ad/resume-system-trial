import { Router, Request, Response } from 'express';
import { registerUser, loginUser, getUserById } from '../services/authService';
import { authenticateToken, AuthRequest } from '../middleware/auth';

const router = Router();

router.post('/register', async (req: Request, res: Response) => {
  try {
    const { email, password, name } = req.body;
    
    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password required' });
    }

    const { user, token } = await registerUser(email, password, name);
    res.status(201).json({ user, token });
  } catch (err: any) {
    res.status(400).json({ error: err.message || 'Registration failed' });
  }
});

router.post('/login', async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;
    
    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password required' });
    }

    const { user, token } = await loginUser(email, password);
    res.json({ user, token });
  } catch (err: any) {
    res.status(401).json({ error: err.message || 'Login failed' });
  }
});

router.get('/profile', authenticateToken, async (req: AuthRequest, res: Response) => {
  try {
    if (!req.userId) {
      return res.status(401).json({ error: 'Not authenticated' });
    }

    const user = await getUserById(req.userId);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.json(user);
  } catch (err: any) {
    res.status(500).json({ error: err.message || 'Failed to get profile' });
  }
});

export default router;
