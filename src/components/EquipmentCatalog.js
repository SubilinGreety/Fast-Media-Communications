import { equipmentData, equipmentCategories } from '../data/equipment.js';

export function initEquipmentCatalog() {
  const container = document.getElementById('equipment-catalog-root');
  if (!container) return;

  let activeCategory = 'all';
  let searchQuery = '';

  // Render Catalog HTML Skeleton
  container.innerHTML = `
    <div class="catalog-toolbar">
      <div class="catalog-search-row">
        <div class="search-input-wrapper">
          <svg class="search-icon" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <circle cx="11" cy="11" r="8"></circle>
            <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
          </svg>
          <input type="text" class="search-input" id="gear-search-input" placeholder="Search Sony HDC-3200, Canon 111X, Zeiss CP3, Switchers..." autocomplete="off">
        </div>
        <div class="gear-count-badge" id="gear-count-display">
          Showing ${equipmentData.length} Equipment Units
        </div>
      </div>

      <!-- Category Filter Pills -->
      <div class="category-pills-row" id="catalog-category-pills">
        ${equipmentCategories.map(cat => `
          <button class="category-pill ${cat.id === 'all' ? 'active' : ''}" data-category="${cat.id}">
            ${cat.label}
          </button>
        `).join('')}
      </div>
    </div>

    <!-- Equipment Cards Grid -->
    <div class="equipment-grid" id="equipment-grid-items"></div>

    <!-- Spec Details Modal Popup -->
    <div class="modal-backdrop" id="gear-spec-modal">
      <div class="modal-dialog" id="gear-spec-dialog">
        <button class="modal-close-btn" id="btn-close-spec-modal">&times;</button>
        <div id="spec-modal-content"></div>
      </div>
    </div>
  `;

  const gridContainer = document.getElementById('equipment-grid-items');
  const searchInput = document.getElementById('gear-search-input');
  const countBadge = document.getElementById('gear-count-display');
  const specModal = document.getElementById('gear-spec-modal');
  const specModalContent = document.getElementById('spec-modal-content');
  const btnCloseModal = document.getElementById('btn-close-spec-modal');

  // Filter function
  function renderFilteredEquipment() {
    const filtered = equipmentData.filter(item => {
      const matchCat = activeCategory === 'all' || item.category === activeCategory;
      const query = searchQuery.toLowerCase().trim();
      const matchSearch = !query || 
        item.name.toLowerCase().includes(query) ||
        item.highlight.toLowerCase().includes(query) ||
        item.sensor.toLowerCase().includes(query) ||
        item.popularFor.toLowerCase().includes(query);
      return matchCat && matchSearch;
    });

    countBadge.textContent = `Showing ${filtered.length} of ${equipmentData.length} Units`;

    if (filtered.length === 0) {
      gridContainer.innerHTML = `
        <div style="grid-column: 1 / -1; text-align: center; padding: 60px 20px;" class="glass-card">
          <div style="font-size: 2.5rem; margin-bottom: 12px;">🔍</div>
          <h3 style="font-size: 1.3rem; margin-bottom: 8px;">No broadcast equipment matched "${searchQuery}"</h3>
          <p style="color: var(--text-muted); margin-bottom: 20px;">Try searching for "Sony", "Canon", "Lens", "Intercom", or "Switchers".</p>
          <button class="btn btn-outline-red" id="btn-clear-search">Reset Filter</button>
        </div>
      `;
      const btnClear = document.getElementById('btn-clear-search');
      if (btnClear) {
        btnClear.addEventListener('click', () => {
          searchQuery = '';
          searchInput.value = '';
          activeCategory = 'all';
          updatePills();
          renderFilteredEquipment();
        });
      }
      return;
    }

    gridContainer.innerHTML = filtered.map(item => `
      <div class="glass-card equipment-card" data-gear-id="${item.id}">
        <div class="gear-image-box">
          <img src="${item.image}" alt="${item.name}" loading="lazy" 
               onerror="this.onerror=null; this.src='https://fastmediacommunications.com/wp-content/uploads/2025/01/Layer-3.png'">
          <span class="gear-tag-pill">${item.tag}</span>
        </div>
        <div class="gear-body">
          <span class="gear-category-name">${item.categoryLabel}</span>
          <h3 class="gear-title">${item.name}</h3>
          <p class="gear-highlight">${item.highlight}</p>
          
          <div class="gear-specs-chips">
            <div class="spec-chip">
              <span class="spec-key">Mount / Standard:</span>
              <span class="spec-val">${item.mount}</span>
            </div>
            <div class="spec-chip">
              <span class="spec-key">Resolution / Class:</span>
              <span class="spec-val">${item.resolution.split('/')[0]}</span>
            </div>
          </div>

          <div class="gear-card-actions">
            <button class="btn btn-secondary btn-view-specs" data-id="${item.id}">
              Specs Sheet
            </button>
            <button class="btn btn-primary btn-add-quote" data-id="${item.id}" data-name="${item.name}">
              Add to Quote
            </button>
          </div>
        </div>
      </div>
    `).join('');

    // Attach Spec Sheet Modal click listeners
    gridContainer.querySelectorAll('.btn-view-specs').forEach(btn => {
      btn.addEventListener('click', () => {
        const id = btn.getAttribute('data-id');
        openSpecModal(id);
      });
    });

    // Attach Add to Quote listeners
    gridContainer.querySelectorAll('.btn-add-quote').forEach(btn => {
      btn.addEventListener('click', () => {
        const gearName = btn.getAttribute('data-name');
        const quoteSection = document.getElementById('quote-builder');
        if (quoteSection) {
          quoteSection.scrollIntoView({ behavior: 'smooth' });
          // Dispatch custom event to prefill quote
          window.dispatchEvent(new CustomEvent('fmc:add-gear-to-quote', { detail: { name: gearName } }));
        }
      });
    });
  }

  // Update Category Pills UI
  function updatePills() {
    container.querySelectorAll('.category-pill').forEach(pill => {
      pill.classList.toggle('active', pill.getAttribute('data-category') === activeCategory);
    });
  }

  // Open Detailed Specs Modal
  function openSpecModal(gearId) {
    const item = equipmentData.find(g => g.id === gearId);
    if (!item) return;

    specModalContent.innerHTML = `
      <div style="display: flex; gap: 24px; margin-bottom: 24px; align-items: center; flex-wrap: wrap;">
        <div style="width: 140px; height: 140px; background: #000; border-radius: 12px; display: flex; align-items: center; justify-content: center; padding: 10px; border: 1px solid var(--border-glass);">
          <img src="${item.image}" alt="${item.name}" style="max-height: 100%; object-fit: contain;">
        </div>
        <div style="flex: 1; min-width: 240px;">
          <span class="section-badge" style="margin-bottom: 8px;">${item.categoryLabel} // ${item.tag}</span>
          <h2 style="font-size: 1.5rem; margin-bottom: 8px; color: #fff;">${item.name}</h2>
          <p style="font-size: 0.95rem; color: var(--text-secondary);">${item.highlight}</p>
        </div>
      </div>

      <div style="background: var(--bg-surface-elevated); border: 1px solid var(--border-subtle); border-radius: var(--radius-md); padding: 20px; margin-bottom: 24px;">
        <h4 style="font-size: 1rem; color: #fff; margin-bottom: 14px; display: flex; align-items: center; gap: 8px;">
          <span style="color: var(--accent-gold);">⚡</span> Technical Specifications
        </h4>
        <ul style="list-style: none; display: flex; flex-direction: column; gap: 10px;">
          ${item.specs.map(s => `
            <li style="font-size: 13px; font-family: var(--font-mono); color: #cbd5e1; display: flex; align-items: baseline; gap: 8px;">
              <span style="color: var(--accent-red); font-size: 10px;">▶</span> ${s}
            </li>
          `).join('')}
        </ul>
      </div>

      <div style="display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 16px; padding-top: 16px; border-top: 1px solid var(--border-subtle);">
        <div>
          <span style="font-size: 11px; font-family: var(--font-mono); color: var(--text-muted); display: block;">RECOMMENDED APPLICATIONS</span>
          <strong style="color: var(--accent-gold); font-size: 13px;">${item.popularFor}</strong>
        </div>
        <div style="display: flex; gap: 10px;">
          <a href="https://wa.me/919444089654?text=${encodeURIComponent(`Hello Fast Media Communications, I would like to check rental availability for: ${item.name}`)}" 
             target="_blank" class="btn btn-whatsapp">
            Check Availability on WhatsApp
          </a>
        </div>
      </div>
    `;

    specModal.classList.add('active');
  }

  // Close Modal
  function closeModal() {
    specModal.classList.remove('active');
  }

  if (btnCloseModal) btnCloseModal.addEventListener('click', closeModal);
  specModal.addEventListener('click', (e) => {
    if (e.target === specModal) closeModal();
  });

  // Search input handler with debounce
  searchInput.addEventListener('input', (e) => {
    searchQuery = e.target.value;
    renderFilteredEquipment();
  });

  // Category pills click handler
  container.querySelectorAll('.category-pill').forEach(pill => {
    pill.addEventListener('click', () => {
      activeCategory = pill.getAttribute('data-category');
      updatePills();
      renderFilteredEquipment();
    });
  });

  // Initial render
  renderFilteredEquipment();
}
