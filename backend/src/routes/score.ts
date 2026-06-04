// backend/src/routes/score.ts
import { Router } from 'express';
import { supabase } from '../lib/supabase';
const router = Router();


router.get('/:phone', async (req, res) => {
  const { data: rider } = await supabase
    .from('riders')
    .select('name,referral_code,total_points,referral_count,rider_segment,city,platform')
    .eq('phone', req.params.phone)
    // .eq('is_active', true)   // ← inactive riders get a 404 on /score
    .single();
  if (!rider) return res.status(404).json({ error: 'not_found' });

  const milestones = [
    { target: 10,  bonus: 100, achieved: rider.referral_count >= 10 },
    { target: 25,  bonus: 300, achieved: rider.referral_count >= 25 },
    { target: 50,  bonus: 500, achieved: rider.referral_count >= 50 },
  ];
  return res.json({ ...rider, milestones });
});

export { router as scoreRouter };