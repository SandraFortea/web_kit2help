// ── Mobile menu ──
function toggleMenu() {
    document.getElementById('mobileMenu').classList.toggle('open');
}
document.addEventListener('click', e => {
    if (!e.target.closest('nav') && !e.target.closest('.mobile-menu'))
        document.getElementById('mobileMenu').classList.remove('open');
});

// ── Quiénes somos modal ──
function abrirQuienesSomos() {
    document.getElementById('qsModal').classList.add('open');
    document.body.style.overflow = 'hidden';
}
function cerrarQuienesSomos() {
    document.getElementById('qsModal').classList.remove('open');
    document.body.style.overflow = '';
}
document.addEventListener('click', function (e) {
    const modal = document.getElementById('qsModal');
    if (modal && e.target === modal) cerrarQuienesSomos();
});


// -- correo form contacto --

function openModal() {
    document.getElementById('leadModal').style.display = 'flex';
}

function closeModal() {
    document.getElementById('leadModal').style.display = 'none';
}


async function submitLead() {
    // 1. Verificar Honeypot inmediatamente
    const honey = document.getElementById('k2-honeypot').value;
    if (honey !== "") {
        console.warn("Spam detectado");
        return; // Detiene la ejecución si un bot llenó el campo oculto
    }

    // 2. Capturar valores
    const name = document.getElementById('k2-name').value.trim();
    const email = document.getElementById('k2-email').value.trim();
    const city = document.getElementById('k2-city').value.trim();
    const phone = document.getElementById('k2-phone').value.trim();
    const type = document.getElementById('k2-type').value;

    // 3. Validaciones de formato
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!name) {
        alert("Por favor, dinos tu nombre.");
        return;
    }
    if (!emailRegex.test(email)) {
        alert("Por favor, introduce un correo electrónico válido.");
        return;
    }

    // 4. Envío de datos
    const URL_APPS_SCRIPT = "https://script.google.com/macros/s/AKfycbwCNRCqioHrJOVEdKGayVEWTYB889V4aupiBpidTMHtaaJzphhcTQGtAEyXl95hDvYa/exec"; // Pega aquí la URL de la implementación
    const btn = document.querySelector('.k2-submit');

    try {
        // Cambiamos el texto para dar feedback de carga
        btn.textContent = "Enviando...";
        btn.disabled = true;

        await fetch(URL_APPS_SCRIPT, {
            method: "POST",
            mode: "no-cors",
            body: JSON.stringify({
                name, city, email, phone: phone || "No proporcionado", type
            })
        });

        // Éxito
        btn.textContent = "✓ Enviado";
        btn.style.background = "#085041";

        setTimeout(() => {
            closeModal();
            btn.textContent = "Enviar solicitud";
            btn.style.background = "";
            btn.disabled = false;
            // Limpiar campos
            document.getElementById('k2-name').value = "";
            document.getElementById('k2-email').value = "";
            document.getElementById('k2-city').value = "";
            document.getElementById('k2-phone').value = "";
        }, 2000);

    } catch (error) {
        alert("Hubo un problema. Revisa tu conexión.");
        btn.disabled = false;
        btn.textContent = "Enviar solicitud";
    }
}






// ── Scroll reveal ──
const reveals = document.querySelectorAll('.reveal');
const observer = new IntersectionObserver(entries => {
    entries.forEach(e => { if (e.isIntersecting) e.target.classList.add('visible'); });
}, { threshold: 0.12 });
reveals.forEach(el => observer.observe(el));

// ── Counter animation ──
function animateCounter(el, target) {
    let cur = 0; const step = Math.ceil(target / 40);
    const t = setInterval(() => {
        cur = Math.min(cur + step, target); el.textContent = cur;
        if (cur >= target) clearInterval(t);
    }, 40);
}
const statsObs = new IntersectionObserver(entries => {
    entries.forEach(e => {
        if (e.isIntersecting) {
            document.querySelectorAll('[data-target]').forEach(el => animateCounter(el, parseInt(el.dataset.target)));
            statsObs.disconnect();
        }
    });
}, { threshold: 0.5 });
const heroEl = document.querySelector('.hero-stats');
if (heroEl) statsObs.observe(heroEl);

// ── Demo tabs ──
function switchTab(name) {
    const panels = ['emergencia', 'chat', 'kit'];
    document.querySelectorAll('.demo-tab').forEach((t, i) => t.classList.toggle('active', panels[i] === name));
    document.querySelectorAll('.demo-panel').forEach(p => p.classList.remove('active'));
    document.getElementById('tab-' + name).classList.add('active');
}

// ── Activate emergency → add NEW hot point on map each time ──
const _emergPositions = [
    { cx: 60, cy: 270, r: 32 }, { cx: 360, cy: 100, r: 28 }, { cx: 200, cy: 310, r: 30 },
    { cx: 310, cy: 200, r: 26 }, { cx: 80, cy: 120, r: 28 }, { cx: 260, cy: 330, r: 24 },
    { cx: 150, cy: 360, r: 26 }, { cx: 380, cy: 280, r: 30 },
];
let _emergCount = 0;

function activarEmergencia() {
    const btn = document.getElementById('emergBtn');
    const svg = document.getElementById('emergSvg');

    btn.textContent = '✓ Emergencia activada';
    btn.style.background = '#085041';
    btn.disabled = true;

    // First activation: reveal the pre-built hidden point
    if (_emergCount === 0) {
        const np = document.getElementById('svgNewPoint');
        if (np) np.style.opacity = '1';
    }

    // Every activation: inject a fresh SVG group at a new position
    const pos = _emergPositions[_emergCount % _emergPositions.length];
    _emergCount++;
    const jitter = () => Math.round((Math.random() - 0.5) * 24);
    const cx = pos.cx + (_emergCount > 1 ? jitter() : 0);
    const cy = pos.cy + (_emergCount > 1 ? jitter() : 0);
    const dur = (1.4 + Math.random() * 0.8).toFixed(1);

    const g = document.createElementNS('http://www.w3.org/2000/svg', 'g');
    g.style.cssText = 'opacity:0;transition:opacity 0.5s;';
    g.innerHTML =
        '<circle cx="' + cx + '" cy="' + cy + '" r="' + pos.r + '" fill="rgba(226,75,74,0.16)"/>' +
        '<circle cx="' + cx + '" cy="' + cy + '" r="' + Math.round(pos.r * 0.5) + '" fill="rgba(226,75,74,0.26)"/>' +
        '<circle cx="' + cx + '" cy="' + cy + '" r="7" fill="#E24B4A"/>' +
        '<text x="' + cx + '" y="' + (cy + 4) + '" text-anchor="middle" fill="white" font-size="7" font-weight="bold">!</text>' +
        '<circle cx="' + cx + '" cy="' + cy + '" r="18" fill="none" stroke="#E24B4A" stroke-width="1.5">' +
        '<animate attributeName="r" values="18;34;18" dur="' + dur + 's" repeatCount="indefinite"/>' +
        '<animate attributeName="opacity" values="0.7;0;0.7" dur="' + dur + 's" repeatCount="indefinite"/>' +
        '</circle>';
    svg.appendChild(g);
    requestAnimationFrame(() => { g.style.opacity = '1'; });

    svg.style.transform = 'scale(1.06)';
    setTimeout(() => { svg.style.transform = 'scale(1)'; }, 700);

    setTimeout(() => {
        btn.textContent = 'Activar emergencia';
        btn.style.background = '';
        btn.disabled = false;
    }, 2500);
}

// ── Chat ──
function enviarMensaje() {
    const input = document.getElementById('chatInput');
    const text = input.value.trim(); if (!text) return;
    const msgs = document.getElementById('chatMsgs');
    const div = document.createElement('div');
    div.className = 'msg own';
    div.innerHTML = `<div class="avatar" style="background:var(--teal);color:#fff">Yo</div><div class="bubble"><p>${text}</p><small>ahora</small></div>`;
    msgs.appendChild(div); msgs.scrollTop = msgs.scrollHeight; input.value = '';
}
// Guard: attach only after DOM is ready to avoid aborting the script block
document.addEventListener('DOMContentLoaded', function () {
    var chatInputEl = document.getElementById('chatInput');
    if (chatInputEl) chatInputEl.addEventListener('keydown', function (e) { if (e.key === 'Enter') enviarMensaje(); });
});


// ── Kit data ──
var KIT_TYPES = {
    food: {
        label: '🍱 Kit Alimenticio', sub: 'Edita cantidades o añade elementos',
        color: '#C0392B', strip: '#C0392B', itemBg: '#FDF0EF', borderColor: '#C0392B',
        items: [
            { icon: '💧', name: 'Agua (1.5L)', qty: 6 },
            { icon: '🥫', name: 'Conservas', qty: 4 },
            { icon: '🍶', name: 'Leche (1L)', qty: 8 },
            { icon: '🧂', name: 'Sal y aceite', qty: 2 }
        ]
    },
    med: {
        label: '💊 Kit Sanitario', sub: 'Edita cantidades o añade elementos',
        color: '#E67E22', strip: '#E67E22', itemBg: '#FEF5EC', borderColor: '#E67E22',
        items: [
            { icon: '💊', name: 'Analgésicos', qty: 10 },
            { icon: '🩹', name: 'Apósitos y vendas', qty: 8 },
            { icon: '🧴', name: 'Desinfectante', qty: 3 },
            { icon: '🌡️', name: 'Termómetro', qty: 1 },
            { icon: '🩺', name: 'Botiquín básico', qty: 1 }
        ]
    },
    clothes: {
        label: '🧥 Kit Ropa', sub: 'Edita cantidades o añade elementos',
        color: '#27AE60', strip: '#27AE60', itemBg: '#EAFAF1', borderColor: '#27AE60',
        items: [
            { icon: '🧥', name: 'Abrigo impermeable', qty: 2 },
            { icon: '🧣', name: 'Mantas térmicas', qty: 4 },
            { icon: '🧤', name: 'Guantes', qty: 3 },
            { icon: '👟', name: 'Calzado de repuesto', qty: 2 }
        ]
    },
    tools: {
        label: '🔧 Kit Herramientas', sub: 'Edita cantidades o añade elementos',
        color: '#2C3E50', strip: '#2C3E50', itemBg: '#F0F2F4', borderColor: '#2C3E50',
        items: [
            { icon: '🔦', name: 'Linterna + pilas', qty: 2 },
            { icon: '📻', name: 'Radio de emergencia', qty: 1 },
            { icon: '🔧', name: 'Multiherramienta', qty: 1 },
            { icon: '🪢', name: 'Cuerda resistente', qty: 1 },
        ]
    },
    custom: {
        label: '✏️ Kit personalizado', sub: 'Añade los elementos que necesites',
        color: '#7B5EA7', strip: '#7B5EA7', itemBg: '#F5F0FB', borderColor: '#7B5EA7',
        items: []
    }
};

var currentKitType = 'food';
// Live editable items (copy from KIT_TYPES so user edits don't persist on type switch)
var currentItems = [];

var EMOJI_CYCLE = ['📦', '💧', '🥫', '🍫', '💊', '🩹', '🧴', '🔦', '🧥', '🧣', '👟', '🔧', '🪢', '📻', '🗺️', '🧤', '🌡️', '🍱', '🛠️', '🆘'];
var emojiIdx = 0;

function cycleEmoji(el) {
    emojiIdx = (emojiIdx + 1) % EMOJI_CYCLE.length;
    el.textContent = EMOJI_CYCLE[emojiIdx];
}

function renderKitItems2(type) {
    var data = KIT_TYPES[type];
    if (!data) return;
    // Deep copy items so edits are local
    currentItems = data.items.map(function (i) { return { icon: i.icon, name: i.name, qty: i.qty }; });
    buildItemsDOM();
    updateKitTotal();
}


