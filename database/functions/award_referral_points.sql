-- Run in Supabase SQL editor
CREATE OR REPLACE FUNCTION award_referral_points(referrer_id UUID, referred_id UUID)
RETURNS void LANGUAGE plpgsql AS $$
DECLARE new_count INTEGER; bonus INTEGER := 0;
BEGIN
  UPDATE riders SET total_points = total_points + 5,
    referral_count = referral_count + 1
  WHERE id = referrer_id
  RETURNING referral_count INTO new_count;

  INSERT INTO referrals(referrer_id, referred_rider_id, points_awarded)
  VALUES (referrer_id, referred_id, 5);

  INSERT INTO points_history(rider_id, action, points)
  VALUES (referrer_id, 'referral', 5);

  -- Milestone bonuses
  IF new_count = 10 THEN bonus := 100;
  ELSIF new_count = 25 THEN bonus := 300;
  ELSIF new_count = 50 THEN bonus := 500;
  END IF;

  IF bonus > 0 THEN
    UPDATE riders SET total_points = total_points + bonus WHERE id = referrer_id;
    INSERT INTO points_history(rider_id, action, points)
    VALUES (referrer_id, 'milestone_' || new_count, bonus);
  END IF;
END;
$$;