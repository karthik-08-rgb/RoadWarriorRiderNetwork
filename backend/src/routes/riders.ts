import { Router, Request, Response } from 'express';
import { supabase } from '../lib/supabase';
import QRCode from 'qrcode';
import twilio from 'twilio';

const router = Router();


const twilioClient = twilio(
  process.env.TWILIO_ACCOUNT_SID || '',
  process.env.TWILIO_AUTH_TOKEN || ''
);

function generateCode(): string {
  return 'RW-' + Math.floor(1000 + Math.random() * 9000);
}

function segmentRider(data: any): string {
  if (data.vehicle_type === 'Electric Two Wheeler') {
    return 'EV Rider';
  }

  if (!data.accidental_insurance && !data.health_insurance) {
    return 'Insurance Lead';
  }

  if (
    ['Open to EV', 'Need More Information'].includes(
      data.ev_interest
    )
  ) {
    return 'Hot EV Lead';
  }

  return 'Retrofit Lead';
}

const WA_MESSAGES: Record<
  string,
  (name: string, code: string) => string
> = {
  en: (name, code) =>
    `Welcome ${name}!

You are now registered.

Referral Code: ${code}

Share with riders to earn rewards.`,

  hi: (name, code) =>
    `Namaste ${name} bhai!

Aapka registration ho gaya.

Referral Code: ${code}

Share karke points kamao.`,

  kn: (name, code) =>
    `Namaskara ${name}!

Nimma registration yashasviyagi poornagide.

Referral Code: ${code}

Friends jothe share madi points galisi.`
};

router.post('/', async (req: Request, res: Response) => {
  try {
    const body = req.body;

    const { data: existing } = await supabase
      .from('riders')
      .select('id,name,referral_code,qr_code_url,total_points,referral_count')
      .eq('phone', body.phone)
      .maybeSingle();

    if (existing) {
      return res.status(409).json({
        error: 'already_registered',
        rider: existing
      });
    }

    let code = generateCode();

    while (true) {
      const { data } = await supabase
        .from('riders')
        .select('id')
        .eq('referral_code', code)
        .maybeSingle();

      if (!data) {
        break;
      }

      code = generateCode();
    }

    let referrerId: string | null = null;

    if (body.referral_code) {
      const { data: ref } = await supabase
        .from('riders')
        .select('id')
        .eq('referral_code', body.referral_code)
        .maybeSingle();

      if (ref) {
        referrerId = ref.id;
      }
    }

    const segment = segmentRider(body);

    const { data: rider, error: insertErr } = await supabase
      .from('riders')
      .insert({
        name: body.name,
        phone: body.phone,
        city: body.city,
        language: body.language || 'en',
        platform: body.platform,
        experience_years: body.experience_years || 0,
        vehicle_type: body.vehicle_type,
        vehicle_model: body.vehicle_model,
        fueling_method: body.fueling_method,
        weekly_cost: body.weekly_cost,
        maintenance_cost: body.maintenance_cost,
        general_challenges: body.general_challenges || [],
        ev_challenges: body.ev_challenges || [],
        petrol_challenges: body.petrol_challenges || [],
        accidental_insurance:
          body.accidental_insurance || false,
        health_insurance:
          body.health_insurance || false,
        accident_expense:
          body.accident_expense || false,
        ev_interest: body.ev_interest,
        switch_motivators:
          body.switch_motivators || [],
        interested_services:
          body.interested_services || [],
        referral_code: code,
        referred_by: referrerId,
        total_points: 10,
        referral_count: 0,
        rider_segment: segment
      })
      .select()
      .single();

    if (insertErr) {
      return res.status(500).json({
        error: insertErr.message
      });
    }

    if (referrerId) {
      await supabase.rpc('award_referral_points', {
        referrer_id: referrerId,
        referred_id: rider.id
      });
    }

    const qrUrl = `${process.env.FRONTEND_URL}/register?ref=${code}`;

    const qrDataUrl = await QRCode.toDataURL(qrUrl);

    await supabase
      .from('riders')
      .update({
        qr_code_url: qrDataUrl
      })
      .eq('id', rider.id);

    // const lang = body.language || 'en';

    // const msgFn =
    //   WA_MESSAGES[lang] || WA_MESSAGES.en;

    // try {
    //   await twilioClient.messages.create({
    //     from: `whatsapp:${process.env.TWILIO_WHATSAPP_NUMBER}`,
    //     to: `whatsapp:+91${body.phone}`,
    //     body: msgFn(body.name, code)
    //   });
    // } catch (waErr) {
    //   console.error(
    //     'WhatsApp send failed:',
    //     waErr
    //   );
    // }
    console.log("WhatsApp disabled for testing");

    await supabase
      .from('points_history')
      .insert({
        rider_id: rider.id,
        action: 'registration',
        points: 10
      });

    return res.status(201).json({
      success: true,
      rider: {
        ...rider,
        qr_code_url: qrDataUrl
      }
    });
  } catch (err: any) {
    console.error(err);

    return res.status(500).json({
      error: err.message
    });
  }
});

export { router as ridersRouter };