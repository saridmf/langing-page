const header = document.getElementById('header');
const menuToggle = document.getElementById('menuToggle');
const mobileMenu = document.getElementById('mobileMenu');
const scrollTopButton = document.getElementById('scrollTop');
const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

const products = {
  cinta: {
    name: 'Cinta métrica de fibra de vidrio',
    category: 'Medición manual',
    image: './Assets/item-1.jpeg',
    alt: 'Cinta métrica de fibra de vidrio',
    lead: 'Una herramienta resistente y práctica para distancias largas, diseñada para el uso continuo en obra y trabajo de campo.',
    uses: ['Levantamientos preliminares', 'Medición de terrenos y obra civil', 'Control de distancias en campo'],
    features: ['Fibra de vidrio flexible y durable', 'Carrete cerrado para transporte seguro', 'Lectura clara y fácil manipulación'],
    related: ['t3', 'gnss']
  },
  t3: {
    name: 'Estación Total Precise T3',
    category: 'Estación total',
    image: './Assets/item-2.jpeg',
    alt: 'Estación Total Precise T3 con accesorios',
    lead: 'Una configuración completa para profesionales que necesitan agilidad, precisión y control en levantamientos topográficos.',
    uses: ['Levantamientos planimétricos', 'Replanteo de obra', 'Medición de ángulos y distancias'],
    features: ['Estación Total Precise T3', 'Trípode de trabajo', 'Prisma y bastón incluidos'],
    related: ['gnss', 'cinta']
  },
  gnss: {
    name: 'Precise X GNSS',
    category: 'Sistema GNSS',
    image: './Assets/item-3.jpeg',
    alt: 'Sistema de receptores Precise X GNSS',
    lead: 'Sistema base y rover para posicionamiento de alta precisión, pensado para proyectos que demandan productividad y cobertura.',
    uses: ['Georreferenciación', 'Levantamientos de alta precisión', 'Control y replanteo de proyectos'],
    features: ['Receptor base y receptor rover', 'Trípode para estación base', 'Configuración profesional de campo'],
    related: ['t3', 'cinta']
  }
};

function closeMenu() {
  if (!menuToggle || !mobileMenu) return;
  menuToggle.classList.remove('is-active');
  menuToggle.setAttribute('aria-expanded', 'false');
  menuToggle.setAttribute('aria-label', 'Abrir menú');
  mobileMenu.classList.remove('is-open');
  mobileMenu.setAttribute('aria-hidden', 'true');
  document.body.classList.remove('menu-open');
}

if (menuToggle && mobileMenu) {
  menuToggle.addEventListener('click', () => {
    const open = !mobileMenu.classList.contains('is-open');
    menuToggle.classList.toggle('is-active', open);
    menuToggle.setAttribute('aria-expanded', String(open));
    menuToggle.setAttribute('aria-label', open ? 'Cerrar menú' : 'Abrir menú');
    mobileMenu.classList.toggle('is-open', open);
    mobileMenu.setAttribute('aria-hidden', String(!open));
    document.body.classList.toggle('menu-open', open);
  });

  mobileMenu.querySelectorAll('a').forEach((link) => link.addEventListener('click', closeMenu));
  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape') closeMenu();
  });
}

function updateScrollUi() {
  const scrolled = window.scrollY > 24;
  header?.classList.toggle('is-scrolled', scrolled);
  scrollTopButton?.classList.toggle('is-visible', window.scrollY > 650);

  if (!reduceMotion) {
    const parallaxImage = document.querySelector('[data-parallax] img');
    if (parallaxImage && window.scrollY < window.innerHeight * 1.2) {
      parallaxImage.style.setProperty('--parallax', `${Math.min(window.scrollY * 0.11, 72)}px`);
    }
  }
}

let scrollFrame;
window.addEventListener('scroll', () => {
  if (scrollFrame) return;
  scrollFrame = requestAnimationFrame(() => {
    updateScrollUi();
    scrollFrame = null;
  });
}, { passive: true });

scrollTopButton?.addEventListener('click', () => window.scrollTo({ top: 0, behavior: reduceMotion ? 'auto' : 'smooth' }));

const revealElements = document.querySelectorAll('.reveal');
if (reduceMotion || !('IntersectionObserver' in window)) {
  revealElements.forEach((element) => element.classList.add('is-visible'));
} else {
  const revealObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      entry.target.classList.add('is-visible');
      observer.unobserve(entry.target);
    });
  }, { threshold: 0.14, rootMargin: '0px 0px -40px' });
  revealElements.forEach((element) => revealObserver.observe(element));
}

const observedSections = document.querySelectorAll('main section[id], footer[id]');
const navLinks = document.querySelectorAll('.nav__link');
if ('IntersectionObserver' in window) {
  const sectionObserver = new IntersectionObserver((entries) => {
    const visibleEntry = entries
      .filter((entry) => entry.isIntersecting)
      .sort((first, second) => second.intersectionRatio - first.intersectionRatio)[0];
    if (!visibleEntry) return;
    navLinks.forEach((link) => link.classList.toggle('is-active', link.getAttribute('href') === `#${visibleEntry.target.id}`));
  }, { rootMargin: '-25% 0px -60%', threshold: [0.05, 0.2, 0.5] });
  observedSections.forEach((section) => sectionObserver.observe(section));
}

const tabButtons = [...document.querySelectorAll('.technical__tab')];
const tabPanels = [...document.querySelectorAll('.technical__panel')];

