import { eventsData, clientNetworks } from '../data/events.js';

export function initEventGallery() {
  const container = document.getElementById('event-gallery-root');
  if (!container) return;

  container.innerHTML = `
    <!-- Events Grid -->
    <div class="events-grid" id="events-grid-items">
      ${eventsData.map(event => `
        <div class="glass-card event-card" data-event-id="${event.id}">
          <div class="event-image-box">
            <img src="${event.image}" alt="${event.title}" loading="lazy"
                 onerror="this.onerror=null; this.src='https://fastmediacommunications.com/wp-content/uploads/2025/01/Layer-3.png'">
            <span class="event-category-badge">${event.category}</span>
          </div>
          <div class="event-body">
            <h3 class="event-title">${event.title}</h3>
            <div class="event-location">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
                <circle cx="12" cy="10" r="3"></circle>
              </svg>
              ${event.location}
            </div>
            <p class="event-desc">${event.description}</p>
            
            <div style="margin-bottom: 16px;">
              <span style="font-family: var(--font-mono); font-size: 11px; color: var(--text-muted); display: block; margin-bottom: 4px;">BROADCAST RIG DEPLOYED:</span>
              <div style="font-size: 12px; font-weight: 600; color: #fff;">${event.rig}</div>
            </div>

            <div class="event-gear-tags">
              ${event.gearUsed.map(g => `
                <span class="gear-tag">${g}</span>
              `).join('')}
            </div>
          </div>
        </div>
      `).join('')}
    </div>

    <!-- Client Networks & Partners Marquee -->
    <div class="clients-marquee-box">
      <div style="text-align: center; margin-bottom: 28px;">
        <span class="section-badge">OVER 3 DECADES OF TRUST</span>
        <h3 style="font-size: 1.6rem; color: #fff;">Trusted by 50+ Premier Channels & Production Houses</h3>
      </div>

      <div class="clients-grid">
        ${clientNetworks.map(client => `
          <div class="client-brand-card">
            <div class="client-brand-name">${client.logoText}</div>
            <div class="client-brand-region">${client.region}</div>
          </div>
        `).join('')}
      </div>
    </div>
  `;
}