function buildItemsDOM() {
    var data = KIT_TYPES[currentKitType];
    var list = document.getElementById('kitItemsList');
    if (!list) return;
    list.innerHTML = currentItems.map(function (item, idx) {
        return '<div class="kit-item" style="border-left-color:' + data.borderColor + ';background:' + data.itemBg + ';" data-idx="' + idx + '">' +
            '<div class="kit-item-info">' +
            '<div class="kit-item-dot" style="background:' + data.color + ';"></div>' +
            '<span class="kit-item-icon">' + item.icon + '</span>' +
            '<span class="kit-item-name">' + item.name + '</span>' +
            '</div>' +
            '<div style="display:flex;align-items:center;gap:6px;">' +
            '<div class="qty-ctrl">' +
            '<button class="qty-btn" onclick="changeQtyIdx(this,' + idx + ',-1)">−</button>' +
            '<span class="qty-num">' + item.qty + '</span>' +
            '<button class="qty-btn" onclick="changeQtyIdx(this,' + idx + ',1)">+</button>' +
            '</div>' +
            '<button onclick="removeKitItem(' + idx + ')" style="width:22px;height:22px;border:none;background:none;color:rgba(0,0,0,0.25);cursor:pointer;font-size:14px;padding:0;line-height:1;border-radius:4px;" title="Eliminar">✕</button>' +
            '</div>' +
            '</div>';
    }).join('');
}

function addKitItem() {
    var nameEl = document.getElementById('kitAddName');
    var emojiEl = document.getElementById('kitAddEmoji');
    var name = nameEl ? nameEl.value.trim() : '';
    if (!name) { if (nameEl) nameEl.focus(); return; }
    var icon = emojiEl ? emojiEl.textContent : '📦';
    currentItems.push({ icon: icon, name: name, qty: 1 });
    if (nameEl) nameEl.value = '';
    buildItemsDOM();
    updateKitTotal();
}

function removeKitItem(idx) {
    currentItems.splice(idx, 1);
    buildItemsDOM();
    updateKitTotal();
}

function changeQtyIdx(btn, idx, delta) {
    currentItems[idx].qty = Math.max(0, currentItems[idx].qty + delta);
    var span = btn.closest('.qty-ctrl').querySelector('.qty-num');
    if (span) span.textContent = currentItems[idx].qty;
    updateKitTotal();
}


// Legacy changeQty2 kept for compatibility — use changeQtyIdx for new code

function selectKitType(card, type) {
    document.querySelectorAll('.kit-type-card').forEach(function (c) { c.classList.remove('selected'); });
    card.classList.add('selected');
    currentKitType = type;
    var data = KIT_TYPES[type];
    var titleEl = document.getElementById('kitBuilderTitle');
    var subEl = document.getElementById('kitBuilderSub');
    var strip = document.getElementById('kitColorStrip');
    var nameWrap = document.getElementById('kitCustomNameWrap');
    var nameInput = document.getElementById('kitCustomName');
    if (titleEl) titleEl.textContent = data.label;
    if (subEl) subEl.textContent = data.sub;
    if (strip) strip.style.background = data.strip;
    // Show custom name input only for 'custom'
    if (nameWrap) nameWrap.style.display = (type === 'custom') ? 'block' : 'none';
    if (nameInput && type === 'custom') nameInput.placeholder = 'Nombre del kit personalizado...';
    // Apply custom color if switching to custom
    if (type === 'custom' && typeof _customKitColor !== 'undefined') {
        KIT_TYPES.custom.color = _customKitColor;
        KIT_TYPES.custom.strip = _customKitColor;
        KIT_TYPES.custom.itemBg = _customKitColor + '18';
        KIT_TYPES.custom.borderColor = _customKitColor;
        if (strip) strip.style.background = _customKitColor;
    }
    renderKitItems2(type);
    var btn = document.getElementById('kitBtn');
    if (btn) { btn.textContent = 'Crear kit'; btn.style.background = ''; btn.disabled = false; }
}

function updateKitTotal() {
    var total = currentItems.reduce(function (s, i) { return s + i.qty; }, 0);
    var el = document.getElementById('kitTotal');
    if (el) el.textContent = total;
}

// ── Crear kit ──
// ── Registro de kits activos e instancias ──
var activeKits = {};   // tipos de kit creados por coordinador
var kitInstances = {};   // instancias preparadas por voluntarios
var kitCounters = {};   // contador de instancias por tipo

var PICKUP_POINTS = [
    'Punto Colón — Calle Colón, 23 · Abierto 8:00–20:00',
    'Polideportivo Russafa — Av. Pérez Galdós · Abierto 9:00–18:00',
    'IES Benlliure — C/ Benlliure, 1 · Abierto 8:00–20:00',
];

var TRAZA_PHASES = [
    { icon: '📦', label: 'Preparado' },
    { icon: '🚚', label: 'En camino' },
    { icon: '✅', label: 'Recibido' },
];

// ── Crear kit (coordinador) ──
function crearKit() {
    var btn = document.getElementById('kitBtn');
    var total = document.getElementById('kitTotal').textContent;
    var data = KIT_TYPES[currentKitType];
    if (!data) return;
    if (currentItems.length === 0) {
        var addInput = document.getElementById('kitAddName');
        if (addInput) addInput.focus();
        return;
    }

    var customNameEl = document.getElementById('kitCustomName');
    var displayLabel = (currentKitType === 'custom' && customNameEl && customNameEl.value.trim())
        ? ('✏️ ' + customNameEl.value.trim()) : data.label;

    btn.textContent = '✓ Kit creado';
    btn.style.background = data.color;
    btn.disabled = true;

    var listEl = document.getElementById('kitCreatedList');
    if (listEl) {
        var card = document.createElement('div');
        card.className = 'kit-created-card';

        var kitId = 'kit_' + Date.now();
        card.dataset.kitId = kitId;
        card.dataset.kitType = currentKitType;
        card.dataset.active = 'true';

        var elHtml = currentItems.slice(0, 6).map(function (it) {
            return '<div class="kit-created-el"><span>' + it.icon + '</span><span>' + it.name + ' ×' + it.qty + '</span></div>';
        }).join('');
        if (currentItems.length > 6)
            elHtml += '<div class="kit-created-el" style="color:var(--teal);">+' + (currentItems.length - 6) + ' más</div>';

        card.innerHTML =
            '<div class="kit-created-header">' +
            '<div class="kit-created-box" style="background:' + data.itemBg + ';color:' + data.color + ';">📦</div>' +
            '<div style="flex:1;min-width:0;">' +
            '<div class="kit-created-name" style="color:' + data.color + ';">' + displayLabel + '</div>' +
            '<div class="kit-meta-line" style="font-size:11px;color:var(--muted);">' + total + ' elementos · Listo para distribuir</div>' +
            '</div>' +
            '<div class="kit-status-badge" style="font-size:10px;font-weight:600;color:' + data.color + ';background:' + data.itemBg + ';padding:3px 8px;border-radius:8px;">✓ Activo</div>' +
            '</div>' +
            '<div class="kit-created-elements">' + elHtml + '</div>' +
            '<div class="kit-action-bar">' +
            '<button class="kit-action-btn edit"  onclick="editarKit(this)">✏️ Modificar</button>' +
            '<button class="kit-action-btn deact" onclick="toggleKitActivo(this)">⏸ Desactivar</button>' +
            '<button class="kit-action-btn del"   onclick="borrarKit(this)">🗑 Borrar</button>' +
            '</div>';

        listEl.insertBefore(card, listEl.firstChild);

        activeKits[kitId] = {
            id: kitId, label: displayLabel, type: currentKitType,
            color: data.color, itemBg: data.itemBg, borderColor: data.borderColor,
            items: JSON.parse(JSON.stringify(currentItems)), active: true
        };
        kitCounters[kitId] = 0;
        renderVolKitList();
    }

    setTimeout(function () {
        btn.textContent = 'Crear otro';
        btn.style.background = '';
        btn.disabled = false;
        btn.onclick = function () {
            renderKitItems2(currentKitType);
            btn.textContent = 'Crear kit';
            btn.onclick = crearKit;
        };
    }, 1200);
}

// ── Acciones coordinador ──
function editarKit(btn) {
    var card = btn.closest('.kit-created-card');
    var type = card.dataset.kitType;
    document.querySelectorAll('.kit-type-card').forEach(function (c) {
        c.classList.toggle('selected', c.dataset.type === type);
    });
    selectKitType(document.querySelector('.kit-type-card[data-type="' + type + '"]'), type);
    document.getElementById('kitBuilderPanel').scrollIntoView({ behavior: 'smooth', block: 'nearest' });
}

function toggleKitActivo(btn) {
    var card = btn.closest('.kit-created-card');
    var id = card.dataset.kitId;
    var isActive = card.dataset.active === 'true';
    var newActive = !isActive;
    card.dataset.active = newActive;

    var badge = card.querySelector('.kit-status-badge');
    var meta = card.querySelector('.kit-meta-line');
    if (newActive) {
        badge.textContent = '✓ Activo'; badge.style.opacity = '1';
        card.style.opacity = '1';
        btn.textContent = '⏸ Desactivar'; btn.classList.replace('react', 'deact');
        if (meta) meta.textContent = meta.textContent.replace('Inactivo', 'Listo para distribuir');
    } else {
        badge.textContent = '⏸ Inactivo'; badge.style.opacity = '0.5';
        card.style.opacity = '0.65';
        btn.textContent = '▶ Reactivar'; btn.classList.replace('deact', 'react');
        if (meta) meta.textContent = meta.textContent.replace('Listo para distribuir', 'Inactivo');
    }
    if (activeKits[id]) activeKits[id].active = newActive;

    // Marcar instancias activas de este kit como canceladas
    if (!newActive) {
        Object.keys(kitInstances).forEach(function (iid) {
            var inst = kitInstances[iid];
            if (inst.kitId === id && inst.phase < 2) {
                inst.cancelled = true;
                renderTrazaRow(iid);
            }
        });
    }
    renderVolKitList();
}

function borrarKit(btn) {
    var card = btn.closest('.kit-created-card');
    var id = card.dataset.kitId;
    if (!confirm('¿Eliminar este kit? Esta acción no se puede deshacer.')) return;
    // Cancelar instancias en curso
    Object.keys(kitInstances).forEach(function (iid) {
        if (kitInstances[iid].kitId === id) {
            kitInstances[iid].cancelled = true;
            renderTrazaRow(iid);
        }
    });
    delete activeKits[id];
    card.style.transition = 'opacity 0.25s, transform 0.25s';
    card.style.opacity = '0'; card.style.transform = 'scale(0.96)';
    setTimeout(function () { card.remove(); renderVolKitList(); }, 260);
}

// ── Modo switcher ──
function switchKitMode(mode) {
    var isCoord = mode === 'coord';
    document.getElementById('kitViewCoord').style.display = isCoord ? 'block' : 'none';
    document.getElementById('kitViewVol').style.display = isCoord ? 'none' : 'block';
    document.getElementById('kitModeCoord').style.background = isCoord ? 'var(--teal)' : 'transparent';
    document.getElementById('kitModeCoord').style.color = isCoord ? '#fff' : 'var(--muted)';
    document.getElementById('kitModeVol').style.background = isCoord ? 'transparent' : 'var(--teal)';
    document.getElementById('kitModeVol').style.color = isCoord ? 'var(--muted)' : '#fff';
    if (!isCoord) renderVolKitList();
}

// ── Vista voluntario ──
function renderVolKitList() {
    var list = document.getElementById('volKitList');
    if (!list) return;
    var keys = Object.keys(activeKits);
    if (keys.length === 0) {
        list.innerHTML = '<div style="font-size:13px;color:var(--muted);padding:12px 0;">Todavía no hay kits creados. Ve a la vista Coordinador y crea uno.</div>';
        return;
    }
    list.innerHTML = keys.map(function (id) {
        var k = activeKits[id];
        return '<div class="vol-kit-row' + (k.active ? '' : ' inactive') + '"' +
            (k.active ? ' onclick="selectVolKit(\'' + id + '\')"' : '') + '>' +
            '<div class="vol-kit-dot" style="background:' + k.color + ';"></div>' +
            '<span class="vol-kit-label">' + k.label + '</span>' +
            '<span class="vol-kit-badge' + (k.active ? '' : ' off') + '">' + (k.active ? 'Disponible' : 'Inactivo') + '</span>' +
            '</div>';
    }).join('');
}