function activateTab(button) {
  const tabName = button.dataset.tab;
  tabButtons.forEach((tab) => {
    const active = tab === button;
    tab.classList.toggle('is-active', active);
    tab.setAttribute('aria-selected', String(active));
    tab.tabIndex = active ? 0 : -1;
  });
  tabPanels.forEach((panel) => {
    const active = panel.id === `tab-${tabName}`;
    panel.classList.toggle('is-active', active);
    panel.hidden = !active;
  });
}

tabButtons.forEach((button, index) => {
  button.tabIndex = button.classList.contains('is-active') ? 0 : -1;
  button.addEventListener('click', () => activateTab(button));
  button.addEventListener('keydown', (event) => {
    if (!['ArrowRight', 'ArrowLeft', 'ArrowDown', 'ArrowUp', 'Home', 'End'].includes(event.key)) return;
    event.preventDefault();
    let nextIndex = index;
    if (event.key === 'ArrowRight' || event.key === 'ArrowDown') nextIndex = (index + 1) % tabButtons.length;
    if (event.key === 'ArrowLeft' || event.key === 'ArrowUp') nextIndex = (index - 1 + tabButtons.length) % tabButtons.length;
    if (event.key === 'Home') nextIndex = 0;
    if (event.key === 'End') nextIndex = tabButtons.length - 1;
    tabButtons[nextIndex].focus();
    activateTab(tabButtons[nextIndex]);
  });
});

const modal = document.getElementById('productModal');
const modalClose = document.getElementById('productModalClose');
const modalSecondaryClose = document.getElementById('productModalSecondaryClose');
const modalImage = document.getElementById('productModalImage');
const modalCategory = document.getElementById('productModalCategory');
const modalTitle = document.getElementById('productModalTitle');
const modalLead = document.getElementById('productModalLead');
const modalUses = document.getElementById('productModalUses');
const modalFeatures = document.getElementById('productModalFeatures');
const modalCta = document.getElementById('productModalCta');
const relatedProducts = document.getElementById('relatedProducts');
let lastProductTrigger = null;

function createList(items) {
  return items.map((item) => `<li>${item}</li>`).join('');
}

function openProduct(productId, trigger = null) {
  const product = products[productId];
  if (!product || !modal) return;
  lastProductTrigger = trigger || lastProductTrigger;
  modalImage.src = product.image;
  modalImage.alt = product.alt;
  modalCategory.textContent = product.category;
  modalTitle.textContent = product.name;
  modalLead.textContent = product.lead;
  modalUses.innerHTML = createList(product.uses);
  modalFeatures.innerHTML = createList(product.features);
  modalCta.href = `https://wa.me/50576104551?text=${encodeURIComponent(`Hola, deseo cotizar: ${product.name}`)}`;
  relatedProducts.innerHTML = product.related.map((relatedId) => `<button type="button" data-related-product="${relatedId}">${products[relatedId].name}</button>`).join('');
  relatedProducts.querySelectorAll('[data-related-product]').forEach((button) => {
    button.addEventListener('click', () => {
      openProduct(button.dataset.relatedProduct);
      modal.scrollTo({ top: 0, behavior: reduceMotion ? 'auto' : 'smooth' });
    });
  });
  if (!modal.open) modal.showModal();
  document.body.classList.add('modal-open');
}

function closeProduct() {
  if (!modal?.open) return;
  modal.close();
  document.body.classList.remove('modal-open');
  lastProductTrigger?.focus();
}

document.querySelectorAll('[data-product]').forEach((button) => {
  button.addEventListener('click', () => openProduct(button.dataset.product, button));
});
modalClose?.addEventListener('click', closeProduct);
modalSecondaryClose?.addEventListener('click', closeProduct);
modal?.addEventListener('click', (event) => {
  const bounds = modal.getBoundingClientRect();
  const outside = event.clientX < bounds.left || event.clientX > bounds.right || event.clientY < bounds.top || event.clientY > bounds.bottom;
  if (outside) closeProduct();
});
modal?.addEventListener('close', () => document.body.classList.remove('modal-open'));

const contactForm = document.getElementById('contactForm');
const formStatus = document.getElementById('formStatus');
contactForm?.addEventListener('submit', (event) => {
  event.preventDefault();
  const formData = new FormData(contactForm);
  const message = [
    'Hola, deseo realizar una consulta desde el sitio web.',
    `Nombre: ${formData.get('name')}`,
    `Teléfono: ${formData.get('phone')}`,
    `Correo: ${formData.get('email')}`,
    `Consulta: ${formData.get('message')}`
  ].join('\n');
  formStatus.textContent = 'Abriendo WhatsApp con tu consulta preparada…';
  window.open(`https://wa.me/50576104551?text=${encodeURIComponent(message)}`, '_blank', 'noopener,noreferrer');
});

if (window.L && document.getElementById('map')) {
  const coordinates = [12.126566766047224, -86.26055362045605];
  const map = L.map('map', { scrollWheelZoom: false, zoomControl: false }).setView(coordinates, 16);
  L.control.zoom({ position: 'bottomright' }).addTo(map);
  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
  }).addTo(map);
  const icon = L.divIcon({
    className: '',
    html: '<div class="map-pin"><span>LT</span></div>',
    iconSize: [44, 44],
    iconAnchor: [22, 44],
    popupAnchor: [0, -46]
  });
  L.marker(coordinates, { icon })
    .addTo(map)
    .bindPopup('<strong>La Casa del Topógrafo</strong><br>Monte Los Olivos, Managua.');
}

updateScrollUi();
