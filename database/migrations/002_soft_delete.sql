-- ============================================================
-- Migration: 002_soft_delete.sql
-- Adds soft-delete support to the riders table.
-- Run this in your Supabase SQL editor AFTER 001_initial_schema.sql
-- ============================================================

-- 1. Add is_active column (defaults TRUE so all existing riders stay visible)
ALTER TABLE riders
  ADD COLUMN IF NOT EXISTS is_active BOOLEAN NOT NULL DEFAULT TRUE;

-- 2. Index so WHERE is_active = TRUE queries stay fast
CREATE INDEX IF NOT EXISTS idx_riders_is_active ON riders(is_active);

-- 3. Composite index for the most common admin query pattern
CREATE INDEX IF NOT EXISTS idx_riders_active_created
  ON riders(is_active, created_at DESC);

-- ============================================================
-- VERIFY: after running, check the column exists:
--   SELECT column_name, data_type, column_default
--   FROM information_schema.columns
--   WHERE table_name = 'riders' AND column_name = 'is_active';
-- ============================================================