function selectVolKit(id) {
    var kit = activeKits[id];
    if (!kit || !kit.active) return;
    document.getElementById('volStep1').style.display = 'none';
    document.getElementById('volStep2').style.display = 'flex';
    document.getElementById('volQrBox').style.display = 'none';
    document.getElementById('volNombre').value = '';
    document.getElementById('volQrBtn').dataset.kitId = id;

    // Instrucciones
    var instrEl = document.getElementById('volInstructions');
    instrEl.innerHTML =
        '<div class="vol-instr-title">📋 Instrucciones de montaje — ' + kit.label + '</div>' +
        '<div class="vol-instr-step"><div class="vol-instr-num">1</div><span>Consigue una caja de cartón resistente o una bolsa grande.</span></div>' +
        '<div class="vol-instr-step"><div class="vol-instr-num">2</div><span>Introduce los elementos: ' +
        kit.items.map(function (it) { return '<strong>' + it.icon + ' ' + it.name + '</strong> ×' + it.qty; }).join(', ') +
        '</span></div>' +
        '<div class="vol-instr-step"><div class="vol-instr-num">3</div><span>Identifica la caja con el color asignado: ' +
        '<span class="vol-color-swatch" style="background:' + kit.color + ';border:1px solid rgba(0,0,0,0.1);"></span>' +
        '<strong>' + kit.label + '</strong>. Usa cinta de embalar o cartulina de ese color.</span></div>' +
        '<div class="vol-instr-step"><div class="vol-instr-num">4</div><span>Introduce tu nombre y pulsa <strong>Confirmar y generar QR</strong>. Pégalo en la caja.</span></div>' +
        '<div class="vol-instr-step"><div class="vol-instr-num">5</div><span>Lleva la caja al punto de recogida indicado abajo.</span></div>';

    document.getElementById('volPickupPoint').textContent =
        PICKUP_POINTS[Math.floor(Math.random() * PICKUP_POINTS.length)];
}

function generarQR() {
    var kitId = document.getElementById('volQrBtn').dataset.kitId;
    var kit = activeKits[kitId];
    var nombre = (document.getElementById('volNombre').value.trim()) || 'Voluntario';
    if (!kit) return;

    // Generar instancia única
    kitCounters[kitId] = (kitCounters[kitId] || 0) + 1;
    var prefix = kit.type.toUpperCase().substring(0, 4);
    var instId = prefix + '-' + String(kitCounters[kitId]).padStart(3, '0');

    var inst = {
        id: instId, kitId: kitId, label: kit.label,
        color: kit.color, voluntario: nombre,
        phase: 0, cancelled: false,
        pickup: document.getElementById('volPickupPoint').textContent,
        ts: new Date().toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' })
    };
    kitInstances[instId] = inst;

    // Mostrar QR
    var payload = encodeURIComponent('KIT2HELP|ID:' + instId + '|TIPO:' + kit.label + '|VOL:' + nombre);
    var qrUrl = 'https://api.qrserver.com/v1/create-qr-code/?size=160x160&data=' + payload;
    document.getElementById('volQrImg').innerHTML =
        '<img src="' + qrUrl + '" width="160" height="160" alt="QR" style="border-radius:8px;">';
    document.getElementById('volQrCode').textContent = instId;
    document.getElementById('volQrBox').style.display = 'block';

    var btn = document.getElementById('volQrBtn');
    btn.textContent = '✓ QR generado — ' + instId;
    btn.style.background = '#085041';
    setTimeout(function () {
        btn.textContent = '📲 Confirmar y generar QR';
        btn.style.background = 'var(--teal)';
    }, 3000);

    // Registrar en trazabilidad
    addTrazaRow(inst);
}

function volGoStep1() {
    document.getElementById('volStep1').style.display = 'block';
    document.getElementById('volStep2').style.display = 'none';
    document.getElementById('volQrBox').style.display = 'none';
}

// ── Trazabilidad ──
function addTrazaRow(inst) {
    var empty = document.getElementById('trazaEmpty');
    if (empty) empty.style.display = 'none';

    var row = document.createElement('div');
    row.className = 'traza-row';
    row.id = 'traza_' + inst.id;
    row.style.display = 'flex';   // garantiza display consistente para el filtro
    document.getElementById('trazaList').appendChild(row);

    renderTrazaRow(inst.id);
    updateTrazaCount();

    // Reaplicar filtro activo para que la nueva fila respete el estado actual
    var activeFilter = document.querySelector('.traza-filter-btn.active');
    if (activeFilter && activeFilter.dataset.filter !== 'all') {
        filtrarTraza(activeFilter);
    }
}

function renderTrazaRow(instId) {
    var inst = kitInstances[instId];
    var row = document.getElementById('traza_' + instId);
    if (!row || !inst) return;

    if (inst.cancelled) {
        row.innerHTML =
            '<div class="traza-dot" style="background:#999;"></div>' +
            '<div class="traza-info">' +
            '<div class="traza-name" style="color:rgba(255,255,255,0.4);">' + inst.label + '</div>' +
            '<div class="traza-vol">' + inst.id + ' · ' + inst.voluntario + '</div>' +
            '</div>' +
            '<span class="traza-cancelado">Cancelado</span>';
        return;
    }

    var phasesHtml = TRAZA_PHASES.map(function (p, i) {
        var cls = i < inst.phase ? 'done' : (i === inst.phase ? 'current' : '');
        var isNext = i === inst.phase;
        var title = p.label + (isNext ? ' — clic para avanzar' : '');
        return (i > 0 ? '<div class="traza-arrow">›</div>' : '') +
            '<div class="traza-phase ' + cls + (isNext ? ' next-btn' : '') + '" ' +
            'title="' + title + '"' +
            (isNext ? ' onclick="avanzarFase(\'' + instId + '\')"' : '') + '>' +
            p.icon +
            '</div>';
    }).join('');

    var rightHtml = inst.phase >= TRAZA_PHASES.length
        ? '<span class="traza-entregado">✓ Entregado ' + inst.ts + '</span>'
        : '<div class="traza-phases">' + phasesHtml + '</div>';

    row.innerHTML =
        '<div class="traza-dot" style="background:' + inst.color + ';"></div>' +
        '<div class="traza-info">' +
        '<div class="traza-name">' + inst.label + '</div>' +
        '<div class="traza-vol">' + inst.voluntario + ' · ' + inst.pickup.split('·')[0].trim() + '</div>' +
        '</div>' +
        rightHtml +
        '<div class="traza-id">' + inst.id + '</div>';
}

function avanzarFase(instId) {
    var inst = kitInstances[instId];
    if (!inst || inst.cancelled) return;
    inst.phase = Math.min(inst.phase + 1, TRAZA_PHASES.length);
    if (inst.phase >= TRAZA_PHASES.length)
        inst.ts = new Date().toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' });
    renderTrazaRow(instId);
}

function updateTrazaCount() {
    var el = document.getElementById('trazaCount');
    if (!el) return;
    var total = Object.keys(kitInstances).length + Object.keys(donaciones).length;
    el.textContent = total;
}

// ── Añadir fila de donación en trazabilidad ──
function addDonTrazaRow(cod) {
    var trazaList = document.getElementById('trazaList');
    if (!trazaList) return;
    var empty = document.getElementById('trazaEmpty');
    if (empty) empty.style.display = 'none';

    var existing = document.getElementById('traza_don_' + cod);
    if (!existing) {
        var row = document.createElement('div');
        row.className = 'traza-row is-donacion';
        row.id = 'traza_don_' + cod;
        row.style.display = 'flex';
        row.dataset.filter = 'donacion';
        trazaList.appendChild(row);
    }

    var activeFilter = document.querySelector('.traza-filter-btn.active');
    if (activeFilter && activeFilter.dataset.filter !== 'all') filtrarTraza(activeFilter);

    syncDonTraza(cod);
    updateTrazaCount();
}

// ── Sincronizar estado de donación en trazabilidad ──
function syncDonTraza(cod) {
    var row = document.getElementById('traza_don_' + cod);
    if (!row) return;
    var d = donaciones[cod];
    if (!d) return;

    var donFaseIcons = ['⏳', '📍', '🚛', '✅'];
    var donFaseLabels = ['Pendiente', 'Asignada', 'En tránsito', 'Recibida'];
    var isRecibida = d.fase === 3;

    var donPhasesHtml = donFaseIcons.map(function (icon, i) {
        var cls = i < d.fase ? (i === 3 ? 'recibida-done' : 'done') : (i === d.fase ? 'current' : '');
        return (i > 0 ? '<div class="traza-arrow">›</div>' : '') +
            '<div class="don-fase-circle ' + cls + '" title="' + donFaseLabels[i] + '">' + icon + '</div>';
    }).join('');

    row.innerHTML =
        '<div class="traza-dot" style="background:#2C5FBF;"></div>' +
        '<div class="traza-info">' +
        '<div class="traza-name">' + d.empresa + ' · ' + d.desc + '</div>' +
        '<div class="traza-vol">' + d.cantidad + ' ' + d.unidad +
        (d.puntoAsignado ? ' · 📍 ' + d.puntoAsignado.split('—')[0].trim() : '') +
        '</div>' +
        '</div>' +
        '<div class="don-fase-phases">' + donPhasesHtml + '</div>' +
        '<span class="traza-don-badge">🚛 Donación</span>' +
        '<div class="traza-id">' + cod + '</div>';
}


// ── Init ──
document.addEventListener('DOMContentLoaded', function () {
    renderKitItems2('food');
    renderVolKitList();
    var addInput = document.getElementById('kitAddName');
    if (addInput) addInput.addEventListener('keydown', function (e) { if (e.key === 'Enter') addKitItem(); });
});

// Map filter/modal handled by Leaflet script below

// ══ MÓDULO DONACIONES ══
var donaciones = {};
var donCounter = 0;

var DON_CATEGORIAS = {
    alimentacion: { icon: '🍱', color: '#C0392B', bg: '#FDF0EF' },
    higiene: { icon: '🧴', color: '#E67E22', bg: '#FEF5EC' },
    ropa: { icon: '🧥', color: '#27AE60', bg: '#EAFAF1' },
    herramientas: { icon: '🔧', color: '#2C3E50', bg: '#F0F2F4' },
    agua: { icon: '💧', color: '#2980B9', bg: '#EBF5FB' },
    otro: { icon: '📦', color: '#7B5EA7', bg: '#F5F0FB' },
};

var DON_FASES = ['⏳ Pendiente', '📍 Asignada', '🚛 En tránsito', '✅ Recibida'];
var DON_ESTADOS = ['pendiente', 'asignada', 'transito', 'recibida'];

var DON_PUNTOS = [
    'Punto Colón — Calle Colón, 23',
    'Polideportivo Russafa — Av. Pérez Galdós',
    'IES Benlliure — C/ Benlliure, 1',
    'Almacén Municipal — Av. del Cid, 78',
    'Mercado Central — Plaza Ciudad de Brujas',
];

// ── Cambio de vista donaciones ──
function switchDonMode(mode) {
    var views = { registro: 'donViewRegistro', panel: 'donViewPanel', mias: 'donViewMias' };
    var btns = { registro: 'donModeReg', panel: 'donModePanel', mias: 'donModeMias' };
    Object.keys(views).forEach(function (k) {
        document.getElementById(views[k]).style.display = k === mode ? 'block' : 'none';
        var btn = document.getElementById(btns[k]);
        if (!btn) return;
        btn.style.background = k === mode ? 'var(--teal)' : 'transparent';
        btn.style.color = k === mode ? '#fff' : 'var(--muted)';
    });
    if (mode === 'panel') renderDonPanel();
    if (mode === 'mias') renderDonMias();
}

