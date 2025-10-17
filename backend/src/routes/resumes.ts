import { Router, Request, Response } from 'express';
import { authenticateToken, AuthRequest } from '../middleware/auth';
import { query } from '../db';

const router = Router();

// Get all resumes for authenticated user
router.get('/', authenticateToken, async (req: AuthRequest, res: Response) => {
  try {
    const result = await query(
      'SELECT id, user_id, title, content, template, created_at, updated_at FROM resumes WHERE user_id = $1 ORDER BY updated_at DESC',
      [req.userId]
    );
    res.json(result.rows);
  } catch (err: any) {
    res.status(500).json({ error: err.message || 'Failed to fetch resumes' });
  }
});

// Get single resume
router.get('/:id', authenticateToken, async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    const result = await query(
      'SELECT * FROM resumes WHERE id = $1 AND user_id = $2',
      [id, req.userId]
    );
    
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Resume not found' });
    }
    
    res.json(result.rows[0]);
  } catch (err: any) {
    res.status(500).json({ error: err.message || 'Failed to fetch resume' });
  }
});

// Create new resume
router.post('/', authenticateToken, async (req: AuthRequest, res: Response) => {
  try {
    const { title, content, template } = req.body;
    
    if (!title) {
      return res.status(400).json({ error: 'Title is required' });
    }

    const result = await query(
      'INSERT INTO resumes (user_id, title, content, template) VALUES ($1, $2, $3, $4) RETURNING *',
      [req.userId, title, content || {}, template || 'default']
    );
    
    res.status(201).json(result.rows[0]);
  } catch (err: any) {
    res.status(500).json({ error: err.message || 'Failed to create resume' });
  }
});

// Update resume
router.put('/:id', authenticateToken, async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    const { title, content, template } = req.body;

    const result = await query(
      'UPDATE resumes SET title = COALESCE($1, title), content = COALESCE($2, content), template = COALESCE($3, template), updated_at = NOW() WHERE id = $4 AND user_id = $5 RETURNING *',
      [title, content, template, id, req.userId]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Resume not found' });
    }

    res.json(result.rows[0]);
  } catch (err: any) {
    res.status(500).json({ error: err.message || 'Failed to update resume' });
  }
});

// Delete resume
router.delete('/:id', authenticateToken, async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    const result = await query(
      'DELETE FROM resumes WHERE id = $1 AND user_id = $2 RETURNING id',
      [id, req.userId]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Resume not found' });
    }

    res.json({ message: 'Resume deleted successfully' });
  } catch (err: any) {
    res.status(500).json({ error: err.message || 'Failed to delete resume' });
  }
});

export default router;
