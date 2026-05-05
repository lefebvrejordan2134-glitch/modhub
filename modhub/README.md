# 🎮 ModHub — Guide de mise en ligne

## Ce que tu as dans ce dossier

```
modhub/
├── public/
│   ├── index.html      ← La boutique complète
│   ├── plugins.js      ← TES plugins (à modifier)
│   └── store.js        ← Logique boutique (ne pas toucher)
├── api/
│   ├── create-checkout.js  ← Crée la session Stripe
│   ├── webhook.js          ← Envoie les licences par email
│   └── verify-license.js  ← Vérifie les clés
├── vercel.json         ← Config déploiement
├── package.json
└── README.md           ← Ce fichier
```

---

## ÉTAPE 1 — Créer ton compte Stripe (5 min)

1. Va sur **https://stripe.com** → "Commencer"
2. Crée ton compte avec ton email
3. Active ton compte (vérification identité requise pour recevoir des paiements réels)

### Créer tes produits sur Stripe

Pour chaque plugin payant :
1. Dans Stripe → **Catalogue de produits** → **+ Ajouter un produit**
2. Nom = nom de ton plugin (ex: "FPS Boost X")
3. Prix = le montant (ex: 9,99 €) → **Paiement unique**
4. Clique sur le produit créé → copie le **Price ID** (commence par `price_`)

### Mettre tes Price IDs dans plugins.js

Ouvre `public/plugins.js` et remplace chaque :
```
stripe_price_id: 'price_REMPLACE_MOI_1',
```
par le vrai Price ID de ce plugin :
```
stripe_price_id: 'price_1ABC123xyz...',
```

---

## ÉTAPE 2 — Créer ton compte Vercel (2 min)

1. Va sur **https://vercel.com** → "Sign Up" avec ton GitHub
2. Si tu n'as pas GitHub : **https://github.com** → créer un compte gratuit

---

## ÉTAPE 3 — Mettre le code sur GitHub (3 min)

1. Sur GitHub → **New repository** → Nom: `modhub` → Public → **Create**
2. Sur ton PC, installe **Git** si pas encore fait : https://git-scm.com
3. Dans le terminal, dans le dossier `modhub/` :

```bash
git init
git add .
git commit -m "ModHub boutique"
git branch -M main
git remote add origin https://github.com/TON_USERNAME/modhub.git
git push -u origin main
```

---

## ÉTAPE 4 — Déployer sur Vercel (2 min)

1. Sur Vercel → **Add New Project**
2. Importe ton repo GitHub `modhub`
3. Clique **Deploy** — Vercel détecte tout automatiquement

Ta boutique sera en ligne sur : `https://modhub.vercel.app` (ou similaire)

---

## ÉTAPE 5 — Configurer les variables d'environnement (5 min)

Sur Vercel → ton projet → **Settings → Environment Variables**

Ajoute ces 3 variables :

| Nom | Valeur | Où trouver |
|-----|--------|-----------|
| `STRIPE_SECRET_KEY` | `sk_live_...` | Stripe → Développeurs → Clés API → **Clé secrète** |
| `STRIPE_WEBHOOK_SECRET` | `whsec_...` | Voir étape 6 |
| `SITE_URL` | `https://ton-site.vercel.app` | L'URL de ton site Vercel |

> ⚠️ Utilise `sk_test_...` pour tester, `sk_live_...` pour la prod

Puis dans `public/store.js` ligne 6, remplace :
```js
const STRIPE_PUBLIC_KEY = 'pk_test_REMPLACE_MOI';
```
par ta vraie clé publique Stripe (`pk_live_...` ou `pk_test_...`)

---

## ÉTAPE 6 — Configurer le Webhook Stripe (5 min)

Le webhook envoie les licences par email après chaque achat.

1. Stripe → **Développeurs → Webhooks → + Ajouter un endpoint**
2. URL : `https://ton-site.vercel.app/api/webhook`
3. Événements à écouter : `checkout.session.completed`
4. Copie le **Webhook signing secret** (`whsec_...`)
5. Colle-le dans Vercel → Variables → `STRIPE_WEBHOOK_SECRET`

---

## ÉTAPE 7 — Configurer les emails (optionnel mais recommandé)

Pour envoyer les clés de licence par email automatiquement :

1. Crée un compte gratuit sur **https://resend.com**
2. Vérifie ton domaine (ou utilise leur domaine de test)
3. Crée une clé API → copie-la
4. Dans Vercel → Variables : `RESEND_API_KEY` = ta clé Resend
5. Dans `api/webhook.js` ligne 17 : remplace `TONDOMAINE.com` par ton email

---

## ÉTAPE 8 — Tester avant de lancer

### Test Stripe (sans vrai argent)
- Utilise la clé de TEST : `pk_test_...` et `sk_test_...`
- Numéro de carte test : **4242 4242 4242 4242** — Date: 12/34 — CVC: 123

### Test webhook en local
```bash
npm install -g stripe
stripe listen --forward-to localhost:3000/api/webhook
```

---

## Personnaliser ta boutique

### Changer le nom "ModHub"
Cherche `ModHub` dans `index.html` et remplace par ton nom.

### Ajouter tes vrais plugins
Modifie `public/plugins.js` — copie un plugin existant et modifie :
- `name`, `desc`, `long`, `price`, `tags`, `feats`
- `stripe_price_id` avec le Price ID de ce plugin

### Changer les couleurs
Dans `index.html`, modifie les variables CSS :
```css
--n: #00f5ff;   /* couleur principale (cyan) */
--n2: #ff00aa;  /* accent (rose) */
--n3: #aaff00;  /* succès (vert) */
```

---

## Questions fréquentes

**Q: Je peux tester sans argent réel ?**
Oui ! Stripe a un mode test. Utilise les clés `pk_test_` et `sk_test_`.

**Q: Vercel est vraiment gratuit ?**
Oui pour les projets personnels — suffisant pour une boutique avec trafic normal.

**Q: Comment récupérer mon argent ?**
Stripe → Solde → Virements vers ton compte bancaire (automatique tous les 7 jours).

**Q: Et si j'ai un problème ?**
Ouvre une issue sur ton repo GitHub ou contacte Stripe Support.

---

## Résumé des liens utiles

- Stripe Dashboard : https://dashboard.stripe.com
- Vercel Dashboard : https://vercel.com/dashboard
- Resend (emails) : https://resend.com
- Stripe docs : https://stripe.com/docs
