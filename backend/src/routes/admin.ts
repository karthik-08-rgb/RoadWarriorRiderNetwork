import { Router } from 'express';
import { supabase } from '../lib/supabase';

const router = Router();

router.post('/login', (req, res) => {
  const { password } = req.body;

  if (password === process.env.ADMIN_PASSWORD) {
    return res.json({
      success: true
    });
  }

  return res.status(401).json({
    success: false,
    error: 'Invalid password'
  });
});

router.get('/riders', async (_req, res) => {
  try {
    const { data, error } = await supabase
      .from('riders')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      return res.status(500).json({
        error: error.message
      });
    }

    return res.json(data);
  } catch (err: any) {
    return res.status(500).json({
      error: err.message
    });
  }
});

export { router as adminRouter };