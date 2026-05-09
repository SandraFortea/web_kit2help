
// ── MARKER DATA ──
var MARKERS = [
    { lat: 39.4699, lng: -0.3763, type: 'necesidades', icon: '🚨', color: '#E24B4A', popup: '<b>🚨 Emergencia</b><br>Placa de lAjuntament<br><span style="color:#E24B4A">Prioridad: Alta</span>' },
    { lat: 39.4617, lng: -0.3854, type: 'necesidades', icon: '🚨', color: '#E24B4A', popup: '<b>🚨 Emergencia</b><br>Barrio de Ruzafa<br><span style="color:#E24B4A">Prioridad: Alta</span>' },
    { lat: 39.4780, lng: -0.3680, type: 'necesidades', icon: '🚨', color: '#E24B4A', popup: '<b>🚨 Emergencia</b><br>Benimaclet<br><span style="color:#E24B4A">Prioridad: Alta</span>' },
    { lat: 39.4560, lng: -0.3900, type: 'necesidades', icon: '🚨', color: '#E24B4A', popup: '<b>🚨 Emergencia</b><br>Barrio de Orriols<br><span style="color:#E24B4A">Prioridad: Alta</span>' },
    { lat: 39.4720, lng: -0.3820, type: 'kits', icon: 'K', color: '#1D9E75', popup: '<b>📦 Recogida de kits</b><br>Polideportivo Russafa<br>Abierto: 8:00-20:00' },
    { lat: 39.4650, lng: -0.3700, type: 'kits', icon: 'K', color: '#1D9E75', popup: '<b>📦 Recogida de kits</b><br>C/ Xativa, 10<br>Abierto: 9:00-18:00' },
    { lat: 39.4800, lng: -0.3750, type: 'kits', icon: 'K', color: '#1D9E75', popup: '<b>📦 Recogida de kits</b><br>Avda. del Cid, 5<br>Abierto: 8:00-20:00' },
    { lat: 39.4690, lng: -0.3780, type: 'voluntarios', icon: 'V', color: '#7B5EA7', popup: '<b>🤝 Voluntarios</b><br>Plaza del Ayuntamiento<br>20 voluntarios activos · Resp.: Miguel R.' },
    { lat: 39.4740, lng: -0.3640, type: 'voluntarios', icon: 'V', color: '#7B5EA7', popup: '<b>🤝 Voluntarios</b><br>Campus Blasco Ibáñez<br>12 voluntarios activos' },
    { lat: 39.4580, lng: -0.3820, type: 'voluntarios', icon: 'V', color: '#7B5EA7', popup: '<b>🤝 Voluntarios</b><br>Mercado Central<br>8 voluntarios activos' },
    { lat: 39.4705, lng: -0.3800, type: 'puntos', icon: 'P', color: '#EF9F27', popup: '<b>📍 Punto de encuentro</b><br>Plaza del Ayuntamiento<br>Resp.: Elena M. · Capacidad 150' },
    { lat: 39.4630, lng: -0.3730, type: 'puntos', icon: 'R', color: '#3A7BD5', popup: '<b>🏠 Refugio / Hospedaje</b><br>C/ Colón, 40<br>30 plazas · Resp.: Ana G.' },
    { lat: 39.4760, lng: -0.3860, type: 'puntos', icon: 'P', color: '#EF9F27', popup: '<b>📍 Punto de encuentro</b><br>IES Benlliure<br>Capacidad 80 personas' }
];

function makeIcon(color, icon, size) {
    var s = size || 30;
    var fs = Math.round(s * 0.42);
    return L.divIcon({
        className: '',
        html: '<div style="width:' + s + 'px;height:' + s + 'px;border-radius:50%;background:' + color + ';display:flex;align-items:center;justify-content:center;font-size:' + fs + 'px;font-weight:700;color:#fff;box-shadow:0 3px 10px rgba(0,0,0,0.35);border:2px solid rgba(255,255,255,0.35);">' + icon + '</div>',
        iconSize: [s, s],
        iconAnchor: [s / 2, s / 2],
        popupAnchor: [0, -(s / 2 + 4)]
    });
}

var layerState = { necesidades: true, kits: true, voluntarios: true, puntos: true };
var mainMap = null, modalMap = null;
var mainLayers = {}, modalLayers = {};

function buildLayers(map, layers, iconSize) {
    ['necesidades', 'kits', 'voluntarios', 'puntos'].forEach(function (type) {
        layers[type] = L.layerGroup();
        MARKERS.filter(function (m) { return m.type === type; }).forEach(function (m) {
            L.marker([m.lat, m.lng], { icon: makeIcon(m.color, m.icon, iconSize) })
                .bindPopup(m.popup, { className: 'k2-popup', maxWidth: 220 })
                .addTo(layers[type]);
        });
        if (layerState[type]) layers[type].addTo(map);
    });
}

function initMainMap() {
    if (mainMap) return;
    mainMap = L.map('mainMap', {
        zoomControl: true,
        attributionControl: true,
        scrollWheelZoom: false
    }).setView([39.4699, -0.3763], 14);

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        maxZoom: 19,
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
    }).addTo(mainMap);

    buildLayers(mainMap, mainLayers, 30);

    // Fix Leaflet marker images path (needed in some CDN contexts)
    delete L.Icon.Default.prototype._getIconUrl;
    L.Icon.Default.mergeOptions({
        iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
        iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
        shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png'
    });
}

function initModalMap() {
    if (modalMap) {
        setTimeout(function () { modalMap.invalidateSize(); }, 60);
        return;
    }
    modalMap = L.map('modalMap', {
        zoomControl: true,
        attributionControl: true,
        scrollWheelZoom: true
    }).setView([39.4699, -0.3763], 14);

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        maxZoom: 19,
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
    }).addTo(modalMap);

    buildLayers(modalMap, modalLayers, 34);

    setTimeout(function () { modalMap.invalidateSize(); }, 100);
}

window.toggleLayer = function (btn) {
    var layer = btn.dataset.layer;
    var isActive = btn.classList.toggle('active');
    layerState[layer] = isActive;

    // Sync all buttons with same data-layer
    document.querySelectorAll('[data-layer="' + layer + '"]').forEach(function (b) {
        b.classList.toggle('active', isActive);
    });

    [{ map: mainMap, layers: mainLayers }, { map: modalMap, layers: modalLayers }].forEach(function (pair) {
        if (!pair.map || !pair.layers[layer]) return;
        if (isActive) pair.layers[layer].addTo(pair.map);
        else pair.map.removeLayer(pair.layers[layer]);
    });
};

window.abrirMapaCompleto = function () {
    var m = document.getElementById('mapaModal');
    m.style.display = 'flex';
    document.body.style.overflow = 'hidden';
    setTimeout(initModalMap, 120);
};

window.cerrarMapaCompleto = function () {
    document.getElementById('mapaModal').style.display = 'none';
    document.body.style.overflow = '';
};

document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape') window.cerrarMapaCompleto();
});

var mapaModal = document.getElementById('mapaModal');
if (mapaModal) {
    mapaModal.addEventListener('click', function (e) {
        if (e.target === mapaModal) window.cerrarMapaCompleto();
    });
}

// Init main map on visibility
var mapEl = document.getElementById('mainMap');
if (mapEl) {
    if ('IntersectionObserver' in window) {
        var obs = new IntersectionObserver(function (entries) {
            entries.forEach(function (e) {
                if (e.isIntersecting) { initMainMap(); obs.disconnect(); }
            });
        }, { threshold: 0.1 });
        obs.observe(mapEl);
    } else {
        initMainMap();
    }
}

