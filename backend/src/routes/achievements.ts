import { Router, Request, Response } from 'express';
import { authenticateToken, AuthRequest } from '../middleware/auth';
import { query } from '../db';

const router = Router();

// Get all achievements for authenticated user
router.get('/', authenticateToken, async (req: AuthRequest, res: Response) => {
  try {
    const result = await query(
      'SELECT * FROM achievements WHERE user_id = $1 ORDER BY start_date DESC',
      [req.userId]
    );
    res.json(result.rows);
  } catch (err: any) {
    res.status(500).json({ error: err.message || 'Failed to fetch achievements' });
  }
});

// Get single achievement
router.get('/:id', authenticateToken, async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    const result = await query(
      'SELECT * FROM achievements WHERE id = $1 AND user_id = $2',
      [id, req.userId]
    );
    
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Achievement not found' });
    }
    
    res.json(result.rows[0]);
  } catch (err: any) {
    res.status(500).json({ error: err.message || 'Failed to fetch achievement' });
  }
});

// Create new achievement
router.post('/', authenticateToken, async (req: AuthRequest, res: Response) => {
  try {
    const { type, title, description, start_date, end_date } = req.body;
    
    if (!type || !title) {
      return res.status(400).json({ error: 'Type and title are required' });
    }

    const result = await query(
      'INSERT INTO achievements (user_id, type, title, description, start_date, end_date, verified) VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *',
      [req.userId, type, title, description, start_date, end_date, false]
    );
    
    res.status(201).json(result.rows[0]);
  } catch (err: any) {
    res.status(500).json({ error: err.message || 'Failed to create achievement' });
  }
});

// Update achievement
router.put('/:id', authenticateToken, async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    const { type, title, description, start_date, end_date, verified } = req.body;

    const result = await query(
      'UPDATE achievements SET type = COALESCE($1, type), title = COALESCE($2, title), description = COALESCE($3, description), start_date = COALESCE($4, start_date), end_date = COALESCE($5, end_date), verified = COALESCE($6, verified) WHERE id = $7 AND user_id = $8 RETURNING *',
      [type, title, description, start_date, end_date, verified, id, req.userId]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Achievement not found' });
    }

    res.json(result.rows[0]);
  } catch (err: any) {
    res.status(500).json({ error: err.message || 'Failed to update achievement' });
  }
});

// Delete achievement
router.delete('/:id', authenticateToken, async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    const result = await query(
      'DELETE FROM achievements WHERE id = $1 AND user_id = $2 RETURNING id',
      [id, req.userId]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Achievement not found' });
    }

    res.json({ message: 'Achievement deleted successfully' });
  } catch (err: any) {
    res.status(500).json({ error: err.message || 'Failed to delete achievement' });
  }
});

export default router;
