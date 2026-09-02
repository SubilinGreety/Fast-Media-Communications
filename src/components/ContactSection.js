import confetti from 'canvas-confetti';

export function initContactSection() {
  const container = document.getElementById('contact-section-root');
  if (!container) return;

  container.innerHTML = `
    <div class="contact-grid">
      <!-- Left: Contact Information & Highlights -->
      <div class="contact-info-pane">
        <div class="contact-highlight-card">
          <span class="section-badge">IMMEDIATE DISPATCH</span>
          <h3 style="font-size: 1.5rem; color: #fff; margin-bottom: 12px;">Ready to Capture Your Vision?</h3>
          <p style="font-size: 0.95rem; color: var(--text-secondary); line-height: 1.7; margin-bottom: 24px;">
            With over 30 years of broadcast dominance, our engineering and rental team provides turnkey 4K multicam, OB vans, specialty box lenses, and complete technical crew across India.
          </p>

          <div style="display: flex; flex-direction: column; gap: 16px; margin-bottom: 24px;">
            <div style="display: flex; align-items: flex-start; gap: 14px;">
              <div style="width: 40px; height: 40px; border-radius: 50%; background: rgba(255, 42, 68, 0.1); border: 1px solid rgba(255, 42, 68, 0.25); display: flex; align-items: center; justify-content: center; color: var(--accent-red); font-size: 18px; flex-shrink: 0;">
                📍
              </div>
              <div>
                <strong style="color: #fff; font-size: 14px;">Chennai Headquarters:</strong>
                <p style="font-size: 13px; color: var(--text-secondary); margin-top: 2px;">
                  33, 16B, Umapathy Street, West Mambalam, Chennai, Tamil Nadu 600033
                </p>
              </div>
            </div>

            <div style="display: flex; align-items: flex-start; gap: 14px;">
              <div style="width: 40px; height: 40px; border-radius: 50%; background: rgba(245, 158, 11, 0.1); border: 1px solid rgba(245, 158, 11, 0.25); display: flex; align-items: center; justify-content: center; color: var(--accent-gold); font-size: 18px; flex-shrink: 0;">
                🏢
              </div>
              <div>
                <strong style="color: #fff; font-size: 14px;">Mumbai Regional Centre:</strong>
                <p style="font-size: 13px; color: var(--text-secondary); margin-top: 2px;">
                  22/180, Ground Floor, L Corner Gala, Motilal Nagar 1, Goregaon (W), Mumbai 400104
                </p>
              </div>
            </div>

            <div style="display: flex; align-items: flex-start; gap: 14px;">
              <div style="width: 40px; height: 40px; border-radius: 50%; background: rgba(16, 185, 129, 0.1); border: 1px solid rgba(16, 185, 129, 0.25); display: flex; align-items: center; justify-content: center; color: var(--accent-green); font-size: 18px; flex-shrink: 0;">
                📞
              </div>
              <div>
                <strong style="color: #fff; font-size: 14px;">24/7 Rental Hotline:</strong>
                <p style="font-size: 13px; font-family: var(--font-mono); color: var(--accent-gold); margin-top: 2px;">
                  <a href="tel:+919444089654">+91 94440 89654</a> • <a href="tel:+919380089654">+91 93800 89654</a>
                </p>
              </div>
            </div>
          </div>

          <a href="https://wa.me/919444089654?text=${encodeURIComponent('Hello Fast Media Communications, I need urgent equipment rental assistance.')}" 
             target="_blank" class="btn btn-whatsapp" style="width: 100%;">
            Chat Directly on WhatsApp
          </a>
        </div>
      </div>

      <!-- Right: Direct Booking & Inquiry Form -->
      <div class="contact-form-box">
        <h3 style="font-size: 1.4rem; color: #fff; margin-bottom: 8px;">Direct Production Inquiry</h3>
        <p style="font-size: 0.9rem; color: var(--text-secondary); margin-bottom: 24px;">
          Fill out your shoot details and our technical dispatch coordinator will respond within 15 minutes.
        </p>

        <form id="direct-inquiry-form">
          <div class="form-group-row">
            <div class="form-field">
              <label class="form-label">Your Name / Organization *</label>
              <input type="text" class="form-control" id="contact-form-name" placeholder="e.g. Rajesh Kumar (Sun TV / Studio)" required>
            </div>
            <div class="form-field">
              <label class="form-label">Phone Number *</label>
              <input type="tel" class="form-control" id="contact-form-phone" placeholder="e.g. +91 98765 43210" required>
            </div>
          </div>

          <div class="form-group-row">
            <div class="form-field">
              <label class="form-label">Email Address *</label>
              <input type="email" class="form-control" id="contact-form-email" placeholder="e.g. production@mediahouse.com" required>
            </div>
            <div class="form-field">
              <label class="form-label">Shooting Dates</label>
              <input type="text" class="form-control" id="contact-form-dates" placeholder="e.g. 15th to 18th Oct 2026">
            </div>
          </div>

          <div class="form-field">
            <label class="form-label">Equipment Required / Production Scope</label>
            <textarea class="form-control" id="contact-form-message" rows="4" placeholder="Detail your camera requirements, lenses, intercoms, or OB van needs..."></textarea>
          </div>

          <button type="submit" class="btn btn-primary" id="btn-submit-contact-form" style="width: 100%; padding: 14px;">
            Send Official Inquiry
          </button>

          <div id="contact-form-status" style="margin-top: 14px; text-align: center; font-size: 13px; display: none;"></div>
        </form>
      </div>
    </div>
  `;

  // Form submission handling
  const form = document.getElementById('direct-inquiry-form');
  const statusBox = document.getElementById('contact-form-status');

  if (form) {
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const name = document.getElementById('contact-form-name').value;
      const phone = document.getElementById('contact-form-phone').value;
      const email = document.getElementById('contact-form-email').value;
      const dates = document.getElementById('contact-form-dates').value;
      const msg = document.getElementById('contact-form-message').value;

      // Confetti celebration
      confetti({
        particleCount: 100,
        spread: 80,
        origin: { y: 0.7 },
        colors: ['#ff2a44', '#f59e0b', '#38bdf8', '#10b981']
      });

      if (statusBox) {
        statusBox.style.display = 'block';
        statusBox.style.color = 'var(--accent-green)';
        statusBox.innerHTML = `✓ Thank you <strong>${name}</strong>! Your inquiry has been dispatched to Fast Media Communications technical lead. We will call you at <strong>${phone}</strong> shortly.`;
      }

      // Also generate WhatsApp payload
      const waText = `*Inquiry from Website (Fast Media Communications)*
• Name: ${name}
• Phone: ${phone}
• Email: ${email}
• Dates: ${dates || 'Immediate'}
• Message: ${msg || 'Equipment rental inquiry'}`;

      setTimeout(() => {
        if (confirm('Would you like to open WhatsApp to connect immediately with our dispatch manager?')) {
          window.open(`https://wa.me/919444089654?text=${encodeURIComponent(waText)}`, '_blank');
        }
      }, 800);

      form.reset();
    });
  }
}
