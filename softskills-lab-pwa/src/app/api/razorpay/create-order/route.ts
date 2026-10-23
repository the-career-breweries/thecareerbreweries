import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  try {
    const { bundle, email, name } = await req.json();

    const keyId = process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID;
    const keySecret = process.env.RAZORPAY_KEY_SECRET;

    // Pricing in paise (INR)
    // Student Bundle: ₹499 -> 49900 paise
    // Professional Bundle: ₹999 -> 99900 paise
    const amountInPaise = bundle === 'pro' ? 99900 : 49900;
    const bundleLabel = bundle === 'pro' ? 'Professional Bundle' : 'Student Bundle';

    // If keys not yet configured, return fallback signal for demo mode
    if (!keyId || !keySecret) {
      return NextResponse.json({
        demo: true,
        message: 'Razorpay keys not configured in .env.local. Operating in Instant Demo Mode.',
        amount: amountInPaise,
        currency: 'INR'
      });
    }

    // Generate unique receipt id
    const receiptId = `rcpt_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;

    // Call Razorpay Orders API directly via native fetch (Zero extra dependencies)
    const authHeader = Buffer.from(`${keyId}:${keySecret}`).toString('base64');
    const response = await fetch('https://api.razorpay.com/v1/orders', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Basic ${authHeader}`
      },
      body: JSON.stringify({
        amount: amountInPaise,
        currency: 'INR',
        receipt: receiptId,
        notes: {
          bundle,
          bundleLabel,
          customer_email: email || 'learner@tcb.edu',
          customer_name: name || 'TCB Learner'
        }
      })
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error('Razorpay Order Creation Failed:', errorData);
      return NextResponse.json(
        { error: errorData?.error?.description || 'Failed to create Razorpay order' },
        { status: 500 }
      );
    }

    const orderData = await response.json();

    return NextResponse.json({
      demo: false,
      orderId: orderData.id,
      amount: orderData.amount,
      currency: orderData.currency,
      keyId
    });
  } catch (error: any) {
    console.error('Create Order Error:', error);
    return NextResponse.json(
      { error: error?.message || 'Internal Server Error' },
      { status: 500 }
    );
  }
}
