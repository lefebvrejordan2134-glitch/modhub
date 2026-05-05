// api/webhook.js
// Reçoit les événements Stripe et envoie les clés de licence par email

const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

// Génère une clé de licence unique format XXXX-XXXX-XXXX-XXXX
function generateLicenseKey() {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  const segment = () => Array.from({ length: 4 }, () => chars[Math.floor(Math.random() * chars.length)]).join('');
  return [segment(), segment(), segment(), segment()].join('-');
}

// Envoie la clé par email via Resend (service email gratuit)
async function sendLicenseEmail(email, pluginName, licenseKey) {
  const RESEND_API_KEY = process.env.RESEND_API_KEY;
  if (!RESEND_API_KEY) {
    console.log('RESEND_API_KEY manquant — email non envoyé');
    console.log(`LICENCE GÉNÉRÉE: ${email} → ${pluginName} → ${licenseKey}`);
    return;
  }

  await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${RESEND_API_KEY}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      // ⚠️ Remplace par ton email vérifié sur Resend
      from: 'ModHub <noreply@TONDOMAINE.com>',
      to: email,
      subject: `🎮 Ta licence ${pluginName} — ModHub`,
      html: `
        <div style="font-family:monospace;background:#070b14;color:#c8e0ff;padding:40px;max-width:500px;margin:0 auto;border:1px solid rgba(0,245,255,0.2);">
          <h1 style="color:#00f5ff;font-size:20px;letter-spacing:3px;margin-bottom:4px;">MODHUB</h1>
          <p style="color:#7fa8cc;font-size:12px;margin-bottom:32px;">Paiement confirmé</p>
          
          <h2 style="color:#fff;font-size:16px;margin-bottom:8px;">${pluginName}</h2>
          <p style="color:#7fa8cc;font-size:13px;margin-bottom:24px;">Merci pour ton achat ! Voici ta clé de licence :</p>
          
          <div style="background:#0a1220;border:1px solid rgba(0,245,255,0.25);padding:20px;text-align:center;margin-bottom:24px;">
            <div style="font-size:11px;color:#3a5a78;letter-spacing:2px;margin-bottom:8px;">CLÉ DE LICENCE</div>
            <div style="font-size:20px;color:#00f5ff;letter-spacing:4px;font-weight:700;">${licenseKey}</div>
          </div>
          
          <p style="color:#7fa8cc;font-size:13px;margin-bottom:8px;"><strong style="color:#fff;">Comment activer :</strong></p>
          <ol style="color:#7fa8cc;font-size:13px;line-height:2;">
            <li>Va sur la boutique ModHub</li>
            <li>Clique sur "Mes Licences"</li>
            <li>Entre ta clé et clique "Activer"</li>
          </ol>
          
          <hr style="border-color:rgba(0,245,255,0.1);margin:24px 0;">
          <p style="color:#3a5a78;font-size:11px;">Support : réponds à cet email si tu as besoin d'aide.</p>
        </div>
      `
    })
  });
}

module.exports = async (req, res) => {
  if (req.method !== 'POST') return res.status(405).end();

  const sig = req.headers['stripe-signature'];
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

  let event;
  try {
    // Vérifier la signature Stripe (sécurité)
    const rawBody = await getRawBody(req);
    event = stripe.webhooks.constructEvent(rawBody, sig, webhookSecret);
  } catch (err) {
    console.error('Webhook signature error:', err.message);
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  // Traiter le paiement réussi
  if (event.type === 'checkout.session.completed') {
    const session = event.data.object;
    
    if (session.payment_status === 'paid') {
      const customerEmail = session.customer_details?.email;
      
      // Récupérer les items achetés
      try {
        const lineItems = await stripe.checkout.sessions.listLineItems(session.id, { expand: ['data.price.product'] });
        
        for (const item of lineItems.data) {
          const pluginName = item.price?.product?.name || 'Plugin ModHub';
          const licenseKey = generateLicenseKey();
          
          console.log(`Licence générée: ${customerEmail} → ${pluginName} → ${licenseKey}`);
          
          if (customerEmail) {
            await sendLicenseEmail(customerEmail, pluginName, licenseKey);
          }
        }
      } catch (err) {
        console.error('Erreur traitement licence:', err);
      }
    }
  }

  res.json({ received: true });
};

// Helper pour lire le body brut (requis pour vérification signature Stripe)
async function getRawBody(req) {
  return new Promise((resolve, reject) => {
    let data = '';
    req.on('data', chunk => data += chunk);
    req.on('end', () => resolve(data));
    req.on('error', reject);
  });
}
