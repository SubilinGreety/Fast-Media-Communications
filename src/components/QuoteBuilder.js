import confetti from 'canvas-confetti';

export function initQuoteBuilder() {
  const container = document.getElementById('quote-builder-root');
  if (!container) return;

  // Pricing & Configuration Rules
  const productionTypes = [
    { id: 'concert', label: 'Audio Launch & Concert', icon: '🎤', baseMultiplier: 1.2 },
    { id: 'tv-serial', label: 'TV Serial / Fiction', icon: '🎬', baseMultiplier: 1.0 },
    { id: 'sports', label: 'Sports & Esports', icon: '🏆', baseMultiplier: 1.35 },
    { id: 'wedding', label: '4K Luxury Wedding', icon: '💍', baseMultiplier: 1.15 },
    { id: 'corporate', label: 'Corporate Summit', icon: '🏢', baseMultiplier: 1.1 }
  ];

  const cameraTiers = [
    { id: 'single-cine', label: 'Single Cine Cam (FX9 / F5)', cams: '1 Camera', cost: 18000, desc: 'Ideal for commercials, interviews & cinematic B-roll' },
    { id: 'multi-4', label: '4-Cam Multicam Setup', cams: '4 Cameras (Sony HDC)', cost: 65000, desc: 'Standard broadcast chain with switcher & CCU' },
    { id: 'ob-8', label: '8-Cam OB Van Package', cams: '8 Cameras (Sony 4K HDC)', cost: 125000, desc: 'Full broadcast truck setup with telephoto box lenses' },
    { id: 'stadium-12', label: '12+ Cam Stadium Rig', cams: '12 Cameras (Sony 4K)', cost: 195000, desc: 'Massive arena live telecast, jimmy jib & wireless roamers' }
  ];

  const lensAddons = [
    { id: 'canon-111x', label: 'Canon 111X Box Lens', cost: 25000 },
    { id: 'canon-90x', label: 'Canon 90X Box Lens', cost: 20000 },
    { id: 'zeiss-cp3', label: 'Zeiss CP3 5-Lens Set', cost: 16000 },
    { id: 'angenieux-zoom', label: 'Angenieux 25-250 HR Zoom', cost: 18000 }
  ];

  const hardwareAddons = [
    { id: 'rts-intercom', label: 'RTS ODIN Matrix Intercom (16-Port)', cost: 12000 },
    { id: 'hollyland-c1', label: 'Hollyland Solidcom Wireless (8-Pack)', cost: 8000 },
    { id: 'sony-pvm-24', label: 'Sony PVM-X2400 4K HDR Monitor', cost: 10000 },
    { id: 'cartoni-ped', label: 'Cartoni Heavy Duty Pedestal / Tripod', cost: 7000 }
  ];

  const durationOptions = [
    { id: '1-day', label: '1 Day Shoot', days: 1, discount: 1.0 },
    { id: '3-days', label: '3 Days Multi-Day', days: 3, discount: 0.9 },
    { id: '7-days', label: '1 Week Production', days: 7, discount: 0.8 },
    { id: 'monthly', label: 'Monthly Serial Contract', days: 26, discount: 0.65 }
  ];

  const cityHubs = [
    { id: 'chennai', label: 'Chennai (HQ Hub)' },
    { id: 'mumbai', label: 'Mumbai (West Hub)' },
    { id: 'bangalore', label: 'Bangalore (Karnataka Hub)' },
    { id: 'hyderabad', label: 'Hyderabad (Telangana Hub)' },
    { id: 'kochi', label: 'Kochi & Trivandrum (Kerala Hub)' }
  ];

  // Current State
  let state = {
    prodType: 'concert',
    cameraTier: 'multi-4',
    selectedLenses: ['canon-111x'],
    selectedHardware: ['rts-intercom', 'sony-pvm-24'],
    duration: '1-day',
    city: 'chennai',
    customNotes: ''
  };

  // Listen for external gear adds
  window.addEventListener('fmc:add-gear-to-quote', (e) => {
    if (e.detail && e.detail.name) {
      state.customNotes += (state.customNotes ? ', ' : '') + e.detail.name;
      const notesInput = document.getElementById('quote-custom-notes');
      if (notesInput) notesInput.value = state.customNotes;
      updateSummary();
    }
  });

  // Render HTML Structure
  container.innerHTML = `
    <div class="quote-builder-box">
      <div class="builder-grid">
        <!-- Left: Configuration Selectors -->
        <div class="builder-options-pane">
          <!-- Step 1: Production Type -->
          <div>
            <div class="option-group-title">
              <span style="color: var(--accent-red);">1.</span> Select Event / Production Type
            </div>
            <div class="selectable-cards-row" id="prod-types-row">
              ${productionTypes.map(p => `
                <div class="selectable-card ${p.id === state.prodType ? 'selected' : ''}" data-type="prod" data-val="${p.id}">
                  <span class="card-icon">${p.icon}</span>
                  <div class="card-label">${p.label}</div>
                </div>
              `).join('')}
            </div>
          </div>

          <!-- Step 2: Camera Setup Scale -->
          <div>
            <div class="option-group-title">
              <span style="color: var(--accent-red);">2.</span> Choose Camera Rig Scale
            </div>
            <div class="selectable-cards-row" id="camera-tiers-row">
              ${cameraTiers.map(c => `
                <div class="selectable-card ${c.id === state.cameraTier ? 'selected' : ''}" data-type="cam" data-val="${c.id}">
                  <div class="card-label">${c.label}</div>
                  <div class="card-desc">${c.cams}</div>
                </div>
              `).join('')}
            </div>
          </div>

          <!-- Step 3: Optics & Specialty Lenses -->
          <div>
            <div class="option-group-title">
              <span style="color: var(--accent-red);">3.</span> High-End Optics & Lenses (Optional)
            </div>
            <div class="selectable-cards-row" id="lenses-addons-row">
              ${lensAddons.map(l => `
                <div class="selectable-card ${state.selectedLenses.includes(l.id) ? 'selected' : ''}" data-type="lens" data-val="${l.id}">
                  <div class="card-label">${l.label}</div>
                  <div class="card-desc" style="color: var(--accent-gold);">+₹${l.cost.toLocaleString('en-IN')}/day</div>
                </div>
              `).join('')}
            </div>
          </div>

          <!-- Step 4: Vision Mixers, Intercom & Monitoring -->
          <div>
            <div class="option-group-title">
              <span style="color: var(--accent-red);">4.</span> Intercom, Monitoring & Support
            </div>
            <div class="selectable-cards-row" id="hardware-addons-row">
              ${hardwareAddons.map(h => `
                <div class="selectable-card ${state.selectedHardware.includes(h.id) ? 'selected' : ''}" data-type="hardware" data-val="${h.id}">
                  <div class="card-label">${h.label}</div>
                  <div class="card-desc" style="color: var(--accent-gold);">+₹${h.cost.toLocaleString('en-IN')}/day</div>
                </div>
              `).join('')}
            </div>
          </div>

          <!-- Step 5: Shoot Duration & City Hub -->
          <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 16px;">
            <div>
              <div class="option-group-title" style="font-size: 0.95rem;">
                <span style="color: var(--accent-red);">5.</span> Shoot Duration
              </div>
              <select class="form-control" id="select-duration">
                ${durationOptions.map(d => `
                  <option value="${d.id}" ${d.id === state.duration ? 'selected' : ''}>${d.label}</option>
                `).join('')}
              </select>
            </div>
            <div>
              <div class="option-group-title" style="font-size: 0.95rem;">
                <span style="color: var(--accent-red);">6.</span> Dispatch City Hub
              </div>
              <select class="form-control" id="select-city">
                ${cityHubs.map(city => `
                  <option value="${city.id}" ${city.id === state.city ? 'selected' : ''}>${city.label}</option>
                `).join('')}
              </select>
            </div>
          </div>

          <!-- Custom Gear Note -->
          <div>
            <label class="form-label" style="font-size: 12px; color: var(--text-muted);">Additional Custom Equipment / Crew Requirements:</label>
            <input type="text" class="form-control" id="quote-custom-notes" placeholder="e.g. 40ft Jimmy Jib, Drone operator, Wireless video link..." value="${state.customNotes}">
          </div>
        </div>

        <!-- Right: Real-time Estimated Package Breakdown -->
        <div class="quote-summary-card" id="quote-summary-pane">
          <div class="summary-header">
            <div>
              <span class="section-badge" style="margin-bottom: 4px;">FAST ESTIMATOR</span>
              <h3 class="summary-title" style="color: #fff;">Package Estimate</h3>
            </div>
            <span style="font-family: var(--font-mono); font-size: 11px; color: var(--accent-green);">● ACTIVE 2026 RATES</span>
          </div>

          <div class="summary-list" id="quote-breakdown-list">
            <!-- Dynamic rows injected here -->
          </div>

          <div style="padding: 16px 0; border-top: 1px solid var(--border-subtle); border-bottom: 1px solid var(--border-subtle); margin-bottom: 24px;">
            <div style="display: flex; align-items: baseline; justify-content: space-between;">
              <span style="font-size: 14px; font-weight: 600; color: #fff;">Estimated Package:</span>
              <div style="text-align: right;">
                <div style="font-family: var(--font-display); font-size: 1.8rem; font-weight: 800; color: var(--accent-gold);" id="quote-total-price">
                  ₹--
                </div>
                <div style="font-size: 11px; font-family: var(--font-mono); color: var(--text-muted);" id="quote-tax-note">
                  excl. operator crew & GST
                </div>
              </div>
            </div>
          </div>

          <div class="quote-actions">
            <button class="btn btn-whatsapp" id="btn-whatsapp-quote">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M12.031 6.172c-3.181 0-5.767 2.586-5.768 5.766-.001 1.298.38 2.27 1.019 3.287l-.582 2.128 2.182-.573c.978.58 1.911.928 3.145.929 3.178 0 5.767-2.587 5.768-5.766.001-3.187-2.575-5.771-5.764-5.771zm3.392 8.244c-.144.405-.837.774-1.17.824-.312.045-.694.067-2.037-.488-1.574-.649-2.583-2.253-2.661-2.358-.079-.105-.644-.858-.644-1.636 0-.777.406-1.159.55-1.317.144-.158.314-.198.42-.198.106 0 .211.001.303.006.098.005.23-.037.36.275.132.318.45 1.096.49 1.176.04.079.066.172.013.277-.053.106-.079.172-.158.264-.079.092-.167.206-.238.277-.079.079-.162.165-.069.324.092.158.41 1.037 1.134 1.488.423.264.78.347.938.411.158.064.251.053.344-.053.092-.106.396-.462.502-.62.106-.158.211-.132.356-.079.145.053.924.436 1.082.515.158.079.264.119.303.185.04.066.04.383-.104.788z"/></svg>
              Request Quote on WhatsApp
            </button>
            <button class="btn btn-primary" id="btn-submit-quote-direct">
              Submit Instant Booking Inquiry
            </button>
          </div>
        </div>
      </div>
    </div>
  `;

  // Calculate & Update Summary function
  function updateSummary() {
    const prodObj = productionTypes.find(p => p.id === state.prodType) || productionTypes[0];
    const camObj = cameraTiers.find(c => c.id === state.cameraTier) || cameraTiers[1];
    const durObj = durationOptions.find(d => d.id === state.duration) || durationOptions[0];
    const cityObj = cityHubs.find(c => c.id === state.city) || cityHubs[0];

    // Compute Base Daily Rate
    let dailyRate = camObj.cost;

    // Add selected lenses
    const lensesCost = state.selectedLenses.reduce((sum, lId) => {
      const lObj = lensAddons.find(l => l.id === lId);
      return sum + (lObj ? lObj.cost : 0);
    }, 0);

    // Add selected hardware
    const hardwareCost = state.selectedHardware.reduce((sum, hId) => {
      const hObj = hardwareAddons.find(h => h.id === hId);
      return sum + (hObj ? hObj.cost : 0);
    }, 0);

    dailyRate = (dailyRate + lensesCost + hardwareCost) * prodObj.baseMultiplier;

    // Multiply by duration with multi-day discount
    const totalEstimate = Math.round(dailyRate * durObj.days * durObj.discount);

    // Render Breakdown Rows
    const breakdownList = document.getElementById('quote-breakdown-list');
    if (breakdownList) {
      breakdownList.innerHTML = `
        <div class="summary-row">
          <span class="label">Production:</span>
          <span class="val">${prodObj.label}</span>
        </div>
        <div class="summary-row">
          <span class="label">Camera Chain:</span>
          <span class="val">${camObj.cams}</span>
        </div>
        <div class="summary-row">
          <span class="label">Lenses Added:</span>
          <span class="val">${state.selectedLenses.length ? `${state.selectedLenses.length} Units` : 'Standard Included'}</span>
        </div>
        <div class="summary-row">
          <span class="label">Comms / Support:</span>
          <span class="val">${state.selectedHardware.length ? `${state.selectedHardware.length} Modules` : 'None'}</span>
        </div>
        <div class="summary-row">
          <span class="label">Duration:</span>
          <span class="val">${durObj.label}</span>
        </div>
        <div class="summary-row">
          <span class="label">Hub Region:</span>
          <span class="val" style="color: var(--accent-red);">${cityObj.label.split(' ')[0]}</span>
        </div>
      `;
    }

    const priceDisplay = document.getElementById('quote-total-price');
    if (priceDisplay) {
      priceDisplay.textContent = `₹${totalEstimate.toLocaleString('en-IN')}`;
    }

    // Prepare WhatsApp Message Payload
    const waBtn = document.getElementById('btn-whatsapp-quote');
    if (waBtn) {
      const selectedLensesNames = state.selectedLenses.map(id => lensAddons.find(l => l.id === id)?.label).filter(Boolean).join(', ');
      const selectedHwNames = state.selectedHardware.map(id => hardwareAddons.find(h => h.id === id)?.label).filter(Boolean).join(', ');
      
      const messageText = `*Fast Media Communications Equipment Rental Inquiry*
---------------------------------------
• *Production Type:* ${prodObj.label}
• *Camera Package:* ${camObj.label} (${camObj.cams})
• *Lenses:* ${selectedLensesNames || 'Standard'}
• *Support & Intercom:* ${selectedHwNames || 'Standard'}
• *Duration:* ${durObj.label}
• *City Dispatch Hub:* ${cityObj.label}
${state.customNotes ? `• *Special Notes:* ${state.customNotes}\n` : ''}• *Est. Package:* ₹${totalEstimate.toLocaleString('en-IN')}
---------------------------------------
Please confirm equipment availability and send official quotation.`;

      waBtn.onclick = () => {
        window.open(`https://wa.me/919444089654?text=${encodeURIComponent(messageText)}`, '_blank');
      };
    }
  }

  // Handle Selectable Cards Click
  container.addEventListener('click', (e) => {
    const card = e.target.closest('.selectable-card');
    if (!card) return;

    const type = card.getAttribute('data-type');
    const val = card.getAttribute('data-val');

    if (type === 'prod') {
      state.prodType = val;
      container.querySelectorAll('#prod-types-row .selectable-card').forEach(c => c.classList.remove('selected'));
      card.classList.add('selected');
    } else if (type === 'cam') {
      state.cameraTier = val;
      container.querySelectorAll('#camera-tiers-row .selectable-card').forEach(c => c.classList.remove('selected'));
      card.classList.add('selected');
    } else if (type === 'lens') {
      if (state.selectedLenses.includes(val)) {
        state.selectedLenses = state.selectedLenses.filter(x => x !== val);
        card.classList.remove('selected');
      } else {
        state.selectedLenses.push(val);
        card.classList.add('selected');
      }
    } else if (type === 'hardware') {
      if (state.selectedHardware.includes(val)) {
        state.selectedHardware = state.selectedHardware.filter(x => x !== val);
        card.classList.remove('selected');
      } else {
        state.selectedHardware.push(val);
        card.classList.add('selected');
      }
    }

    updateSummary();
  });

  // Duration & City dropdown listeners
  const durSelect = document.getElementById('select-duration');
  if (durSelect) {
    durSelect.addEventListener('change', (e) => {
      state.duration = e.target.value;
      updateSummary();
    });
  }

  const citySelect = document.getElementById('select-city');
  if (citySelect) {
    citySelect.addEventListener('change', (e) => {
      state.city = e.target.value;
      updateSummary();
    });
  }

  // Custom Notes listener
  const notesInput = document.getElementById('quote-custom-notes');
  if (notesInput) {
    notesInput.addEventListener('input', (e) => {
      state.customNotes = e.target.value;
      updateSummary();
    });
  }

  // Direct Submission with Confetti
  const btnDirectSubmit = document.getElementById('btn-submit-quote-direct');
  if (btnDirectSubmit) {
    btnDirectSubmit.addEventListener('click', () => {
      // Trigger festive confetti
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#ff2a44', '#f59e0b', '#38bdf8', '#10b981']
      });

      const contactSection = document.getElementById('contact');
      if (contactSection) {
        contactSection.scrollIntoView({ behavior: 'smooth' });
        // Prefill contact message with inquiry summary
        const msgField = document.getElementById('contact-form-message');
        if (msgField) {
          msgField.value = `Quotation Request for ${state.prodType.toUpperCase()} - ${state.cameraTier} (${state.duration}) in ${state.city.toUpperCase()}`;
        }
      }
    });
  }

  updateSummary();
}
