import { branchesData } from '../data/branches.js';

export function initBranchLocator() {
  const container = document.getElementById('branch-locator-root');
  if (!container) return;

  container.innerHTML = `
    <div class="hubs-grid">
      ${branchesData.map(hub => `
        <div class="glass-card hub-card ${hub.isPrimary ? 'primary-hub' : ''}">
          <div class="hub-type-badge">${hub.type}</div>
          <h3 class="hub-city-name">${hub.name}</h3>
          <p class="hub-address-text">${hub.address}</p>

          <div class="hub-features-list">
            ${hub.features.map(f => `
              <span class="hub-feat-pill">✓ ${f}</span>
            `).join('')}
          </div>

          <div class="hub-contact-list">
            <div class="hub-contact-item">
              <span style="color: var(--accent-gold);">📞</span>
              <div>
                ${hub.phones.map(p => `
                  <a href="tel:${p.replace(/\s+/g, '')}">${p}</a>
                `).join(' • ')}
              </div>
            </div>

            <div class="hub-contact-item">
              <span style="color: var(--accent-red);">✉️</span>
              <div>
                ${hub.emails.map(e => `
                  <a href="mailto:${e}">${e}</a>
                `).join(', ')}
              </div>
            </div>

            <div class="hub-contact-item">
              <span style="color: var(--accent-green);">👤</span>
              <span style="font-size: 12px; color: var(--text-secondary);">${hub.contactPerson} (${hub.hours})</span>
            </div>
          </div>

          <div style="margin-top: auto; display: flex; gap: 10px;">
            <a href="tel:${hub.phones[0].replace(/\s+/g, '')}" class="btn btn-outline-red" style="flex: 1; padding: 8px 12px; font-size: 12px;">
              Call Hub
            </a>
            <a href="https://wa.me/919444089654?text=${encodeURIComponent(`Hello Fast Media Communications, I need equipment rental for ${hub.name}`)}" 
               target="_blank" class="btn btn-whatsapp" style="flex: 1; padding: 8px 12px; font-size: 12px;">
              WhatsApp
            </a>
          </div>
        </div>
      `).join('')}
    </div>
  `;
}
