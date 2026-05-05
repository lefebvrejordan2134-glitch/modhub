// ============================================================
//  MODHUB — LOGIQUE BOUTIQUE
//  Ne modifie pas ce fichier sauf si tu sais ce que tu fais
// ============================================================

// ⚠️ Remplace par ta clé publique Stripe (pk_live_... ou pk_test_...)
const STRIPE_PUBLIC_KEY = 'pk_test_REMPLACE_MOI';

let stripe;
try { stripe = Stripe(STRIPE_PUBLIC_KEY); } catch(e) { console.warn('Stripe non initialisé'); }

let cart = [];
let currentPlugin = null;
let myLicenses = JSON.parse(localStorage.getItem('modhub_licenses') || '[]');

// ─── NAVIGATION ────────────────────────────────────────────
function nav(page) {
  document.querySelectorAll('.page').forEach(p => p.classList.remove('on'));
  document.getElementById('p-' + page).classList.add('on');
  document.querySelectorAll('.ntab').forEach(b => b.classList.remove('on'));
  if (page === 'catalogue') {
    document.getElementById('tab-boutique').classList.add('on');
    renderGrid(PLUGINS);
  }
  if (page === 'licences') {
    document.getElementById('tab-licences').classList.add('on');
    renderLicenses();
  }
  if (page === 'panier') renderCart();
  window.scrollTo(0, 0);
}

// ─── GRID CATALOGUE ────────────────────────────────────────
function flt(cat, btn) {
  document.querySelectorAll('.fb').forEach(b => b.classList.remove('on'));
  btn.classList.add('on');
  const list = cat === 'all' ? PLUGINS
    : cat === 'gratuit' ? PLUGINS.filter(p => p.price === 0)
    : PLUGINS.filter(p => p.cat === cat);
  renderGrid(list);
}

function badgeLabel(b) {
  return { new: 'NOUVEAU', hot: 'POPULAIRE', free: 'GRATUIT', pro: 'PRO' }[b] || b.toUpperCase();
}

function renderGrid(list) {
  document.getElementById('grid').innerHTML = list.map(p => {
    const inCart = cart.find(c => c.id === p.id);
    return `<div class="pc">
      <div class="badge ${p.bc}">${badgeLabel(p.badge)}</div>
      <div class="pico ${p.ic}">${p.icon}</div>
      <div class="pname">${p.name}</div>
      <div class="pdesc">${p.desc}</div>
      <div class="ptags">${p.tags.map(t => `<span class="ptag">${t}</span>`).join('')}</div>
      <div class="pstars">${'★'.repeat(p.stars)}${'☆'.repeat(5 - p.stars)} <span class="prc">(${p.reviews})</span></div>
      <div class="divl"></div>
      <div class="pfoot">
        <div>
          ${p.old ? `<span class="price-old">${p.old.toFixed(2)} €</span>` : ''}
          <span class="price ${p.price === 0 ? 'price-free' : ''}">${p.price === 0 ? 'GRATUIT' : p.price.toFixed(2) + ' €'}</span>
        </div>
        <div style="display:flex;gap:6px;">
          <button class="db" onclick="openDetail(${p.id})">DÉTAIL</button>
          ${p.price > 0
            ? `<button class="ab ${inCart ? 'done' : ''}" onclick="addToCart(${p.id}, event)">${inCart ? '✓ AJOUTÉ' : 'AJOUTER'}</button>`
            : `<button class="ab" style="border-color:var(--n3);color:var(--n3);" onclick="showToast('Plugin gratuit — télécharge-le !')">GRATUIT</button>`
          }
        </div>
      </div>
    </div>`;
  }).join('');
}

// ─── PANIER ────────────────────────────────────────────────
function addToCart(id, e) {
  if (e) e.stopPropagation();
  const p = PLUGINS.find(x => x.id === id);
  if (!p || cart.find(c => c.id === id)) return;
  cart.push(p);
  updateCartCount();
  renderGrid(PLUGINS);
  showToast(p.name + ' ajouté au panier !');
}

function addCurrentToCart() {
  if (currentPlugin) {
    addToCart(currentPlugin.id, null);
    showToast(currentPlugin.name + ' ajouté au panier !');
  }
}

function removeFromCart(id) {
  cart = cart.filter(c => c.id !== id);
  updateCartCount();
  renderCart();
}

function updateCartCount() {
  document.getElementById('cc').textContent = cart.length;
}