// ── Registrar donación ──
// ── Lista temporal de artículos antes de registrar ──
var donItemsTemp = [];

function donAgregarArticulo() {
    var desc = document.getElementById('donDesc').value.trim();
    var cantidad = document.getElementById('donCantidad').value.trim();
    var unidad = document.getElementById('donUnidad').value;
    var categoria = document.getElementById('donCategoria').value;


    if (!desc || !cantidad || !categoria) {
        alert('Rellena descripción, cantidad y categoría del artículo.');
        return;
    }

    donItemsTemp.push({ desc: desc, cantidad: cantidad, unidad: unidad, categoria: categoria });

    // Limpiar campos de artículo
    document.getElementById('donDesc').value = '';
    document.getElementById('donCantidad').value = '';
    document.getElementById('donCategoria').value = '';

    donRenderTabla();
}

function donRenderTabla() {
    var tbody = document.getElementById('donItemsTbody');
    var wrap = document.getElementById('donItemsWrap');
    if (!tbody || !wrap) return;

    wrap.style.display = donItemsTemp.length ? 'block' : 'none';

    tbody.innerHTML = donItemsTemp.map(function (it, i) {
        var cat = DON_CATEGORIAS[it.categoria] || DON_CATEGORIAS.otro;
        return '<tr>' +
            '<td>' + cat.icon + ' ' + it.desc + '</td>' +
            '<td>' + it.cantidad + '</td>' +
            '<td>' + it.unidad + '</td>' +
            '<td style="font-size:11px;color:var(--muted);">' + it.categoria + '</td>' +
            '<td><button class="don-item-del" onclick="donEliminarArticulo(' + i + ')" title="Eliminar">✕</button></td>' +
            '</tr>';
    }).join('');
}

function donEliminarArticulo(idx) {
    donItemsTemp.splice(idx, 1);
    donRenderTabla();
}

function registrarDonacion() {
    var empresa = document.getElementById('donEmpresa').value.trim();
    var transporte = document.getElementById('donTransporte').value;
    var fecha = document.getElementById('donFecha').value.trim();
    var origen = document.getElementById('donOrigen').value.trim();

    if (!empresa) { alert('Indica la empresa donante.'); return; }
    if (donItemsTemp.length === 0) { alert('Añade al menos un artículo a la lista.'); return; }

    donCounter++;
    // Usar la categoría del primer artículo como categoría principal del registro
    var catPrincipal = donItemsTemp[0].categoria;
    var cat = DON_CATEGORIAS[catPrincipal] || DON_CATEGORIAS.otro;
    var prefix = catPrincipal.toUpperCase().substring(0, 3);
    var codigo = 'DON-' + prefix + '-' + String(donCounter).padStart(3, '0');
    var ts = new Date().toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' });

    // Descripción resumida para la vista de lista
    var descResumen = donItemsTemp.length === 1
        ? donItemsTemp[0].desc + ' · ' + donItemsTemp[0].cantidad + ' ' + donItemsTemp[0].unidad
        : donItemsTemp.length + ' tipos de material';

    var cantidadTotal = donItemsTemp.reduce(function (s, it) { return s + parseFloat(it.cantidad || 0); }, 0);

    donaciones[codigo] = {
        codigo: codigo, empresa: empresa, categoria: catPrincipal,
        desc: descResumen, cantidad: cantidadTotal, unidad: 'uds.',
        items: JSON.parse(JSON.stringify(donItemsTemp)),
        transporte: transporte, fecha: fecha, origen: origen,
        cat: cat, fase: 0, puntoAsignado: null, ts: ts, cantidadReal: null
    };

    // Registrar en trazabilidad
    addDonTrazaRow(codigo);

    // QR
    var payload = encodeURIComponent('KIT2HELP|DON:' + codigo + '|EMP:' + empresa + '|ART:' + donItemsTemp.length);
    var qrUrl = 'https://api.qrserver.com/v1/create-qr-code/?size=120x120&data=' + payload;
    document.getElementById('donCodigo').textContent = codigo;
    document.getElementById('donQrImg').innerHTML =
        '<img src="' + qrUrl + '" width="120" height="120" style="border-radius:8px;" alt="QR donación">';
    document.getElementById('donConfirm').style.display = 'block';

    // Reset
    donItemsTemp = [];
    donRenderTabla();
    ['donEmpresa', 'donFecha', 'donOrigen'].forEach(function (id) { document.getElementById(id).value = ''; });
}

// ── Render panel coordinador ──
function renderDonPanel() {
    var list = document.getElementById('donPanelList');
    var empty = document.getElementById('donPanelEmpty');
    if (!list) return;
    var keys = Object.keys(donaciones);
    if (!keys.length) { list.innerHTML = ''; empty.style.display = 'block'; list.appendChild(empty); return; }
    // empty.style.display = 'none';
    list.innerHTML = keys.map(function (cod) { return renderDonRowHTML(cod, 'coord'); }).join('');
}

function renderDonMias() {
    var list = document.getElementById('donMiasList');
    var empty = document.getElementById('donMiasEmpty');
    if (!list) return;
    var keys = Object.keys(donaciones);
    if (!keys.length) { list.innerHTML = ''; empty.style.display = 'block'; list.appendChild(empty); return; }
    // empty.style.display = 'none';
    list.innerHTML = keys.map(function (cod) { return renderDonRowHTML(cod, 'mias'); }).join('');
}

// ── HTML de fila de donación ──

function _donItemsHtml(d) {
    if (!d.items || d.items.length <= 1) return '';
    return '<div style="font-size:11px;color:var(--muted);margin:2px 0 4px;font-weight:600;">📦 Artículos (' + d.items.length + ')</div>' +
        '<div style="display:flex;flex-direction:column;gap:3px;">' +
        d.items.map(function (it) {
            var cat = DON_CATEGORIAS[it.categoria] || DON_CATEGORIAS.otro;
            return '<div style="font-size:11px;color:var(--text);display:flex;gap:6px;">' +
                '<span>' + cat.icon + '</span>' +
                '<span style="flex:1;">' + it.desc + '</span>' +
                '<span style="color:var(--muted);">' + it.cantidad + ' ' + it.unidad + '</span>' +
                '</div>';
        }).join('') +
        '</div>';
}

// scope: 'coord' | 'mias'
function renderDonRowHTML(cod, scope) {
    var d = donaciones[cod];
    var cat = d.cat;
    var estado = DON_ESTADOS[d.fase];
    var isCoord = (scope === 'coord' || scope === true);
    var isMias = (scope === 'mias' || scope === false);

    var DON_FASE_ICONS = ['⏳', '📍', '🚛', '✅'];
    var fasesHtml = DON_FASES.map(function (f, i) {
        var isRecibida = i === 3 && i <= d.fase;
        var cls = i < d.fase ? (i === 3 ? 'recibida-done' : 'done') : (i === d.fase ? 'current' : '');
        return (i > 0 ? '<div class="traza-arrow">›</div>' : '') +
            '<div class="don-fase-circle ' + cls + '" title="' + f + '">' + DON_FASE_ICONS[i] + '</div>';
    }).join('');

    var puntoHtml = d.puntoAsignado
        ? '<div class="don-row-punto"><div style="font-size:11px;color:var(--muted);">📍 ' + d.puntoAsignado + '</div></div>' : '';

    var itemsHtml = _donItemsHtml(d);

    // COORDINADOR: asignar punto (fase 0)
    var assignHtml = '';
    if (isCoord && d.fase === 0) {
        var opts = DON_PUNTOS.map(function (p) {
            return '<option value="' + p + '">' + p + '</option>';
        }).join('');
        assignHtml =
            '<div class="don-assign-row">' +
            '<select class="don-assign-select" id="donsel_' + cod + '">' +
            '<option value="">Asignar punto de recogida…</option>' + opts +
            '</select>' +
            '<button class="don-assign-btn" onclick="asignarPunto(\'' + cod + '\')">Asignar</button>' +
            '</div>';
    }

    // VOLUNTARIO (mis donaciones): marcar en tránsito (fase 1)
    var transitoHtml = '';
    if (isMias && d.fase === 1) {
        transitoHtml =
            '<button class="don-avanzar-btn" onclick="marcarTransito(\'' + cod + '\')" ' +
            'style="background:var(--teal);color:#fff;border-color:var(--teal);">' +
            '🚛 Marcar como en tránsito' +
            '</button>';
    }

    // COORDINADOR: confirmar recepción (fase 2)
    var confirmarHtml = '';
    if (isCoord && d.fase === 2) {
        confirmarHtml =
            '<div style="display:flex;gap:6px;align-items:center;flex-wrap:wrap;">' +
            '<input id="donReal_' + cod + '" placeholder="Cantidad real recibida" ' +
            'style="flex:1;min-width:100px;border:1.5px solid var(--border);border-radius:8px;padding:5px 10px;font-size:12px;font-family:DM Sans,sans-serif;outline:none;">' +
            '<button class="don-assign-btn" onclick="confirmarRecepcion(\'' + cod + '\')">✅ Confirmar recepción</button>' +
            '</div>';
    }

    // Recibida: confirmación visual
    var recibidaHtml = '';
    if (d.fase === 3) {
        recibidaHtml =
            '<div style="font-size:11px;color:var(--teal);font-weight:600;">' +
            '✅ ' + (d.cantidadReal
                ? 'Cantidad confirmada: ' + d.cantidadReal + ' ' + d.unidad
                : 'Entrega verificada') +
            '</div>';
    }

    var rowId = 'donrow_' + (isCoord ? 'coord' : 'mias') + '_' + cod;

    return '<div class="don-row" id="' + rowId + '" data-estado="' + estado + '">' +
        '<div class="don-row-header">' +
        '<div class="don-row-icon" style="background:' + cat.bg + ';color:' + cat.color + ';">' + cat.icon + '</div>' +
        '<div class="don-row-info">' +
        '<div class="don-row-empresa">' + d.empresa + '</div>' +
        '<div class="don-row-desc">' + d.desc + ' · ' + d.cantidad + ' ' + d.unidad + '</div>' +
        '</div>' +
        '<span class="don-estado ' + estado + '">' + DON_FASES[d.fase] + '</span>' +
        '</div>' +
        '<div class="don-fase-phases">' + fasesHtml + '</div>' +
        puntoHtml + itemsHtml +
        '<div class="don-row-accion">' + assignHtml + transitoHtml + confirmarHtml + recibidaHtml + '</div>' +
        '<div class="don-row-code">' + cod + ' · ' + d.ts + (d.fecha ? ' · ' + d.fecha : '') + '</div>' +
        '</div>';
}

// ── Helpers: refrescar una sola fila en cada lista ──
function _refreshRow(cod) {
    var rc = document.getElementById('donrow_coord_' + cod);
    if (rc) rc.outerHTML = renderDonRowHTML(cod, 'coord');
    var rm = document.getElementById('donrow_mias_' + cod);
    if (rm) rm.outerHTML = renderDonRowHTML(cod, 'mias');
    syncDonTraza(cod);
}

// ── Asignar punto (coordinador, fase 0 → 1) ──
function asignarPunto(cod) {
    var sel = document.getElementById('donsel_' + cod);
    if (!sel || !sel.value) { alert('Selecciona un punto de recogida.'); return; }
    donaciones[cod].puntoAsignado = sel.value;
    donaciones[cod].fase = 1;
    _refreshRow(cod);

}

// ── Marcar en tránsito (voluntario, fase 1 → 2) ──
function marcarTransito(cod) {
    if (!donaciones[cod] || donaciones[cod].fase !== 1) return;
    donaciones[cod].fase = 2;
    _refreshRow(cod);

}

// ── Confirmar recepción (coordinador, fase 2 → 3) ──
function confirmarRecepcion(cod) {
    var input = document.getElementById('donReal_' + cod);
    donaciones[cod].cantidadReal = (input && input.value.trim()) || donaciones[cod].cantidad;
    donaciones[cod].fase = 3;
    _refreshRow(cod);

}

