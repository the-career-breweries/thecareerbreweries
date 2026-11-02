import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  try {
    const { bundle } = await req.json();

    if (bundle !== 'student' && bundle !== 'pro') {
      return NextResponse.json({ error: 'Invalid bundle selected' }, { status: 400 });
    }

    const amountInPaise = bundle === 'pro' ? 99900 : 49900;
    const keyId =
      process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID ||
      process.env.RAZORPAY_KEY_ID ||
      'rzp_live_TJN5b2o72kLRPP';
    const keySecret =
      process.env.RAZORPAY_KEY_SECRET ||
      'xrwixrkauX7UGV3vVzG5rkXV';

    const auth = Buffer.from(`${keyId}:${keySecret}`).toString('base64');

    const response = await fetch('https://api.razorpay.com/v1/orders', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Basic ${auth}`
      },
      body: JSON.stringify({
        amount: amountInPaise,
        currency: 'INR',
        receipt: `tcb_${bundle}_${Date.now().toString().slice(-8)}`,
        notes: {
          product: bundle === 'pro' ? 'The Professional Bundle' : 'The Student Bundle',
          platform: 'TCB Softskills Lab'
        }
      })
    });

    const data = await response.json();

    if (!response.ok) {
      return NextResponse.json(
        { error: data.error?.description || 'Failed to initialize Razorpay order' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      orderId: data.id,
      amount: data.amount,
      currency: data.currency,
      keyId
    });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Server error';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
