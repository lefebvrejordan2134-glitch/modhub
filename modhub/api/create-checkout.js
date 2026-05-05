// api/create-checkout.js
// Vercel Serverless Function — crée une session Stripe Checkout

const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

module.exports = async (req, res) => {
  // CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  try {
    const { items } = req.body;
    if (!items || !items.length) return res.status(400).json({ error: 'Aucun item' });

    // Construire les line_items pour Stripe
    const line_items = items
      .filter(item => item.price_id) // ignorer les gratuits
      .map(item => ({
        price: item.price_id,
        quantity: item.qty || 1
      }));

    if (!line_items.length) return res.status(400).json({ error: 'Aucun item payant' });

    // Créer la session Stripe Checkout
    const session = await stripe.checkout.sessions.create({
      mode: 'payment',
      line_items,
      // ⚠️ Remplace YOUR_DOMAIN par ton vrai domaine (ex: https://modhub.vercel.app)
      success_url: `${process.env.SITE_URL || 'http://localhost:3000'}/?success=1&session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.SITE_URL || 'http://localhost:3000'}/?cancelled=1`,
      // Demander l'email client pour envoyer la licence
      customer_email: undefined, // Stripe le demande automatiquement
      payment_intent_data: {
        metadata: {
          source: 'modhub'
        }
      },
      // Permettre les codes promo si tu en crées sur Stripe
      allow_promotion_codes: true,
      // Metadata pour le webhook
      metadata: {
        plugin_ids: items.map(i => i.price_id).join(',')
      }
    });

    res.json({ url: session.url });
  } catch (err) {
    console.error('Stripe error:', err);
    res.status(500).json({ error: err.message });
  }
};
