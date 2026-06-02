-- Run this first in your Supabase SQL editor

CREATE TABLE riders (
  id               UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name             TEXT NOT NULL,
  phone            TEXT NOT NULL UNIQUE,
  city             TEXT NOT NULL,
  language         TEXT NOT NULL DEFAULT 'en',
  platform         TEXT NOT NULL,
  experience_years INTEGER DEFAULT 0,
  vehicle_type     TEXT,
  vehicle_model    TEXT,
  fueling_method   TEXT,
  weekly_cost      INTEGER DEFAULT 0,
  maintenance_cost INTEGER DEFAULT 0,
  general_challenges TEXT[],
  ev_challenges    TEXT[],
  petrol_challenges TEXT[],
  accidental_insurance BOOLEAN DEFAULT false,
  health_insurance BOOLEAN DEFAULT false,
  accident_expense BOOLEAN DEFAULT false,
  ev_interest      TEXT,
  switch_motivators TEXT[],
  interested_services TEXT[],
  referral_code    TEXT UNIQUE,
  referred_by      UUID REFERENCES riders(id),
  total_points     INTEGER DEFAULT 10,
  referral_count   INTEGER DEFAULT 0,
  rider_segment    TEXT,
  qr_code_url      TEXT,
  created_at       TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE referrals (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  referrer_id     UUID NOT NULL REFERENCES riders(id),
  referred_rider_id UUID NOT NULL REFERENCES riders(id),
  points_awarded  INTEGER DEFAULT 5,
  created_at      TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE points_history (
  id        UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  rider_id  UUID NOT NULL REFERENCES riders(id),
  action    TEXT NOT NULL,
  points    INTEGER NOT NULL,
  timestamp TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes for common queries
CREATE INDEX idx_riders_phone   ON riders(phone);
CREATE INDEX idx_riders_segment ON riders(rider_segment);
CREATE INDEX idx_referrals_referrer ON referrals(referrer_id);
CREATE INDEX idx_points_rider   ON points_history(rider_id);