// ── Filtrar donaciones en panel coordinador ──
function filtrarDon(btn) {
    document.querySelectorAll('.don-filter-btn').forEach(function (b) { b.classList.remove('active'); });
    btn.classList.add('active');
    var f = btn.dataset.filter;
    document.querySelectorAll('#donPanelList .don-row').forEach(function (row) {
        row.style.display = (f === 'all' || row.dataset.estado === f) ? 'flex' : 'none';
    });
}

// ── Live counters ──
setInterval(() => {
    [['liveKits', 1], ['livePeople', 3]].forEach(([id, d]) => {
        if (Math.random() > 0.55) {
            const el = document.getElementById(id);
            if (el) el.textContent = parseInt(el.textContent) + d;
        }
    });
}, 3200);




// ── Coordination panel navigation ──
function coordGoStep(step) {
    // On restart (back to step 1), clear the injected report
    if (step === 1) {
        var slot = document.getElementById('coordUserReportSlot');
        if (slot) slot.innerHTML = '';
    }
    [1, 2, 3].forEach(function (i) {
        var screen = document.getElementById('coord-step-' + i);
        var pill = document.getElementById('pill-' + i);
        if (!screen || !pill) return;
        screen.classList.toggle('active', i === step);
        pill.classList.remove('active', 'done');
        if (i === step) pill.classList.add('active');
        if (i < step) pill.classList.add('done');
    });
    var pct = { 1: '33%', 2: '66%', 3: '100%' }[step] || '33%';
    var bar = document.getElementById('coordProgressBar');
    if (bar) bar.style.width = pct;
}

function coordEnviarReporte() {
    var btn = document.querySelector('#coord-step-2 .coord-btn-next');

    // Read form values
    var tipoEl = document.getElementById('coordTipo');
    var zonaEl = document.getElementById('coordZona');
    var personasEl = document.getElementById('coordPersonas');
    var detalleEl = document.getElementById('coordDetalle');

    var tipoLabels = {
        'necesidad': 'Necesidad urgente',
        'recurso': 'Recurso disponible',
        'bloqueo': 'Acceso bloqueado',
        'evacuacion': 'Evacuación necesaria'
    };
    var tipoIconos = {
        'necesidad': '🆘',
        'recurso': '📦',
        'bloqueo': '🚧',
        'evacuacion': '🏃'
    };

    var tipo = tipoEl ? tipoEl.value : 'necesidad';
    var zona = zonaEl ? zonaEl.value : 'Zona desconocida';
    var personas = personasEl ? personasEl.value : '?';
    var detalle = detalleEl ? detalleEl.value : '';
    var icono = tipoIconos[tipo] || '📋';
    var label = tipoLabels[tipo] || tipo;

    // Button feedback
    if (btn) {
        btn.textContent = '✓ Enviando...';
        btn.disabled = true;
        btn.style.background = '#085041';
    }

    setTimeout(function () {
        if (btn) {
            btn.textContent = 'Enviar reporte →';
            btn.style.background = '';
            btn.disabled = false;
        }

        // Build the user-report card for step 3
        var slot = document.getElementById('coordUserReportSlot');
        if (slot) {
            var now = new Date();
            var timeStr = 'Hace unos segundos';

            var metaHtml = '<span class="coord-tag coord-tag-orange">' + zona + '</span>';
            if (personas) metaHtml += ' <span class="coord-tag coord-tag-red">👥 ' + personas + ' personas</span>';

            slot.innerHTML =
                '<div class="coord-user-report">' +
                '<div class="coord-user-report-icon">' + icono + '</div>' +
                '<div class="coord-user-report-content">' +
                '<div class="coord-user-report-title">' + label + '</div>' +
                '<div class="coord-user-report-body">' + (detalle || zona) + '</div>' +
                '<div class="coord-user-report-meta">' + metaHtml + '</div>' +
                '<div class="coord-processing-badge">' +
                '<div class="dot-pulse" style="width:6px;height:6px;background:var(--teal);"></div>' +
                'Procesando por coordinación<span class="coord-processing-dots"></span>' +
                '</div>' +
                '</div>' +
                '</div>' +
                '<div class="coord-divider">Respuesta del coordinador</div>';

            // After 2s replace the "processing" badge with "processed"
            setTimeout(function () {
                var badge = slot.querySelector('.coord-processing-badge');
                if (badge) {
                    badge.innerHTML = '<span style="color:var(--teal);">✓</span> Triado y publicado en el canal';
                    badge.style.color = 'var(--teal)';
                }
            }, 2000);
        }

        coordGoStep(3);

        // Scroll step-3 to top to show the user report
        var step3 = document.getElementById('coord-step-3');
        if (step3) step3.scrollTop = 0;

    }, 800);
}


window.toggleNecMap = function () {
    var box = document.getElementById('necMapBox');
    var btn = document.getElementById('necMapToggle');
    if (!box || !btn) return;
    var isOpen = box.classList.toggle('open');
    btn.classList.toggle('open', isOpen);
    btn.textContent = isOpen ? '🗺️ Ocultar mapa' : '🗺️ Ver mapa';
    if (isOpen) {
        setTimeout(function () {
            if (_necMap) { _necMap.invalidateSize(); }
            else { initNecMap(); }
        }, 150);
    }
};

// ══════════════════════════════════════════════
// DEMO — 5 tabs (mobile-first)
// ══════════════════════════════════════════════

// ── switchDemo ──
window.switchDemo = function (tab) {
    document.querySelectorAll('.demo-panel').forEach(function (p) { p.classList.remove('active'); });
    var panel = document.getElementById('tab-' + tab);
    if (panel) panel.classList.add('active');
    var order = ['necesidad', 'validacion', 'muro', 'kits', 'traza', 'donacion'];
    var idx = order.indexOf(tab);
    document.querySelectorAll('.demo-step').forEach(function (s, i) {
        s.classList.remove('active', 'done');
        if (i < idx) s.classList.add('done');
        else if (i === idx) s.classList.add('active');
    });
    if (tab === 'muro' && window._necValidada) {
        var d = document.getElementById('muroNecDinamica');
        if (d) d.style.display = 'flex';
    }
    if (tab === 'donacion' && typeof renderDonPanel === 'function') {
        renderDonPanel();
    }
};

// ── chip / prio helpers ──
window.selectChipIn = function (el, groupId) {
    var g = document.getElementById(groupId);
    if (g) g.querySelectorAll('.chip').forEach(function (c) { c.classList.remove('active'); });
    el.classList.add('active');
};
window.selectPrioIn = function (el, rowId, level) {
    var g = document.getElementById(rowId);
    if (g) g.querySelectorAll('.prio-btn').forEach(function (b) { b.className = 'prio-btn'; });
    el.classList.add('active-' + level);
};

// ── Estado interno Tab 1 ──
var _necVolTipo = 'requerir';   // 'requerir' | 'ofrecer'
var _necShelTipo = 'solicitud';  // 'solicitud' | 'oferta'

// Actualiza visibilidad de campos según categoría + sub-tipo
function _necUpdateFields() {
    var catEl = document.querySelector('#necCatChips .chip.active');
    var isEmerg = catEl && catEl.classList.contains('chip-emergency');
    var isVol = catEl && catEl.classList.contains('chip-volunteer');
    var isShelter = catEl && catEl.classList.contains('chip-shelter');
    var isCheck = catEl && catEl.classList.contains('chip-checkpoint');
    var isOferVol = isVol && _necVolTipo === 'ofrecer';

    // Prioridad: ocultar si ofrece voluntarios O si es punto de encuentro
    var prioGroup = document.getElementById('necPrioGroup');
    if (prioGroup) prioGroup.style.display = isCheck ? 'none' : '';

    // Personas afectadas
    var persGroup = document.getElementById('necPersonasGroup');
    var persLabel = document.getElementById('necPersonasLabel');
    var showPers = isEmerg || isVol || isShelter;
    if (persGroup) persGroup.style.display = showPers ? '' : 'none';
    if (persLabel) {
        if (isVol && _necVolTipo === 'requerir') persLabel.textContent = 'Voluntarios requeridos (aprox.)';
        else if (isShelter && _necShelTipo === 'solicitud') persLabel.textContent = 'Personas a alojar';
        else if (isShelter && _necShelTipo === 'oferta') persLabel.textContent = 'Capacidad de personas';
        else persLabel.textContent = 'Personas afectadas';
    }

    // Sub-rows
    var volSub = document.getElementById('necVolSubRow');
    var shelSub = document.getElementById('necShelSubRow');
    var checkSub = document.getElementById('necCheckSubRow');
    if (volSub) volSub.classList.toggle('visible', isVol);
    if (checkSub) checkSub.classList.toggle('visible', isCheck);
    if (shelSub) {
        shelSub.classList.toggle('visible', isShelter);
        if (isShelter) {
            var activeShel = shelSub.querySelector('.chip.active');
            if (!activeShel) { var first = shelSub.querySelector('.chip'); if (first) first.classList.add('active'); }
        }
    }
}

var _necCheckTipo = 'sanitario';
window.selectCheckTipo = function (tipo) {
    _necCheckTipo = tipo;
    var med = document.getElementById('necCheckMed');
    var vol = document.getElementById('necCheckVol');
    if (med) med.classList.toggle('active', tipo === 'sanitario');
    if (vol) vol.classList.toggle('active', tipo === 'coordinacion');
};

var _necVolTipoCard = 'oficial';

window.selectVolTipoCard = function (card, tipo) {
    _necVolTipoCard = tipo;
    document.querySelectorAll('#necVolTipoGrid .vol-type-card').forEach(function (c) {
        c.classList.remove('selected');
    });
    card.classList.add('selected');
};

window.selectVolTipo = function (tipo) {
    _necVolTipo = tipo;
    var req = document.getElementById('necVolReq');
    var ofe = document.getElementById('necVolOfe');
    if (req) req.classList.toggle('active', tipo === 'requerir');
    if (ofe) ofe.classList.toggle('active', tipo === 'ofrecer');
    _necUpdateFields();
};

window.selectShelTipo = function (tipo) {
    _necShelTipo = tipo;
    var sol = document.getElementById('necShelSol');
    var ofe = document.getElementById('necShelOfe');
    if (sol) sol.classList.toggle('active', tipo === 'solicitud');
    if (ofe) ofe.classList.toggle('active', tipo === 'oferta');
    _necUpdateFields();
};

// ── Categoría con lógica especial de Emergencia ──
window.selectCat = function (el, groupId) {
    var g = document.getElementById(groupId);
    if (g) g.querySelectorAll('.chip').forEach(function (c) { c.classList.remove('active'); });
    el.classList.add('active');
    var isEmergency = el.classList.contains('chip-emergency');
    var notice = document.getElementById('emergencyNotice');
    var prioRow = document.getElementById('necPrioRow');
    if (isEmergency) {
        if (notice) notice.style.display = 'flex';
        if (prioRow) {
            prioRow.querySelectorAll('.prio-btn').forEach(function (b) { b.className = 'prio-btn'; b.style.opacity = '0.4'; b.style.pointerEvents = 'none'; });
            var highBtn = prioRow.querySelector('.prio-btn:last-child');
            if (highBtn) { highBtn.className = 'prio-btn active-high'; highBtn.style.opacity = '1'; }
        }
    } else {
        if (notice) notice.style.display = 'none';
        if (prioRow) prioRow.querySelectorAll('.prio-btn').forEach(function (b) { b.style.opacity = ''; b.style.pointerEvents = ''; });
    }
    // Reset sub-tipo state on category change

    _necVolTipo = 'requerir';
    _necShelTipo = 'solicitud';
    _necCheckTipo = 'sanitario';
    var req = document.getElementById('necVolReq'); if (req) req.classList.add('active');
    var ofe = document.getElementById('necVolOfe'); if (ofe) ofe.classList.remove('active');
    var sol = document.getElementById('necShelSol'); if (sol) sol.classList.add('active');
    var ofe2 = document.getElementById('necShelOfe'); if (ofe2) ofe2.classList.remove('active');
    var med = document.getElementById('necCheckMed'); if (med) med.classList.add('active');
    var vol = document.getElementById('necCheckVol'); if (vol) vol.classList.remove('active');
    _necUpdateFields();
};

