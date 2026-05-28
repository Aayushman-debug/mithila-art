require('dotenv').config();
const crypto = require('crypto');

const BASE = process.env.BACKEND_URL || 'http://localhost:5000';

async function post(path, body) {
  const res = await fetch(BASE + path, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });
  return res.json();
}

(async () => {
  try {
    console.log('Creating test commission...');
    const create = await post('/commissions', {
      name: 'Test Buyer',
      email: 'test.payment@example.com',
      phone: '9876543210',
      location: 'Test City',
      style: 'Traditional',
      size: '12x16',
      colors: 'red, black',
      description: 'Test commission for payment flow',
      timeline: '2 weeks'
    });
    console.log('Create commission response:', create);

    if (!create.success) throw new Error('Create commission failed');
    const commissionId = create.commissionId;

    console.log('Approving commission...');
    const approve = await post('/admin/approve-commission', { commissionId, quotedBudget: 500 });
    console.log('Approve response:', approve);
    if (!approve.success) throw new Error('Approve failed');

    console.log('Creating Razorpay order...');
    const order = await post('/create-order', { commissionId, amount: 500 });
    console.log('Create order response:', order);
    if (!order.success) throw new Error('Order create failed');

    // simulate a payment id and signature using the test secret from env
    const paymentId = 'pay_' + Date.now();
    const orderId = order.orderId;
    const hmac = crypto.createHmac('sha256', process.env.RAZORPAY_KEY_SECRET);
    hmac.update(orderId + '|' + paymentId);
    const signature = hmac.digest('hex');

    console.log('Verifying payment...');
    const verify = await post('/verify-payment', { commissionId, paymentId, orderId, signature });
    console.log('Verify response:', verify);
  } catch (err) {
    console.error('Test flow error:', err);
  }
})();
