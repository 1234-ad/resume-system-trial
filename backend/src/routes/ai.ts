import { Router, Request, Response } from 'express';
import { generateSummary } from '../services/aiService';

const router = Router();

router.post('/generate-summary', async (req: Request, res: Response) => {
  const { achievements = [] } = req.body;
  try {
    const summary = await generateSummary(achievements);
    res.json({ summary });
  } catch (err: any) {
    res.status(500).json({ error: err.message || 'generation failed' });
  }
});

router.post('/optimize-content', async (req: Request, res: Response) => {
  const { content } = req.body;
  try {
    // Placeholder for content optimization
    res.json({ optimizedContent: content, suggestions: [] });
  } catch (err: any) {
    res.status(500).json({ error: err.message || 'optimization failed' });
  }
});

export default router;