// ── TAB 1 ──


// ══ MAPA DE NECESIDAD ══
var _necMap = null;
var _muroItemsValidados = []; // {cardId, muroEl, mapPin}
var _necMarker = null;


function _necMakeIcon(color, icon, size) {
    var fs = Math.round(size * 0.42);
    return L.divIcon({
        className: '',
        html:
            '<div style="width:' + size + 'px;height:' + size + 'px;border-radius:50%;background:' + color + ';' +
            'display:flex;align-items:center;justify-content:center;font-size:' + fs + 'px;font-weight:700;' +
            'color:#fff;box-shadow:0 3px 10px rgba(0,0,0,0.35);border:2px solid rgba(255,255,255,0.35);">' + icon + '</div>',
        iconSize: [size, size],
        iconAnchor: [size / 2, size / 2],
        popupAnchor: [0, -(size / 2 + 8)]
    });
}

function _necPinIcon(color) {
    color = color || '#E24B4A';
    return L.divIcon({
        className: '',
        html:
            '<div style="position:relative;width:28px;height:36px;">' +
            '<div style="width:28px;height:28px;border-radius:50% 50% 50% 0;background:' + color + ';' +
            'transform:rotate(-45deg);box-shadow:0 3px 10px rgba(0,0,0,0.35);border:2px solid rgba(255,255,255,0.4);"></div>' +
            '<div style="position:absolute;top:6px;left:6px;width:16px;height:16px;border-radius:50%;' +
            'background:rgba(255,255,255,0.9);display:flex;align-items:center;justify-content:center;font-size:9px;">📍</div>' +
            '</div>',
        iconSize: [28, 36],
        iconAnchor: [14, 36],
        popupAnchor: [0, -38]
    });
}

/*  function _necMakeIcon(color, icon, size) {
    return L.divIcon({
        className: '',
    html: '<div style="width:' + size + 'px;height:' + size + 'px;border-radius:50%;background:' + color + ';display:flex;align-items:center;justify-content:center;font-size:' + Math.round(size * 0.42) + 'px;font-weight:700;color:#fff;box-shadow:0 3px 10px rgba(0,0,0,0.35);border:2px solid rgba(255,255,255,0.35);">' + icon + '</div>',
    iconSize: [size, size], iconAnchor: [size / 2, size / 2], popupAnchor: [0, -(size / 2 + 4)]
    });
  }

    function _necPulseIcon(color) {
    return L.divIcon({
        className: '',
    html: '<div style="position:relative;width:36px;height:36px;">' +
        '<div style="position:absolute;inset:0;border-radius:50%;background:' + color + ';opacity:0.2;animation:necPulseRing 1.8s ease-out infinite;"></div>' +
        '<div style="position:absolute;inset:3px;border-radius:50%;background:' + color + ';display:flex;align-items:center;justify-content:center;color:#fff;font-size:16px;font-weight:800;box-shadow:0 2px 10px rgba(0,0,0,0.4);">📍</div>' +
        '</div>',
    iconSize: [36, 36], iconAnchor: [18, 18], popupAnchor: [0, -22]
    });
  }*/

function _necPulseIcon(color) {
    return L.divIcon({
        className: '',
        html:
            '<div style="position:relative;width:40px;height:40px;">' +
            '<div style="position:absolute;inset:0;border-radius:50%;background:' + color + ';opacity:0.18;animation:necPulseRing 1.8s ease-out infinite;"></div>' +
            '<div style="position:absolute;inset:6px;border-radius:50%;background:' + color + ';display:flex;align-items:center;justify-content:center;font-size:14px;line-height:1;box-shadow:0 2px 10px rgba(0,0,0,0.4);">🚨</div>' +
            '</div>',
        iconSize: [40, 40],
        iconAnchor: [20, 20],
        popupAnchor: [0, -26]
    });
}

(function () {
    var s = document.createElement('style');
    s.textContent = '@keyframes necPulseRing{0 % { transform: scale(1); opacity: 0.22 }70%{transform:scale(2.2);opacity:0}100%{transform:scale(2.2);opacity:0}}';
    document.head.appendChild(s);
})();

function initNecMap() {
    var el = document.getElementById('necMap');
    if (!el) return;
    if (_necMap) { _necMap.invalidateSize(); return; }

    _necMap = L.map('necMap', {
        zoomControl: false,
        attributionControl: false,
        scrollWheelZoom: false,
        dragging: true,
        doubleClickZoom: false
    }).setView([39.4617, -0.3854], 16);

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', { maxZoom: 19 }).addTo(_necMap);

    var ctx = [
        { lat: 39.4641, lng: -0.3879, color: '#1D9E75', icon: 'K', tip: '<b>📦 Recogida de kits</b><br>Polideportivo Russafa' },
        { lat: 39.4598, lng: -0.3831, color: '#7B5EA7', icon: 'V', tip: '<b>🤝 Voluntarios</b><br>12 activos' },
        { lat: 39.4633, lng: -0.3808, color: '#EF9F27', icon: 'P', tip: '<b>📍 Punto de encuentro</b><br>Pl. Ayuntamiento' },
        { lat: 39.4589, lng: -0.3869, color: '#3A7BD5', icon: 'R', tip: '<b>🏠 Refugio</b><br>C/ Colón 40 · 30 plazas' }
    ];
    ctx.forEach(function (m) {
        L.marker([m.lat, m.lng], { icon: _necMakeIcon(m.color, m.icon, 26) })
            .bindPopup(m.tip, { className: 'k2-popup', maxWidth: 180 })
            .addTo(_necMap);
    });

    _necMarker = L.marker([39.4617, -0.3854], {
        icon: _necPinIcon('#E24B4A'),
        zIndexOffset: 1000,
        draggable: true
    })
        .bindPopup('<b>📍 Ubicación seleccionada</b><br><span style="font-size:11px;color:#555;">Cargando dirección...</span>',
            { className: 'k2-popup', maxWidth: 220 })
        .addTo(_necMap);

    // Actualiza popup y campo necUbic con la dirección real
    function _necActualizarPopup(texto) {
        if (!texto) return;
        _necMarker.setPopupContent(
            '<b>📍 Ubicación seleccionada</b><br>' +
            '<span style="font-size:11px;color:#1D9E75;">' + texto + '</span>'
        );
        var el = document.getElementById('necUbic');
        if (el) el.value = texto;
    }

    // Geocodificación inversa al soltar el marker
    _necMarker.on('dragend', function () {
        var ll = _necMarker.getLatLng();
        _necMarker.setPopupContent(
            '<b>📍 Ubicación seleccionada</b><br>' +
            '<span style="font-size:11px;color:#1D9E75;">Obteniendo dirección...</span>'
        );
        _necMarker.openPopup();
        _necReverseGeocode(ll, _necActualizarPopup);
    });

    // Click en mapa: mover marker y geocodificar
    _necMap.on('click', function (e) {
        _necMarker.setLatLng(e.latlng);
        _necMarker.setIcon(_necPinIcon('#E24B4A'));
        _necMarker.setPopupContent(
            '<b>📍 Ubicación seleccionada</b><br>' +
            '<span style="font-size:11px;color:#1D9E75;">Obteniendo dirección...</span>'
        );
        _necMarker.openPopup();
        _necReverseGeocode(e.latlng, _necActualizarPopup);
    });

    // Cargar dirección inicial
    _necReverseGeocode({ lat: 39.4617, lng: -0.3854 }, _necActualizarPopup);
}

function _necReverseGeocode(latlng, callback) {
    fetch('https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=' + latlng.lat + '&lon=' + latlng.lng)
        .then(function (r) { return r.json(); })
        .then(function (data) {
            var road = data.address.road || data.address.pedestrian || data.address.footway || data.address.street || '';
            var number = data.address.house_number ? ' ' + data.address.house_number : '';
            var suburb = data.address.suburb || data.address.neighbourhood || data.address.quarter || '';
            var label = road
                ? (road + number + (suburb ? ', ' + suburb : ''))
                : (data.display_name || (latlng.lat.toFixed(5) + ', ' + latlng.lng.toFixed(5)));
            var el = document.getElementById('necUbic');
            if (el) el.value = label;
            if (typeof callback === 'function') callback(label);
        })
        .catch(function () {
            var fallback = latlng.lat.toFixed(5) + ', ' + latlng.lng.toFixed(5);
            var el = document.getElementById('necUbic');
            if (el) el.value = fallback;
            if (typeof callback === 'function') callback(fallback);
        });
}

setTimeout(initNecMap, 400);

var _origSwitchDemoNec = window.switchDemo;
window.switchDemo = function (tab) {
    _origSwitchDemoNec(tab);
    if (tab === 'necesidad') {
        setTimeout(function () {
            initNecMap();
            if (_necMap) _necMap.invalidateSize();
        }, 200);
    }
};
var _origEnviarNec = window.enviarNecesidad;
window.enviarNecesidad = function () {
    if (_necMarker) {
        var me = _necMarker.getElement ? _necMarker.getElement() : null;
        if (me) { me.style.filter = 'brightness(2) drop-shadow(0 0 8px #E24B4A)'; setTimeout(function () { if (me) me.style.filter = ''; }, 700); }
    }
    _origEnviarNec && _origEnviarNec();
};


window.enviarNecesidad = function () {
    var btn = document.getElementById('necBtn');
    btn.textContent = '✓ Enviando...'; btn.style.background = '#085041'; btn.disabled = true;
    setTimeout(function () {
        var catEl = document.querySelector('#necCatChips .chip.active');
        var isEmerg = catEl && catEl.classList.contains('chip-emergency');
        var isVol = catEl && catEl.classList.contains('chip-volunteer');
        var isShelter = catEl && catEl.classList.contains('chip-shelter');
        var prioEl = document.querySelector('#necPrioRow .prio-btn[class*="active"]');
        var isCheck = catEl && catEl.classList.contains('chip-checkpoint');
        var prioText = isEmerg ? 'Alta 🚨' : (prioEl ? prioEl.textContent : '—');

        var catLabels = {
            'chip-emergency': '🚨 Emergencia',
            'chip-volunteer': '🤝 Voluntarios',
            'chip-checkpoint': '📍 Punto de encuentro',
            'chip-storage': '📦 Recogida de kits',
            'chip-shelter': '🏠 Refugio / Hospedaje'
        };
        var catClass = catEl ? Array.from(catEl.classList).find(function (c) { return catLabels[c]; }) : null;
        var catText = catClass ? catLabels[catClass] : (catEl ? catEl.textContent : '—');
        if (isVol) {
            var volTipoLabels = { oficial: '🛡️ Oficial', tecnico: '🛠️ Técnico', operativo: '🦺 Operativo', ciudadano: '🧹 Ciudadano' };
            catText += ' · ' + (_necVolTipo === 'requerir' ? 'Requerir' : 'Ofrecer');
            catText += ' · ' + (volTipoLabels[_necVolTipoCard] || _necVolTipoCard);
        }
        if (isShelter) catText += ' · ' + (_necShelTipo === 'solicitud' ? 'Solicitud' : 'Oferta');
        if (isCheck) catText += ' · ' + (_necCheckTipo === 'sanitario' ? '🏥 Sanitario' : '📡 Coordinacion');

        var rows = [
            ['Ubicación', (document.getElementById('necUbic') || {}).value || '—'],
            ['Categoría', catText],
            ['Descripción', (document.getElementById('necDesc') || {}).value || '—'],
        ];
        if ((!isVol || _necVolTipo !== 'ofrecer') && !isCheck) rows.push(['Prioridad', prioText]);
        var persGroup = document.getElementById('necPersonasGroup');
        if (persGroup && persGroup.style.display !== 'none') {
            var persLabel = (document.getElementById('necPersonasLabel') || {}).textContent || 'Personas';
            rows.push([persLabel, (document.getElementById('necPersonas') || {}).value || '—']);
        }

        var summary = document.getElementById('necSummary');
        if (summary) {
            summary.innerHTML = rows.map(function (r) {
                var valStyle = isEmerg && r[0] === 'Prioridad' ? 'font-weight:600;color:#E24B4A;' : 'font-weight:500;';
                return '<div class="nec-summary-row"><span style="color:var(--muted);">' + r[0] + '</span><span style="' + valStyle + '">' + r[1] + '</span></div>';
            }).join('');
        }

        if (isVol && _necVolTipo === 'ofrecer') {
            window._necCheckpointCallback = true;
            var extraMsg = document.getElementById('necConfirmExtra');
            if (!extraMsg) {
                extraMsg = document.createElement('div');
                extraMsg.id = 'necConfirmExtra';
                extraMsg.style.cssText = 'margin-top:8px;font-size:12px;color:#EF9F27;background:#FEF5EC;border-radius:10px;padding:10px;line-height:1.5;';
                var conf = document.getElementById('necConfirm');
                if (conf) conf.appendChild(extraMsg);
            }
            extraMsg.textContent = '📍 Punto de encuentro asignado automáticamente al finalizar triaje.';
        }

        var conf = document.getElementById('necConfirm');
        if (conf) conf.classList.add('visible');

        // ── NUEVO: reactivar botón para nueva necesidad ──
        btn.textContent = '+ Nueva necesidad';
        btn.style.background = '';
        btn.disabled = false;
        window._necEnviada = true;
        _inyectarCardTriaje(catText, prioText, isEmerg, rows);
        // ── Pill móvil sobre el mapa ──
        var pill = document.getElementById('necMapPill');
        if (pill) {
            var pillCat = document.getElementById('necMapPillCat');
            var pillUbic = document.getElementById('necMapPillUbic');
            if (pillCat) pillCat.textContent = catText;
            if (pillUbic) pillUbic.textContent = '📍 ' + ((document.getElementById('necUbic') || {}).value || '—');
            pill.classList.add('visible');
        }
        // ── Forzar re-render del mapa tras colapso flex ──
        if (window._necMap) {
            setTimeout(function () { window._necMap.invalidateSize(); }, 120);
        }

        // ── NUEVO: inyectar card dinámica en triaje ──
        _inyectarCardTriaje(catText, prioText, isEmerg, rows);

    }, 700);
};

