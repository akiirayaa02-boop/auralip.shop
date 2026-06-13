const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

exports.handler = async (event) => {
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: 'Method Not Allowed' };
  }

  // Recibe los productos del carrito del cliente
  const { items } = JSON.parse(event.body); 

  try {
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: items, // Formato esperado: [{price: 'price_xxx', quantity: 2}]
      mode: 'payment',
      success_url: `${process.env.URL}/exito`,
      cancel_url: `${process.env.URL}/cancelado`,
    });

    return {
      statusCode: 200,
      body: JSON.stringify({ url: session.url }),
    };
  } catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: error.message }),
    };
  }
};