function renderCart() {
  const empty = cart.length === 0;
  document.getElementById('cart-empty').style.display = empty ? 'block' : 'none';
  document.getElementById('cart-sum').style.display = empty ? 'none' : 'block';
  document.getElementById('cart-list').innerHTML = cart.map(p => `
    <div class="cart-row">
      <div class="cr-ico ${p.ic}">${p.icon}</div>
      <div class="cr-info">
        <div class="cr-name">${p.name}</div>
        <div class="cr-type">${p.cat} — Licence perpétuelle</div>
      </div>
      <div class="cr-price">${p.price.toFixed(2)} €</div>
      <button class="cr-rm" onclick="removeFromCart(${p.id})">×</button>
    </div>`).join('');
  const sub = cart.reduce((s, p) => s + p.price, 0);
  const tva = sub * 0.2;
  document.getElementById('sum-sub').textContent = sub.toFixed(2) + ' €';
  document.getElementById('sum-tva').textContent = tva.toFixed(2) + ' €';
  document.getElementById('sum-total').textContent = (sub + tva).toFixed(2) + ' €';
}

// ─── STRIPE CHECKOUT ───────────────────────────────────────
async function buyNow() {
  if (!currentPlugin) return;
  const btn = document.getElementById('dp-buy-now');
  btn.disabled = true;
  btn.innerHTML = '<span class="spinner"></span>REDIRECTION...';
  try {
    const res = await fetch('/api/create-checkout', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ items: [{ price_id: currentPlugin.stripe_price_id, qty: 1 }] })
    });
    const data = await res.json();
    if (data.url) window.location.href = data.url;
    else throw new Error(data.error || 'Erreur serveur');
  } catch (err) {
    showToast('Erreur paiement : ' + err.message, true);
    btn.disabled = false;
    btn.innerHTML = 'ACHETER MAINTENANT';
  }
}

async function checkoutCart() {
  if (cart.length === 0) return;
  const btn = document.getElementById('checkout-btn');
  btn.disabled = true;
  btn.innerHTML = '<span class="spinner"></span>REDIRECTION...';
  try {
    const items = cart.map(p => ({ price_id: p.stripe_price_id, qty: 1 }));
    const res = await fetch('/api/create-checkout', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ items })
    });
    const data = await res.json();
    if (data.url) window.location.href = data.url;
    else throw new Error(data.error || 'Erreur serveur');
  } catch (err) {
    showToast('Erreur paiement : ' + err.message, true);
    btn.disabled = false;
    btn.innerHTML = 'PAYER VIA STRIPE';
  }
}

// ─── PAGE DETAIL ───────────────────────────────────────────
function openDetail(id) {
  const p = PLUGINS.find(x => x.id === id);
  currentPlugin = p;
  const el = id => document.getElementById(id);
  el('dp-badge').className = `badge ${p.bc}`;
  el('dp-badge').textContent = badgeLabel(p.badge);
  el('dp-name').textContent = p.name;
  el('dp-tagline').textContent = p.long;
  el('dp-stars').innerHTML = '★'.repeat(p.stars) + '☆'.repeat(5 - p.stars) + ` <span style="font-size:11px;color:var(--txt3);">(${p.reviews} avis)</span>`;
  el('dp-meta').innerHTML = `<span class="dp-m">v${p.versions[0].v}</span><span class="dp-m">${p.cat}</span>${p.tags.map(t => `<span class="dp-m">${t}</span>`).join('')}`;
  el('dp-feats').innerHTML = p.feats.map(f => `<li>${f}</li>`).join('');
  el('dp-longdesc').textContent = p.long;
  el('dp-pold').textContent = p.old ? p.old.toFixed(2) + ' €' : '';
  el('dp-price').textContent = p.price === 0 ? 'GRATUIT' : p.price.toFixed(2) + ' €';
  el('dp-buy-now').style.display = p.price === 0 ? 'none' : 'block';
  el('dp-buy-now').disabled = false;
  el('dp-buy-now').innerHTML = 'ACHETER MAINTENANT';
  el('dp-screens').innerHTML = [1, 2, 3].map(i => `<div class="ss">SCREENSHOT ${i}<br><small>Ajoute ton image ici</small></div>`).join('');
  el('dp-changelog').innerHTML = p.versions.map(v => `<div class="cl-item"><div class="cl-v">v${v.v}</div><div class="cl-d">${v.d}</div><div class="cl-notes">${v.n}</div></div>`).join('');
  document.querySelectorAll('.dp-tab').forEach(t => t.classList.remove('on'));
  document.querySelectorAll('.dp-section').forEach(s => s.classList.remove('on'));
  document.querySelectorAll('.dp-tab')[0].classList.add('on');
  el('ds-desc').classList.add('on');
  document.querySelectorAll('.page').forEach(p => p.classList.remove('on'));
  document.querySelectorAll('.ntab').forEach(b => b.classList.remove('on'));
  document.getElementById('p-detail').classList.add('on');
  window.scrollTo(0, 0);
}

