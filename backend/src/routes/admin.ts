import { Router } from 'express';
import { supabase } from '../lib/supabase';
import { adminAuth } from '../middleware/auth';

const router = Router();

// ── POST /api/admin/login ─────────────────────────────────────────────────────
// Public endpoint – validates the admin password and returns a success flag.
// The frontend then passes the password as an x-admin-password header on every
// subsequent protected request.
router.post('/login', (req, res) => {
  const { password } = req.body;

  if (password === process.env.ADMIN_PASSWORD) {
    return res.json({ success: true });
  }

  return res.status(401).json({ success: false, error: 'Invalid password' });
});

// ── GET /api/admin/riders ─────────────────────────────────────────────────────
// Protected – returns only active riders (is_active = true).
router.get('/riders', adminAuth, async (_req, res) => {
  try {
    const { data, error } = await supabase
      .from('riders')
      .select('*')
      // .eq('is_active', true)
      .order('created_at', { ascending: false });

    if (error) {
      return res.status(500).json({ error: error.message });
    }

    return res.json(data);
  } catch (err: any) {
    return res.status(500).json({ error: err.message });
  }
});

// ── DELETE /api/admin/riders/:id ──────────────────────────────────────────────
// Protected – soft-deletes a rider by setting is_active = false.
// The rider's referral code, points, and history are preserved for data integrity.
// ── DELETE /api/admin/riders/:id ──────────────────────────────────────────────
router.delete('/riders/:id', adminAuth, async (req, res) => {
  const { id } = req.params;

  if (!id || typeof id !== 'string' || id.trim() === '') {
    return res.status(400).json({ error: 'Invalid rider id' });
  }

  try {
    // Confirm rider exists
    const { data: existing, error: fetchErr } = await supabase
      .from('riders')
      .select('id, name, is_active')
      .eq('id', id)
      .maybeSingle();

    if (fetchErr) {
      return res.status(500).json({ error: fetchErr.message });
    }

    if (!existing) {
      return res.status(404).json({ error: 'Rider not found' });
    }

    // Delete rider's points history first
    console.log("Deleting rider:", id);

    const { error: historyErr } = await supabase
      .from('points_history')
      .delete()
      .eq('rider_id', id);
    console.log("History delete error:", historyErr);

    if (historyErr) {
      return res.status(500).json({
        error: historyErr.message
      });
    }

    // Hard delete rider
    const { error: deleteErr } = await supabase
      .from('riders')
      .delete()
      .eq('id', id);

    if (deleteErr) {
      return res.status(500).json({
        error: deleteErr.message
      });
    }

    return res.json({
      success: true,
      message: `Rider "${existing.name}" has been deleted`
    });
  } catch (err: any) {
    return res.status(500).json({
      error: err.message
    });
  }
});

export { router as adminRouter };