// ── Helper: inyectar nueva card en panel de triaje ──
function _inyectarCardTriaje(catText, prioText, isEmerg, rows) {
    var valList = document.querySelector('#tab-validacion .val-list');
    if (!valList) return;

    // Contador para IDs únicos
    if (!window._necDynCounter) window._necDynCounter = 0;
    window._necDynCounter++;
    var n = 'dynNec' + window._necDynCounter;
    var borderColor = isEmerg ? '#E24B4A' : '#1D9E75';
    var iconEmoji = isEmerg ? '🚨' : '📋';
    var iconBg = isEmerg ? '#FDEDEC' : '#E1F5EE';
    var prio = isEmerg
        ? '<span class="d-badge d-badge-urg">🔴 Alta — ' + catText + '</span>'
        : '<span class="d-badge d-badge-pend">● ' + catText + '</span>';

    var detailsHtml = rows.map(function (r) {
        return '<div class="val-field">' + r[0] + '<span>' + r[1] + '</span></div>';
    }).join('');

    var card = document.createElement('div');
    card.className = 'val-card';
    card.id = n;
    card.dataset.estado = 'pendiente';
    card.dataset.emerg = isEmerg ? '1' : '0';
    card.style.borderLeft = '3px solid ' + borderColor;
    card.style.animation = 'coordSlideIn 0.4s ease both';
    card.innerHTML =
        '<div class="val-header">' +
        '<div class="val-header-top">' +
        '<div class="val-icon" style="background:' + iconBg + ';">' + iconEmoji + '</div>' +
        '<div class="val-info">' +
        '<div class="val-title">' + catText + ' · Nueva solicitud</div>' +
        '<div class="val-meta">📍 Recién enviada ' + prio + '</div>' +
        '</div>' +
        '</div>' +
        '<div class="val-actions">' +
        '<button class="val-btn val-btn-ok" onclick="validarNec(event,\'' + n + '\',\'' + n + 'act\',\'' + n + 'done\',true)">✓ Validar</button>' +
        '<button class="val-btn val-btn-rej" onclick="validarNec(event,\'' + n + '\',\'' + n + 'act\',\'' + n + 'done\',false)">✕ Rechazar</button>' +
        '<button class="val-btn val-btn-more" onclick="toggleValExpand(\'' + n + 'exp\');event.stopPropagation()">Detalles</button>' +
        '<button class="val-btn val-btn-cancel" onclick="cerrarNecesidad(\'' + n + '\',event)">⏹ Cancelar</button>' +
        '</div>' +
        '</div>' +
        '<div class="val-expand" id="' + n + 'exp">' +
        '<div class="val-expand-grid">' + detailsHtml + '</div>' +
        '<div style="margin-top:6px;padding:7px 10px;background:#E1F5EE;border-radius:8px;font-size:11px;color:#085041;">📬 Recibida ahora — pendiente de validación por coordinador</div>' +
        '<div class="val-done-msg" id="' + n + 'done"></div>' +
        '</div>';

    // Insertar al principio de la lista
    valList.insertBefore(card, valList.firstChild);

    // Actualizar contador del filtro "Todas"
    filtrarVal('todas', document.getElementById('valFiltroTodas'));
}

// ── Asignar responsable en triaje ──
window.asignarResp = function (inputId, displayId) {
    var inp = document.getElementById(inputId);
    var disp = document.getElementById(displayId);
    if (!inp || !disp) return;
    var name = inp.value.trim();
    if (!name) { inp.focus(); return; }
    disp.textContent = '✓ ' + name;
    disp.style.color = 'var(--teal)';
    disp.style.fontWeight = '600';
    inp.value = '';
    inp.closest('div').querySelector('button').textContent = 'Cambiar';
};

// ── Color picker para kit personalizado ──
var _customKitColor = '#7B5EA7';
var _customKitColorName = 'morado';
var COLOR_NAMES = {
    '#7B5EA7': 'morado', '#E24B4A': 'rojo', '#EF9F27': 'naranja',
    '#1D9E75': 'verde', '#3A7BD5': 'azul', '#2C3E50': 'grafito',
    '#E91E8C': 'rosa', '#00796B': 'teal oscuro'
};
window.selectKitColor = function (el) {
    document.querySelectorAll('#kitColorPicker .kit-color-swatch').forEach(function (s) { s.classList.remove('active'); });
    el.classList.add('active');
    _customKitColor = el.dataset.color;
    _customKitColorName = COLOR_NAMES[_customKitColor] || _customKitColor;
    // Update strip and hint
    var strip = document.getElementById('kitColorStrip');
    if (strip) strip.style.background = _customKitColor;
    var dot = document.getElementById('kitColorHintDot');
    var txt = document.getElementById('kitColorHintText');
    if (dot) dot.style.background = _customKitColor;
    if (txt) txt.innerHTML = 'Crea el kit e identifícalo con el color <strong>' + _customKitColorName + '</strong>';
    // Update custom kit data color
    KIT_TYPES.custom.color = _customKitColor;
    KIT_TYPES.custom.strip = _customKitColor;
    KIT_TYPES.custom.itemBg = _customKitColor + '18';
    KIT_TYPES.custom.borderColor = _customKitColor;
    if (currentKitType === 'custom') buildItemsDOM();
};

// ── TAB 2 ──
window.toggleValExpand = function (id) {
    var el = document.getElementById(id);
    if (el) el.classList.toggle('open');
};

window.validarNec = function (e, cardId, actId, doneId, ok) {
    e.stopPropagation();
    var card = document.getElementById(cardId);
    var doneEl = document.getElementById(doneId);

    if (doneEl) {
        doneEl.style.display = 'block';
        if (ok) {
            doneEl.style.cssText += 'background:#EAFAF1;color:#1D6A3A;';
            doneEl.textContent = '✓ Validada — publicada en el muro de coordinación';
            card.dataset.estado = 'validada';

            // Ocultar validar/rechazar, mostrar cancelar
            var okBtn = card.querySelector('.val-btn-ok');
            var rejBtn = card.querySelector('.val-btn-rej');
            var canBtn = card.querySelector('.val-btn-cancel');
            if (okBtn) okBtn.style.display = 'none';
            if (rejBtn) rejBtn.style.display = 'none';
            if (canBtn) canBtn.style.display = 'inline-flex';

            // Leer datos de la card para muro y estado necesidades
            var title = (card.querySelector('.val-title') || {}).textContent || '—';
            console.log('Título de card para muro:', title);
            var desc = '';
            var fields = card.querySelectorAll('.val-field');
            fields.forEach(function (f) {
                var label = f.childNodes[0] ? f.childNodes[0].textContent.trim() : '';
                var val = (f.querySelector('span') || {}).textContent || '';
                if (label === 'Descripción') desc = val;
            });
            // Fallback: leer necDesc si es una card dinámica recién creada
            if (!desc) desc = (document.getElementById('necDesc') || {}).value || '';

            var ubic = title.split('·')[1] ? title.split('·')[1].trim() : title;
            var isEmerg = card.dataset.emerg === '1'
                || (card.style.borderLeft && card.style.borderLeft.indexOf('226, 75, 74') > -1)
                || (card.style.borderLeft && card.style.borderLeft.indexOf('#E24B4A') > -1);
            var dotColor = isEmerg ? '#E24B4A' : '#1D9E75';
            var tagBg = isEmerg ? '#FDEDEC' : '#EAFAF1';
            var tagColor = isEmerg ? '#922B21' : '#1D6A3A';
            var tagText = isEmerg ? '🚨 Emergencia' : '✓ Validada';
            var btnText = isEmerg ? 'Atender' : 'Coordinar';

            // Publicar en muro
            var muroEl = _publicarEnMuro(title, desc, dotColor, tagBg, tagColor, tagText, btnText);
            // ── Pin en mapa ──
            var mapPin = _añadirPinMapa(title, isEmerg);
            // Actualizar estado en panel necesidades (necConfirm)
            _actualizarEstadoNecesidad(title, desc);
            _muroItemsValidados.push({ cardId: cardId, muroEl: muroEl, mapPin: mapPin });

        } else {
            doneEl.style.cssText += 'background:#FDEDEC;color:#922B21;';
            doneEl.textContent = '✕ Rechazada — solicitante notificado';
            card.dataset.estado = 'rechazada';
            var actEls = card.querySelectorAll('.val-btn-ok, .val-btn-rej, .val-btn-more, .val-btn-cancel');
            actEls.forEach(function (b) { b.style.display = 'none'; });
        }

        var badge = card.querySelector('.d-badge');
        if (badge) {
            badge.className = 'd-badge ' + (ok ? 'd-badge-ok' : 'nec-badge-rej');
            badge.textContent = ok ? '✓ Validada' : '✕ Rechazada';
        }
        var expandId = doneId.replace('valDone', 'valExpand').replace('done', 'exp');
        var expEl = document.getElementById(expandId);
        if (!expEl) expEl = document.getElementById(doneId.replace('done', 'exp'));
        if (expEl && !expEl.classList.contains('open')) expEl.classList.add('open');
    }
    filtrarVal('todas', document.getElementById('valFiltroTodas'));
};