function dptab(sec, btn) {
  document.querySelectorAll('.dp-tab').forEach(t => t.classList.remove('on'));
  document.querySelectorAll('.dp-section').forEach(s => s.classList.remove('on'));
  btn.classList.add('on');
  document.getElementById('ds-' + sec).classList.add('on');
}

// ─── LICENCES ──────────────────────────────────────────────
function formatKey(el) {
  let v = el.value.replace(/[^A-Z0-9]/gi, '').toUpperCase();
  let parts = [];
  for (let i = 0; i < v.length && parts.length < 4; i += 4) parts.push(v.substr(i, 4));
  el.value = parts.join('-');
}

async function activateLicense() {
  const key = document.getElementById('lic-key-input').value.trim().toUpperCase();
  const res = document.getElementById('lic-result');
  res.style.display = 'block';
  if (key.length < 19) {
    res.className = 'lic-result lic-err';
    res.textContent = 'Format invalide — attendu : XXXX-XXXX-XXXX-XXXX';
    return;
  }
  if (myLicenses.find(l => l.key === key)) {
    res.className = 'lic-result lic-err';
    res.textContent = 'Cette licence est déjà activée sur cet appareil.';
    return;
  }
  // Vérification via API
  try {
    const r = await fetch('/api/verify-license', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ key })
    });
    const data = await r.json();
    if (data.valid) {
      myLicenses.push({ key, name: data.plugin_name, activated: new Date().toLocaleDateString('fr-FR'), status: 'active' });
      localStorage.setItem('modhub_licenses', JSON.stringify(myLicenses));
      renderLicenses();
      res.className = 'lic-result lic-ok';
      res.textContent = '✓ Licence activée ! ' + data.plugin_name + ' est prêt à utiliser.';
      document.getElementById('lic-key-input').value = '';
    } else {
      res.className = 'lic-result lic-err';
      res.textContent = 'Clé non reconnue. Vérifie l\'email reçu après ton achat.';
    }
  } catch {
    res.className = 'lic-result lic-err';
    res.textContent = 'Erreur de connexion. Réessaie dans un instant.';
  }
}

function renderLicenses() {
  const el = document.getElementById('my-licenses');
  if (myLicenses.length === 0) {
    el.innerHTML = `<div style="font-size:13px;color:var(--txt3);text-align:center;padding:40px;">Aucune licence activée.<br>Achète un plugin et entre ta clé ici.</div>`;
    return;
  }
  el.innerHTML = myLicenses.map(l => `
    <div class="lic-card">
      <div class="lic-card-h">
        <div class="lic-pname">${l.name}</div>
        <span class="lic-status ls-active">ACTIVE</span>
      </div>
      <div class="lic-key" onclick="copyKey('${l.key}')" title="Cliquer pour copier">${l.key}</div>
      <div class="lic-meta">
        <span>Activée le ${l.activated}</span>
        <span>Expire : Illimitée</span>
      </div>
    </div>`).join('');
}

function copyKey(key) {
  navigator.clipboard.writeText(key).then(() => showToast('Clé copiée !'));
}

// ─── UTILITAIRES ───────────────────────────────────────────
function showToast(msg, isError = false) {
  const t = document.getElementById('toast');
  t.textContent = msg;
  t.style.borderColor = isError ? '#ff4466' : 'var(--n)';
  t.style.color = isError ? '#ff4466' : 'var(--n)';
  t.style.display = 'block';
  setTimeout(() => t.style.display = 'none', 3000);
}

// ─── INIT ──────────────────────────────────────────────────
// Vérifier si retour de paiement Stripe (succès)
const urlParams = new URLSearchParams(window.location.search);
if (urlParams.get('success') === '1') {
  const sessionId = urlParams.get('session_id');
  // Nettoyer le panier après paiement réussi
  cart = [];
  updateCartCount();
  // Afficher message succès
  setTimeout(() => {
    showToast('Paiement réussi ! Vérifie ton email pour ta clé de licence.');
    nav('licences');
  }, 500);
  window.history.replaceState({}, '', '/');
}
if (urlParams.get('cancelled') === '1') {
  setTimeout(() => showToast('Paiement annulé.', true), 500);
  window.history.replaceState({}, '', '/');
}

renderGrid(PLUGINS);
renderLicenses();
