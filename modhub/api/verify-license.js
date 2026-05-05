// api/verify-license.js
// Vérifie qu'une clé de licence est valide

// En production, tu stockeras les licences dans une base de données (ex: PlanetScale, Supabase)
// Pour l'instant, on utilise un simple JSON stocké dans les variables d'environnement Vercel

module.exports = async (req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  const { key } = req.body;
  if (!key) return res.status(400).json({ valid: false, error: 'Clé manquante' });

  // TODO: Remplace par une vraie DB (Supabase, PlanetScale, etc.)
  // Exemple de vérification basique — en prod tu cherches dans ta DB
  const licenseDb = JSON.parse(process.env.LICENSES_JSON || '{}');
  
  if (licenseDb[key]) {
    return res.json({ 
      valid: true, 
      plugin_name: licenseDb[key].plugin_name,
      activated_at: new Date().toISOString()
    });
  }

  return res.json({ valid: false });
};
