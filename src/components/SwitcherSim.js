export function initSwitcherSim() {
  const container = document.getElementById('switcher-simulator-container');
  if (!container) return;

  // Camera feeds definitions with realistic stage & broadcast scenes
  const cameraFeeds = [
    {
      id: 1,
      name: 'CAM 1',
      type: 'WIDE STAGE 4K',
      lens: 'Canon 18-80mm Cine',
      desc: 'Master Arena Stage & Pyrotechnics',
      bgGradient: 'linear-gradient(135deg, #1e102d 0%, #3b0d2c 50%, #0d0614 100%)',
      previewIcon: '🎭',
      hudOverlay: 'FMC LIVE-01 // 4K UHD 59.94P'
    },
    {
      id: 2,
      name: 'CAM 2',
      type: '111X BOX LENS',
      lens: 'Canon DIGISUPER 111X',
      desc: 'Lead Performer / Audio Launch Dias',
      bgGradient: 'linear-gradient(135deg, #1c1917 0%, #451a03 50%, #0a0a0a 100%)',
      previewIcon: '🎤',
      hudOverlay: 'FMC LIVE-02 // 925mm T-IS 4K'
    },
    {
      id: 3,
      name: 'CAM 3',
      type: 'JIB CRANE SWEEP',
      lens: 'Fujinon HD 76X',
      desc: 'Overhead Arena Swoop & Crowds',
      bgGradient: 'linear-gradient(135deg, #0f172a 0%, #1e293b 50%, #020617 100%)',
      previewIcon: '🏗️',
      hudOverlay: 'FMC LIVE-03 // 40FT JIB OVERVIEW'
    },
    {
      id: 4,
      name: 'CAM 4',
      type: 'STEADICAM ROAM',
      lens: 'Zeiss CP.3 25mm T2.1',
      desc: 'VIP Front Row & Red Carpet Dynamic',
      bgGradient: 'linear-gradient(135deg, #14281d 0%, #0f3621 50%, #04140b 100%)',
      previewIcon: '🎥',
      hudOverlay: 'FMC LIVE-04 // WIRELESS RF LINK'
    },
    {
      id: 5,
      name: 'CAM 5',
      type: 'AUDIENCE REACTION',
      lens: 'Sony PMW-400 / 18-110',
      desc: 'Stadium 50,000 Cheering Fans',
      bgGradient: 'linear-gradient(135deg, #2b1115 0%, #4c111a 50%, #130407 100%)',
      previewIcon: '✨',
      hudOverlay: 'FMC LIVE-05 // STADIUM SECTOR-A'
    }
  ];

  let currentProgramId = 1;
  let currentPreviewId = 2;
  let isTransitioning = false;

  // Web Audio Context for authentic switcher tactile clicks
  let audioCtx = null;
  function playBeep(freq = 800, type = 'sine', duration = 0.04) {
    try {
      if (!audioCtx) audioCtx = new (window.AudioContext || window.webkitAudioContext)();
      if (audioCtx.state === 'suspended') audioCtx.resume();
      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();
      osc.type = type;
      osc.frequency.setValueAtTime(freq, audioCtx.currentTime);
      gain.gain.setValueAtTime(0.04, audioCtx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.0001, audioCtx.currentTime + duration);
      osc.connect(gain);
      gain.connect(audioCtx.destination);
      osc.start();
      osc.stop(audioCtx.currentTime + duration);
    } catch (e) {
      // Audio context might be restricted before interaction
    }
  }

  // Render HTML structure for Switcher Console
  container.innerHTML = `
    <div class="switcher-console" id="broadcast-switcher-console">
      <!-- Multiview Monitor Wall -->
      <div class="multiview-grid" id="multiview-monitor-grid">
        <!-- Main Program Output Monitor -->
        <div class="monitor-screen main-program is-program" id="monitor-pgm-main">
          <div class="monitor-video-sim" id="screen-pgm-feed">
            <div style="text-align: center;">
              <div style="font-size: 3rem; margin-bottom: 8px;" id="pgm-icon">🎭</div>
              <div style="font-family: var(--font-display); font-size: 1.4rem; font-weight: 800; color: #fff;" id="pgm-name">CAM 1: WIDE STAGE 4K</div>
              <div style="font-family: var(--font-mono); font-size: 12px; color: var(--accent-gold);" id="pgm-desc">Master Arena Stage & Pyrotechnics</div>
            </div>
          </div>
          <div class="monitor-overlay-header">
            <span class="monitor-cam-label" id="pgm-hud-tag">PROGRAM // ON-AIR</span>
            <span class="tally-badge pgm">● REC ON-AIR</span>
          </div>
        </div>

        <!-- 4 Sub Cameras in Multiview -->
        ${cameraFeeds.slice(1).map(cam => `
          <div class="monitor-screen ${cam.id === currentPreviewId ? 'is-preview' : ''}" data-cam-id="${cam.id}" id="sub-monitor-${cam.id}">
            <div class="monitor-video-sim" style="background: ${cam.bgGradient};">
              <div style="text-align: center;">
                <div style="font-size: 1.6rem; margin-bottom: 4px;">${cam.previewIcon}</div>
                <div style="font-family: var(--font-display); font-size: 0.95rem; font-weight: 700; color: #fff;">${cam.name}</div>
                <div style="font-family: var(--font-mono); font-size: 10px; color: var(--text-muted);">${cam.type}</div>
              </div>
            </div>
            <div class="monitor-overlay-header">
              <span class="monitor-cam-label">${cam.name}</span>
              <span class="tally-badge ${cam.id === currentPreviewId ? 'pvw' : 'idle'}" id="tally-badge-${cam.id}">
                ${cam.id === currentPreviewId ? 'PVW' : 'STANDBY'}
              </span>
            </div>
          </div>
        `).join('')}
      </div>

      <!-- Control Deck & Bus Buttons -->
      <div class="switcher-control-deck">
        <!-- Program Bus -->
        <div class="bus-row">
          <span class="bus-label pgm-label">PGM BUS</span>
          ${cameraFeeds.map(cam => `
            <button class="bus-btn ${cam.id === currentProgramId ? 'active-pgm' : ''}" 
                    data-type="pgm" data-cam="${cam.id}" id="btn-pgm-${cam.id}" title="Cut directly to ${cam.name}">
              ${cam.id}
            </button>
          `).join('')}
        </div>

        <!-- Preview Bus -->
        <div class="bus-row">
          <span class="bus-label pvw-label">PVW BUS</span>
          ${cameraFeeds.map(cam => `
            <button class="bus-btn ${cam.id === currentPreviewId ? 'active-pvw' : ''}" 
                    data-type="pvw" data-cam="${cam.id}" id="btn-pvw-${cam.id}" title="Preview ${cam.name}">
              ${cam.id}
            </button>
          `).join('')}
        </div>

        <!-- Transitions (Cut / Auto / T-Bar) -->
        <div class="transition-deck">
          <button class="trans-btn trans-cut" id="btn-switcher-cut" title="Direct Instant Cut">
            CUT
          </button>
          <button class="trans-btn trans-auto" id="btn-switcher-auto" title="Auto Dissolve Mix">
            AUTO MIX
          </button>
          <div style="display: flex; align-items: center; gap: 8px;">
            <label style="font-family: var(--font-mono); font-size: 10px; color: var(--text-muted);">T-BAR</label>
            <input type="range" min="0" max="100" value="0" id="switcher-tbar" 
                   style="width: 80px; accent-color: var(--accent-red); cursor: pointer;" title="T-Bar Manual Fader">
          </div>
        </div>

        <!-- Audio VU Meters -->
        <div class="vu-meter-rack" title="Real-Time Master Output VU Meter (-18dBFS Target)">
          <div class="vu-track" id="vu-l">
            ${Array.from({ length: 8 }).map((_, i) => `
              <div class="vu-segment ${i >= 6 ? 'lit-red' : (i >= 4 ? 'lit-yellow' : 'lit-green')}"></div>
            `).join('')}
          </div>
          <div class="vu-track" id="vu-r">
            ${Array.from({ length: 8 }).map((_, i) => `
              <div class="vu-segment ${i >= 6 ? 'lit-red' : (i >= 4 ? 'lit-yellow' : 'lit-green')}"></div>
            `).join('')}
          </div>
          <span style="font-family: var(--font-mono); font-size: 10px; color: var(--text-muted); margin-left: 4px;">4K AUDIO</span>
        </div>
      </div>
    </div>
  `;

  // Function to refresh switcher UI states
  function updateSwitcherUI() {
    const pgmCam = cameraFeeds.find(c => c.id === currentProgramId);
    if (!pgmCam) return;

    // Update Main Program Monitor Display
    const pgmFeed = document.getElementById('screen-pgm-feed');
    const pgmIcon = document.getElementById('pgm-icon');
    const pgmName = document.getElementById('pgm-name');
    const pgmDesc = document.getElementById('pgm-desc');
    const pgmHud = document.getElementById('pgm-hud-tag');

    if (pgmFeed) pgmFeed.style.background = pgmCam.bgGradient;
    if (pgmIcon) pgmIcon.textContent = pgmCam.previewIcon;
    if (pgmName) pgmName.textContent = `${pgmCam.name}: ${pgmCam.type}`;
    if (pgmDesc) pgmDesc.textContent = pgmCam.desc;
    if (pgmHud) pgmHud.textContent = pgmCam.hudOverlay;

    // Update Bus Buttons
    cameraFeeds.forEach(cam => {
      const pgmBtn = document.getElementById(`btn-pgm-${cam.id}`);
      const pvwBtn = document.getElementById(`btn-pvw-${cam.id}`);
      const subMon = document.getElementById(`sub-monitor-${cam.id}`);
      const tallyBadge = document.getElementById(`tally-badge-${cam.id}`);

      if (pgmBtn) pgmBtn.classList.toggle('active-pgm', cam.id === currentProgramId);
      if (pvwBtn) pvwBtn.classList.toggle('active-pvw', cam.id === currentPreviewId);

      if (subMon) {
        subMon.classList.remove('is-preview', 'is-program');
        if (cam.id === currentProgramId) subMon.classList.add('is-program');
        else if (cam.id === currentPreviewId) subMon.classList.add('is-preview');
      }

      if (tallyBadge) {
        tallyBadge.className = 'tally-badge ' + (cam.id === currentProgramId ? 'pgm' : (cam.id === currentPreviewId ? 'pvw' : 'idle'));
        tallyBadge.textContent = cam.id === currentProgramId ? 'ON-AIR' : (cam.id === currentPreviewId ? 'PVW' : 'STANDBY');
      }
    });
  }

  // Action: CUT
  function doCut() {
    if (isTransitioning) return;
    playBeep(920, 'square', 0.05);
    const temp = currentProgramId;
    currentProgramId = currentPreviewId;
    currentPreviewId = temp;
    updateSwitcherUI();
  }

  // Action: AUTO DISSOLVE
  function doAutoDissolve() {
    if (isTransitioning) return;
    isTransitioning = true;
    playBeep(640, 'triangle', 0.1);

    const tBar = document.getElementById('switcher-tbar');
    let val = 0;
    const interval = setInterval(() => {
      val += 10;
      if (tBar) tBar.value = val;
      if (val >= 100) {
        clearInterval(interval);
        const temp = currentProgramId;
        currentProgramId = currentPreviewId;
        currentPreviewId = temp;
        updateSwitcherUI();
        if (tBar) tBar.value = 0;
        isTransitioning = false;
      }
    }, 30);
  }

  // Setup Event Listeners
  container.querySelectorAll('.bus-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
      const type = btn.getAttribute('data-type');
      const camId = parseInt(btn.getAttribute('data-cam'), 10);
      playBeep(750, 'sine', 0.03);

      if (type === 'pgm') {
        currentProgramId = camId;
      } else {
        currentPreviewId = camId;
      }
      updateSwitcherUI();
    });
  });

  // Clicking on any multiview monitor assigns it to Preview
  container.querySelectorAll('.monitor-screen:not(.main-program)').forEach(mon => {
    mon.addEventListener('click', () => {
      const camId = parseInt(mon.getAttribute('data-cam-id'), 10);
      currentPreviewId = camId;
      playBeep(680, 'sine', 0.03);
      updateSwitcherUI();
    });
  });

  const btnCut = document.getElementById('btn-switcher-cut');
  if (btnCut) btnCut.addEventListener('click', doCut);

  const btnAuto = document.getElementById('btn-switcher-auto');
  if (btnAuto) btnAuto.addEventListener('click', doAutoDissolve);

  const tBar = document.getElementById('switcher-tbar');
  if (tBar) {
    tBar.addEventListener('input', (e) => {
      const val = parseInt(e.target.value, 10);
      if (val >= 100) {
        doCut();
        e.target.value = 0;
      }
    });
  }

  // Audio VU Meter Realistic Random Bouncing
  setInterval(() => {
    const vuSegmentsL = document.querySelectorAll('#vu-l .vu-segment');
    const vuSegmentsR = document.querySelectorAll('#vu-r .vu-segment');
    const levelL = Math.floor(Math.random() * 5) + 3; // 3 to 7 lit
    const levelR = Math.floor(Math.random() * 5) + 3;

    vuSegmentsL.forEach((seg, idx) => {
      seg.style.opacity = idx < levelL ? '1' : '0.15';
    });
    vuSegmentsR.forEach((seg, idx) => {
      seg.style.opacity = idx < levelR ? '1' : '0.15';
    });
  }, 120);

  updateSwitcherUI();
}