// ── Publica entrada en el muro de coordinación ──
function _publicarEnMuro(title, desc, dotColor, tagBg, tagColor, tagText, btnText) {
    var feed = document.getElementById('muroFeed');
    if (!feed) return;
    var item = document.createElement('div');
    var tipo = dotColor === '#E24B4A' ? 'urgente' : 'recurso';
    item.className = 'muro-item';
    item.dataset.tipo = tipo;
    item.style.animation = 'coordSlideIn 0.4s ease both';
    item.innerHTML =
        '<div class="muro-dot" style="background:' + dotColor + ';"></div>' +
        '<div class="muro-content">' +
        '<div class="muro-title">' + title + '</div>' +
        '<div class="muro-body">' + (desc || 'Sin descripción adicional.') + '</div>' +
        '<div class="muro-footer">' +
        '<span class="muro-time">Recién validada</span>' +
        '<span class="muro-tag" style="background:' + tagBg + ';color:' + tagColor + ';">' + tagText + '</span>' +
        '<button class="muro-claim-btn" onclick="claimMuro(this)">' + btnText + '</button>' +
        '</div>' +
        '</div>';
    feed.insertBefore(item, feed.firstChild);
    return item;  // ← AÑADIR
}

// ── Añade pin en el mapa de necesidades al validar ──
function _añadirPinMapa(catText, isEmerg) {

    console.log('Añadiendo pin en mapa para:', catText, 'Emergencia:', isEmerg);

    if (!_necMap || !_necMarker) return null;

    var color = '#E24B4A', icono = '🚨';
    if (!isEmerg) {
        if (catText.indexOf('Voluntarios') > -1) { color = '#7B5EA7'; icono = 'V'; }
        else if (catText.indexOf('Punto') > -1) { color = '#EF9F27'; icono = 'P'; }
        else if (catText.indexOf('Refugio') > -1) { color = '#3A7BD5'; icono = 'R'; }
        else if (catText.indexOf('Recogida') > -1) { color = '#1D9E75'; icono = 'K'; }
        else { color = '#1D9E75'; icono = '✓'; }
    }

    // Capturar posición y ocultar/fijar el marker arrastrable original
    var latlng = _necMarker.getLatLng();
    _necMarker.dragging && _necMarker.dragging.disable();
    _necMarker.setOpacity(0);

    // Si es emergencia mostrar icono de alarma pulsante sobre el marker original
    if (isEmerg) {
        _necMarker.setOpacity(1);
        _necMarker.setIcon(_necPulseIcon('#E24B4A'));
        _necMarker.dragging && _necMarker.dragging.disable();
        var ubicVal = (document.getElementById('necUbic') || {}).value || '—';
        _necMarker.setPopupContent(
            '<b>🚨 Emergencia validada</b><br>' +
            '<span style="font-size:11px;color:#E24B4A;font-weight:500;">' + catText + '</span><br>' +
            '<span style="font-size:10px;color:#cfece6;font-weight:500;">' + ubicVal + '</span>'
        );
        _necMarker.openPopup();
        return _necMarker;
    }

    var ubic = (document.getElementById('necUbic') || {}).value || 'Ubicación registrada';
    var newIcon = isEmerg ? _necPulseIcon(color) : _necMakeIcon(color, icono, 30);

    console.log('LatLng para nuevo pin:', latlng, 'Color:', color, 'Icono:', icono, 'Ubicación:', ubic);

    // Crear marker independiente, no draggable
    var pin = L.marker([latlng.lat, latlng.lng], {
        icon: newIcon,
        zIndexOffset: 1000,
        draggable: false,
        interactive: true
    })
        .bindPopup(catText + '<br><small style="color:#555;">' + ubic + '</small>',
            { className: 'k2-popup', maxWidth: 220, minWidth: 140 })
        .addTo(_necMap)
        .openPopup();

    _necMap.setView([latlng.lat, latlng.lng], 16, { animate: true });
    return pin;
}

// ── Actualiza el estado visible en el panel de necesidades ──
function _actualizarEstadoNecesidad(title, desc) {
    // Actualizar badge del necConfirm si está visible
    var conf = document.getElementById('necConfirm');
    if (conf && conf.classList.contains('visible')) {
        var badge = conf.querySelector('.d-badge');
        if (badge) {
            badge.className = 'd-badge d-badge-ok';
            badge.textContent = '✓ Validada';
        }
        // Añadir aviso de validación si no existe
        var yaAviso = document.getElementById('necValidadaMsg');
        if (!yaAviso) {
            var aviso = document.createElement('div');
            aviso.id = 'necValidadaMsg';
            aviso.style.cssText = 'margin-top:10px;font-size:12px;color:#1D6A3A;background:#EAFAF1;border-radius:10px;padding:10px;line-height:1.5;';
            aviso.textContent = '✓ Tu necesidad ha sido validada y publicada en el muro de coordinación.';
            conf.appendChild(aviso);
        }
    }
}

window.cerrarNecesidad = function (cardId, e) {
    if (e) e.stopPropagation();
    var card = document.getElementById(cardId);
    if (!card) return;
    if (!confirm('¿Marcar esta necesidad como cerrada? Ya no estará activa.')) return;

    card.dataset.estado = 'cerrada';
    card.style.opacity = '0.5';
    card.style.pointerEvents = 'none';

    // Badge en triaje
    var meta = card.querySelector('.val-meta');
    if (meta) {
        var badge = document.createElement('span');
        badge.className = 'd-badge';
        badge.style.cssText = 'background:#f0f0f0;color:#999;border:1px solid #ddd;margin-left:4px;';
        badge.textContent = '⏹ Cerrada';
        meta.appendChild(badge);
    }

    // Mensaje en expand
    var doneEl = card.querySelector('.val-done-msg');
    if (doneEl) {
        doneEl.style.cssText = 'display:block;margin-top:8px;padding:8px 10px;background:#f5f5f5;border-radius:8px;font-size:12px;color:#999;';
        doneEl.textContent = '⏹ Necesidad cerrada — ya no está activa.';
    }

    // ── Eliminar del muro de coordinación y pin del mapa ──
    var registro = null;
    for (var i = 0; i < _muroItemsValidados.length; i++) {
        if (_muroItemsValidados[i].cardId === cardId) { registro = _muroItemsValidados[i]; _muroItemsValidados.splice(i, 1); break; }
    }
    if (registro) {
        // Eliminar item del muro con animación
        if (registro.muroEl && registro.muroEl.parentNode) {
            registro.muroEl.style.transition = 'opacity 0.4s, transform 0.4s';
            registro.muroEl.style.opacity = '0';
            registro.muroEl.style.transform = 'translateX(30px)';
            setTimeout(function () { if (registro.muroEl.parentNode) registro.muroEl.parentNode.removeChild(registro.muroEl); }, 420);
        }
        // Eliminar pin del mapa
        if (registro.mapPin && _necMap) {
            _necMap.removeLayer(registro.mapPin);
        }
    }

    // ── Actualizar estado en panel de necesidades ──
    var conf = document.getElementById('necConfirm');
    if (conf && conf.classList.contains('visible')) {
        var confBadge = conf.querySelector('.d-badge');
        if (confBadge) {
            confBadge.className = 'd-badge';
            confBadge.style.cssText = 'background:#f0f0f0;color:#999;border:1px solid #ddd;';
            confBadge.textContent = '⏹ Cancelada';
        }
        var validadaMsg = document.getElementById('necValidadaMsg');
        if (validadaMsg) validadaMsg.remove();
        var yaAviso = document.getElementById('necCanceladaMsg');
        if (!yaAviso) {
            var aviso = document.createElement('div');
            aviso.id = 'necCanceladaMsg';
            aviso.style.cssText = 'margin-top:10px;font-size:12px;color:#922B21;background:#FDEDEC;border-radius:10px;padding:10px;line-height:1.5;';
            aviso.textContent = '⏹ Tu necesidad ha sido cancelada por el coordinador y ya no está activa.';
            conf.appendChild(aviso);
        }
    }

    filtrarVal('todas', document.getElementById('valFiltroTodas'));
};

window.filtrarVal = function (estado, btn) {
    document.querySelectorAll('.val-filter-btn').forEach(function (b) { b.classList.remove('active'); });
    btn.classList.add('active');
    document.querySelectorAll('.val-list .val-card').forEach(function (c) {
        c.style.display = (estado === 'todas' || c.dataset.estado === estado) ? '' : 'none';
    });
    // Actualizar contador "Todas"
    var totalBtn = document.querySelector('.val-filter-btn:first-child');
    if (totalBtn) {
        var total = document.querySelectorAll('.val-card').length;
        var cerradas = document.querySelectorAll('.val-card[data-estado="cerrada"]').length;
        totalBtn.textContent = 'Todas (' + (total - cerradas) + ')';
    }
};

// ── TAB 3 ──
window.filtrarMuro = function (tipo, btn) {
    document.querySelectorAll('.muro-filter-btn').forEach(function (b) { b.classList.remove('active'); });
    btn.classList.add('active');
    document.querySelectorAll('#muroFeed .muro-item').forEach(function (item) {
        item.classList.toggle('hidden', tipo !== 'todas' && item.dataset.tipo !== tipo);
    });
};
window.claimMuro = function (btn) {
    btn.textContent = '✓ Asignado';
    btn.style.cssText += 'background:var(--teal);color:#fff;border:none;cursor:default;';
    btn.disabled = true;
    btn.className = 'muro-claimed';
};

// ── TAB 5 ──

function filtrarTraza(btn) {
    document.querySelectorAll('.traza-filter-btn').forEach(function (b) { b.classList.remove('active'); });
    btn.classList.add('active');
    var f = btn.dataset.filter;
    var visibles = 0;

    document.querySelectorAll('.traza-row').forEach(function (row) {
        var show = false;

        if (row.classList.contains('is-donacion')) {
            // Fila de donación
            show = (f === 'all' || f === 'donacion');
        } else {
            // Fila de kit voluntario
            var id = row.id.replace('traza_', '');
            var inst = kitInstances[id];
            if (!inst) return;
            show = f === 'all'
                || (f === 'cancel' && inst.cancelled)
                || (f === 'donacion' && false)
                || (!inst.cancelled && f === String(inst.phase));
        }

        row.style.display = show ? 'flex' : 'none';
        if (show) visibles++;
    });

    var empty = document.getElementById('trazaEmpty');
    if (empty) empty.style.display = visibles === 0 ? 'block' : 'none';
}
window.toggleTraza = function (id) {
    document.querySelectorAll('.traza-steps').forEach(function (s) {
        if (s.id !== id) s.classList.remove('open');
    });
    var el = document.getElementById(id);
    if (el) el.classList.toggle('open');
};
window.confirmarEntrega = function (cardId, btnId, tlItemId) {
    var btn = document.getElementById(btnId);
    var tlItem = document.getElementById(tlItemId);
    var card = document.getElementById(cardId);
    if (btn) { btn.textContent = 'Confirmando...'; btn.disabled = true; }
    setTimeout(function () {
        if (tlItem) {
            tlItem.style.opacity = '1';
            var dot = tlItem.querySelector('.traza-tl-dot');
            var label = tlItem.querySelector('.traza-tl-label');
            var meta = tlItem.querySelector('.traza-tl-meta');
            if (dot) { dot.style.background = '#1D9E75'; dot.style.color = '#1D9E75'; }
            if (label) { label.textContent = '✓ Entrega confirmada'; label.style.color = '#1D9E75'; }
            if (meta) { meta.textContent = 'Ahora · Receptor confirmado'; }
        }
        var statusEl = card ? card.querySelector('.traza-status-badge') : null;
        if (statusEl) { statusEl.style.background = '#EAFAF1'; statusEl.style.color = '#1D6A3A'; statusEl.textContent = '✓ Entregado'; }
        if (btn) { btn.textContent = '✓ Entrega registrada'; btn.style.background = '#085041'; }
    }, 600);
};


document.addEventListener('DOMContentLoaded', function () {
    if (typeof renderKitItems2 === 'function') renderKitItems2('food');
    // Initialize emergency category state (it's active by default)
    var emergChip = document.querySelector('#necCatChips .chip-emergency');
    if (emergChip && emergChip.classList.contains('active')) {
        window.selectCat(emergChip, 'necCatChips');
    }
    // Init campo visibilidad
    if (typeof _necUpdateFields === 'function') _necUpdateFields();
});


