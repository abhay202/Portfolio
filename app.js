/**
 * Abhay Sengar | Portfolio — app.js
 * Terminal portfolio with boot sequence, matrix rain, interactive CLI
 */

/* ── DOM refs ─────────────────────────────────────────────── */
const $ = id => document.getElementById(id);
const output = $('output-area');
const inputEl = $('cli-input');

/* ═══════════════════════════════════════════════════════════
   BOOT SEQUENCE
   ═══════════════════════════════════════════════════════════ */
const bootLines = [
  { text: '[    0.000] BIOS POST check...                          [  OK  ]', cls: 'boot-ok', delay: 60 },
  { text: '[    0.042] Initializing abhay-portfolio-LTS kernel...', cls: 'boot-info', delay: 80 },
  { text: '[    0.128] Loading hardware modules:', cls: 'boot-info', delay: 70 },
  { text: '[    0.196]   ├── ARM Cortex-M subsystem                [  OK  ]', cls: 'boot-ok', delay: 70 },
  { text: '[    0.264]   ├── STM32 HAL / Cube IDE                  [  OK  ]', cls: 'boot-ok', delay: 70 },
  { text: '[    0.332]   ├── FreeRTOS scheduler                    [  OK  ]', cls: 'boot-ok', delay: 70 },
  { text: '[    0.400]   ├── I2C / SPI / UART buses          [  OK  ]', cls: 'boot-ok', delay: 70 },
  { text: '[    0.468]   ├── Zigbee / BLE protocol stack            [  OK  ]', cls: 'boot-ok', delay: 70 },
  { text: '[    0.536]   └── MQTT / TCP networking                  [  OK  ]', cls: 'boot-ok', delay: 70 },
  { text: '[    0.604] Mounting /dev/nokia-firmware...', cls: 'boot-highlight', delay: 100 },
  { text: '[    0.672] Mounting /dev/digineous-controllers...', cls: 'boot-highlight', delay: 100 },
  { text: '[    0.760] Loading firmware modules...', cls: 'boot-highlight', delay: 120 },
  { text: '[    0.848] Image integrity verification               [PASS]', cls: 'boot-ok', delay: 80 },
  { text: '[    0.916] NC State kernel v3.65 loaded.', cls: 'boot-info', delay: 60 },
  { text: '[    0.984] VIT bootstrap v8.94 loaded.', cls: 'boot-info', delay: 60 },
  { text: '[    1.052] All systems nominal.', cls: 'boot-ok', delay: 80 },
  { text: '', cls: 'boot-info', delay: 40 },
  { text: '> Starting abhay.sh ...', cls: 'boot-brand', delay: 160 },
];

function runBootSequence() {
  const overlay = $('boot-overlay');
  const log = $('boot-log');
  if (!overlay || !log) return;

  let i = 0;
  function nextLine() {
    if (i >= bootLines.length) {
      setTimeout(() => {
        overlay.classList.add('fade-out');
        setTimeout(() => { overlay.classList.add('hidden'); }, 800);
      }, 250);
      return;
    }
    const line = bootLines[i++];
    const span = document.createElement('span');
    span.className = line.cls;
    span.textContent = line.text + '\n';
    log.appendChild(span);
    log.scrollTop = log.scrollHeight;
    setTimeout(nextLine, line.delay);
  }
  nextLine();
}

if (!sessionStorage.getItem('booted')) {
  sessionStorage.setItem('booted', '1');
  runBootSequence();
} else {
  const overlay = $('boot-overlay');
  if (overlay) overlay.classList.add('hidden');
}

/* ═══════════════════════════════════════════════════════════
   MATRIX RAIN
   ═══════════════════════════════════════════════════════════ */
(function initMatrix() {
  const canvas = $('matrix-canvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  let W, H, columns, drops;
  const chars = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz&*+-/%^~|<>={}[]();:,.?#@μΩλπΣΔ∞√⊕⊗';
  const fontSize = 14;

  function resize() {
    W = canvas.width = window.innerWidth;
    H = canvas.height = window.innerHeight;
    columns = Math.floor(W / fontSize);
    drops = Array(columns).fill(1);
  }
  resize();
  window.addEventListener('resize', resize);

  function draw() {
    ctx.fillStyle = 'rgba(0, 0, 0, 0.05)';
    ctx.fillRect(0, 0, W, H);
    ctx.fillStyle = '#4ec956';
    ctx.font = fontSize + 'px monospace';

    for (let i = 0; i < drops.length; i++) {
      const char = chars[Math.floor(Math.random() * chars.length)];
      ctx.fillText(char, i * fontSize, drops[i] * fontSize);
      if (drops[i] * fontSize > H && Math.random() > 0.975) drops[i] = 0;
      drops[i]++;
    }
  }
  setInterval(draw, 50);
})();

/* ═══════════════════════════════════════════════════════════
   SIDE DMESG LOG PANELS
   ═══════════════════════════════════════════════════════════ */
(function initSideLogs() {
  const leftPanel = $('side-log-left');
  const rightPanel = $('side-log-right');
  if (!leftPanel || !rightPanel) return;

  const logPool = [
    { t: '[    0.000000]', m: 'Linux version 6.1.0-abhay (gcc 12.2)', c: 'log-ok' },
    { t: '[    0.000012]', m: 'Command line: BOOT_IMAGE=/vmlinuz root=/dev/sda1', c: 'log-dim' },
    { t: '[    0.004521]', m: 'BIOS-provided physical RAM map:', c: 'log-dim' },
    { t: '[    0.008103]', m: 'ACPI: RSDP 0x00000000000F0490', c: 'log-dim' },
    { t: '[    0.012440]', m: 'NX (Execute Disable) protection: active', c: 'log-ok' },
    { t: '[    0.024891]', m: 'DMI: ARM Cortex-M Portfolio/Embedded', c: 'log-info' },
    { t: '[    0.031002]', m: 'tsc: Detected 1500.000 MHz processor', c: 'log-ok' },
    { t: '[    0.048230]', m: 'CPU: ARM Cortex-A72 rev 3 (aarch64)', c: 'log-info' },
    { t: '[    0.052100]', m: 'Memory: 3932160K/4194304K available', c: 'log-ok' },
    { t: '[    0.061003]', m: 'pid_max: default: 32768 minimum: 301', c: 'log-dim' },
    { t: '[    0.072340]', m: 'Mount-cache hash table entries: 4096', c: 'log-dim' },
    { t: '[    0.084002]', m: 'rcu: Hierarchical SRCU implementation', c: 'log-dim' },
    { t: '[    0.091200]', m: 'smp: Bringing up secondary CPUs ...', c: 'log-ok' },
    { t: '[    0.098231]', m: 'smp: Brought up 1 node, 4 CPUs', c: 'log-ok' },
    { t: '[    0.110340]', m: 'devtmpfs: initialized', c: 'log-ok' },
    { t: '[    0.124003]', m: 'clocksource: jiffies: mask: 0xffffffff', c: 'log-dim' },
    { t: '[    0.138920]', m: 'DMA: preallocated 256 KiB GFP_KERNEL pool', c: 'log-dim' },
    { t: '[    0.152001]', m: 'platform i2c-gpio.0: registered', c: 'log-info' },
    { t: '[    0.164300]', m: 'platform spi-gpio.0: registered', c: 'log-info' },
    { t: '[    0.178002]', m: 'UART0: ttyS0 at MMIO 0x20201000 irq 83', c: 'log-ok' },
    { t: '[    0.192100]', m: 'i2c /dev entries driver loaded', c: 'log-ok' },
    { t: '[    0.204330]', m: 'stm32wb-hal: probe successful', c: 'log-ok' },
    { t: '[    0.218002]', m: 'spi-bcm2835 3f204000.spi: registered', c: 'log-info' },
    { t: '[    0.231400]', m: 'CAN bus: driver version 1.0.0 loaded', c: 'log-ok' },
    { t: '[    0.244001]', m: 'Zigbee: IEEE 802.15.4 stack init', c: 'log-info' },
    { t: '[    0.258200]', m: 'Bluetooth: HCI UART driver ver 2.3', c: 'log-info' },
    { t: '[    0.272003]', m: 'freertos: scheduler module loaded', c: 'log-ok' },
    { t: '[    0.286100]', m: 'gpio-exti: IRQ handler registered PC13', c: 'log-ok' },
    { t: '[    0.298440]', m: 'watchdog: 1kHz timer initialized', c: 'log-warn' },
    { t: '[    0.312002]', m: 'mqtt-client: broker connection pool ready', c: 'log-ok' },
    { t: '[    0.324100]', m: 'tcp: hash tables configured (established 8192)', c: 'log-dim' },
    { t: '[    0.338230]', m: 'nokia-fw: optical module driver v2.1', c: 'log-info' },
    { t: '[    0.364300]', m: 'adc: 12-bit SAR converter initialized', c: 'log-ok' },
    { t: '[    0.378002]', m: 'dma: scatter-gather engine ready', c: 'log-ok' },
    { t: '[    0.392100]', m: 'pwm: timer channel 0-3 configured', c: 'log-dim' },
    { t: '[    0.404440]', m: 'neon: ARM SIMD vectorization enabled', c: 'log-ok' },
    { t: '[    0.418003]', m: 'llvm: IR code generation backend ready', c: 'log-info' },
    { t: '[    0.432100]', m: 'mutex: priority inheritance protocol active', c: 'log-ok' },
    { t: '[    0.444230]', m: 'xinu: kernel extensions loaded (fork, MLFQ)', c: 'log-info' },
    { t: '[    0.458002]', m: 'EXT4-fs (sda1): mounted filesystem', c: 'log-ok' },
    { t: '[    0.472100]', m: 'systemd[1]: Reached target Basic System', c: 'log-ok' },
    { t: '[    0.486340]', m: 'jtag: debug interface on port 3333', c: 'log-dim' },
    { t: '[    0.498002]', m: 'gdb-server: remote debug stub active', c: 'log-dim' },
    { t: '[    0.512100]', m: 'eth0: Link is up 1000 Mbps Full Duplex', c: 'log-ok' },
    { t: '[    0.524440]', m: 'sensor: MAX3010x pulse oximeter ready', c: 'log-ok' },
    { t: '[    0.538003]', m: 'sensor: BME280 temp/pressure ready', c: 'log-ok' },
    { t: '[    0.552100]', m: 'vivado: synthesis constraints loaded', c: 'log-info' },
    { t: '[    0.564230]', m: 'rob: reorder buffer size=64 entries', c: 'log-dim' },
    { t: '[    0.578002]', m: 'iq: issue queue width=N configured', c: 'log-dim' },
    { t: '[    0.591100]', m: 'mppt: IC algorithm tracking enabled', c: 'log-ok' },
    { t: '[    0.604340]', m: 'boost-converter: 20kHz PWM active', c: 'log-ok' },
    { t: '[    0.618002]', m: 'lcd: ST7789 display driver initialized', c: 'log-ok' },
    { t: '[    0.632100]', m: 'imu: accelerometer calibration done', c: 'log-ok' },
    { t: '[    0.644440]', m: 'sram: 64KB block mapped 0x20000000', c: 'log-dim' },
    { t: '[    0.658003]', m: 'eigen: matrix library v3.4 linked', c: 'log-dim' },
    { t: '[    0.672100]', m: 'abhay-portfolio: all services started', c: 'log-ok' },
    { t: '[    0.686230]', m: 'login: root session opened (tty1)', c: 'log-ok' },
  ];

  function fillPanel(panel, offset) {
    const shuffled = [...logPool].sort(() => Math.random() - 0.5);
    const totalLines = Math.ceil(window.innerHeight / 12) + 20;
    for (let i = 0; i < totalLines; i++) {
      const entry = shuffled[(i + offset) % shuffled.length];
      const line = document.createElement('div');
      line.className = 'log-line ' + entry.c;
      line.textContent = entry.t + ' ' + entry.m;
      panel.appendChild(line);
    }
  }

  fillPanel(leftPanel, 0);
  fillPanel(rightPanel, 29);

  let leftScroll = 0;
  let rightScroll = 0;
  function scrollLogs() {
    leftScroll += 0.3;
    rightScroll += 0.2;
    leftPanel.style.transform = `translateY(-${leftScroll % (leftPanel.scrollHeight / 2)}px)`;
    rightPanel.style.transform = `translateY(-${rightScroll % (rightPanel.scrollHeight / 2)}px)`;

    if (leftScroll > leftPanel.scrollHeight / 2) {
      leftScroll = 0;
      leftPanel.innerHTML = '';
      fillPanel(leftPanel, Math.floor(Math.random() * 30));
    }
    if (rightScroll > rightPanel.scrollHeight / 2) {
      rightScroll = 0;
      rightPanel.innerHTML = '';
      fillPanel(rightPanel, Math.floor(Math.random() * 30));
    }
    requestAnimationFrame(scrollLogs);
  }
  requestAnimationFrame(scrollLogs);
})();

/* ═══════════════════════════════════════════════════════════
   NAV LINKS
   ═══════════════════════════════════════════════════════════ */
document.querySelectorAll('#top-nav a[data-section]').forEach(link => {
  link.addEventListener('click', e => {
    e.preventDefault();
    const section = link.getAttribute('data-section');
    const cmdMap = {
      home: 'cat whoami.md',
      experience: 'cat experience.md',
      education: 'cat education.md',
      projects: 'ls projects/',
      skills: 'cat skills.md',
      contact: 'cat contact.md',
      help: 'help'
    };
    document.querySelectorAll('#top-nav a').forEach(a => a.classList.remove('active'));
    link.classList.add('active');
    if (cmdMap[section]) {
      runCmd(cmdMap[section]);
      inputEl.focus();
    }
  });
});

/* ═══════════════════════════════════════════════════════════
   INTERACTIVE CLI
   ═══════════════════════════════════════════════════════════ */
document.querySelector('.cli-section').addEventListener('click', () => inputEl.focus());

let history = [], histIdx = -1;

inputEl.addEventListener('keydown', e => {
  if (e.key === 'ArrowUp') {
    if (histIdx < history.length - 1) histIdx++;
    inputEl.value = history[histIdx] ?? '';
    e.preventDefault();
  } else if (e.key === 'ArrowDown') {
    if (histIdx > 0) histIdx--;
    else { histIdx = -1; inputEl.value = ''; return; }
    inputEl.value = history[histIdx] ?? '';
    e.preventDefault();
  } else if (e.key === 'Tab') {
    const val = inputEl.value.trim().toLowerCase();
    const match = Object.keys(COMMANDS).find(c => c.toLowerCase().startsWith(val) && c.toLowerCase() !== val);
    if (match) inputEl.value = match;
    e.preventDefault();
  } else if (e.key === 'l' && e.ctrlKey) {
    runCmd('clear');
    e.preventDefault();
  } else if (e.key === 'Enter') {
    const cmd = inputEl.value.trim();
    inputEl.value = '';
    histIdx = -1;
    if (cmd) { history.unshift(cmd); runCmd(cmd); }
  }
});

document.querySelectorAll('.shortcut').forEach(btn => {
  btn.addEventListener('click', e => {
    e.stopPropagation();
    runCmd(btn.getAttribute('data-cmd'));
    inputEl.focus();
  });
});

/* ── Output helpers ───────────────────────────────────────── */
function appendBlock(htmlContent, cmdLabel) {
  const block = document.createElement('div');
  block.className = 'output-block';
  block.innerHTML = `
      <div class="echo-line">
        <span class="prompt">
          <span class="user">abhay</span><span class="at">@</span><span class="host">abhayportfolio</span><span class="colon">:</span><span class="path">~</span><span class="dollar">$</span>
        </span>
        <span class="echo-cmd">${escHtml(cmdLabel)}</span>
      </div>
      <div class="cmd-output">${htmlContent}</div>`;
  output.appendChild(block);
  block.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
}

function escHtml(s) {
  return s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
}

function bar(pct, color = 'var(--bright-green)') {
  return `<div class="bar-track"><div class="bar-fill" style="width:${pct}%;background:${color}"></div></div>`;
}

function closeBlock(el) {
  const card = el.closest('.project-card');
  if (card) {
    const cmdOutput = card.closest('.cmd-output');
    const block = card.closest('.output-block');

    card.style.transition = 'opacity 0.25s ease, transform 0.25s ease';
    card.style.opacity = '0';
    card.style.transform = 'translateY(-8px)';

    setTimeout(() => {
      card.remove();
      // If there are no other project cards left in this command output, remove the entire output block
      if (cmdOutput && cmdOutput.querySelectorAll('.project-card').length === 0) {
        if (block) {
          block.style.transition = 'opacity 0.25s ease, transform 0.25s ease';
          block.style.opacity = '0';
          block.style.transform = 'translateY(-8px)';
          setTimeout(() => block.remove(), 250);
        }
      }
    }, 250);
  } else {
    // Fallback: If clicked close on a non-project block (if any exists in future)
    const block = el.closest('.output-block');
    if (block) {
      block.style.transition = 'opacity 0.25s ease, transform 0.25s ease';
      block.style.opacity = '0';
      block.style.transform = 'translateY(-8px)';
      setTimeout(() => block.remove(), 250);
    }
  }
}

function openProject(name) {
  runCmd('cat projects/' + name);
  inputEl.focus();
}

/* ═══════════════════════════════════════════════════════════
   COMMAND REGISTRY
   ═══════════════════════════════════════════════════════════ */
const COMMANDS = {

  'help': () => `
<div class="out-pre"><span class="green bold">Available commands:</span>

  <span class="cyan">cat whoami.md</span>           — About me
  <span class="cyan">cat experience.md</span>       — Work experience
  <span class="cyan">cat education.md</span>        — Academic background
  <span class="cyan">ls projects/</span>            — List all projects
  <span class="cyan">cat projects/&lt;n&gt;</span>        — Open a project (e.g. <span class="yellow">cat projects/freertos</span>)
  <span class="cyan">cat skills.md</span>           — Technical skill stack
  <span class="cyan">cat contact.md</span>          — Get in touch
  <span class="cyan">play</span>                    — Play Firmware Bug Defender (Shooter)
  <span class="cyan">neofetch</span>                — System overview
  <span class="cyan">uname -a</span>                — System info
  <span class="cyan">clear</span>                   — Clear terminal  <span class="dim">(or Ctrl+L)</span>
  <span class="cyan">help</span>                    — Show this message

<span class="dim">Tip: Use ↑ ↓ arrow keys for history, Tab to autocomplete.</span>
<span class="dim">Click any project name in <span class="cyan">ls projects/</span> to open it directly.</span>
</div>`,

  'neofetch': () => `<div class="neofetch-grid">
  <pre class="neofetch-ascii">
<span class="dim">                           </span>
<span class="green">        ┌──────────────┐</span>
<span class="green">   1 ───┤              ├─── 12</span>
<span class="green">   2 ───┤   A.SENGAR   ├─── 11</span>
<span class="cyan">   3 ───┤    v2.0      ├─── 10</span>
<span class="cyan">   4 ───┤   STM32WB    ├─── 9</span>
<span class="green">   5 ───┤  CORTEX-M4   ├─── 8</span>
<span class="green">   6 ───┤              ├─── 7</span>
<span class="green">        └──────┬───────┘</span>
<span class="green">               ▼</span>
  </pre>
  <div class="neofetch-info">
    <div><span class="green bold">abhay</span><span class="dim">@</span><span class="blue bold">abhayportfolio</span></div>
    <div class="neofetch-separator">────────────────────────</div>
    <div><span class="yellow bold">OS</span><span class="dim">:</span> Firmware Engineer LTS</div>
    <div><span class="yellow bold">Host</span><span class="dim">:</span> Nokia (Firmware Dev Co-op)</div>
    <div><span class="yellow bold">Kernel</span><span class="dim">:</span> M.S. Computer Engineering @ NC State</div>
    <div><span class="yellow bold">Uptime</span><span class="dim">:</span> since Aug 2024</div>
    <div><span class="yellow bold">Shell</span><span class="dim">:</span> C / C++ / Python / Bash</div>
    <div><span class="yellow bold">DE</span><span class="dim">:</span> STM32 Cube IDE / Altium Designer</div>
    <div><span class="yellow bold">WM</span><span class="dim">:</span> FreeRTOS / Bare-metal</div>
    <div><span class="yellow bold">CPU</span><span class="dim">:</span> ARM Cortex-M0 / M0+ / M4</div>
    <div><span class="yellow bold">GPU</span><span class="dim">:</span> N/A (bare-metal developer)</div>
    <div><span class="yellow bold">Memory</span><span class="dim">:</span> 3.7 / 4.00 GPA</div>
    <div><span class="yellow bold">Disk</span><span class="dim">:</span> 2 degrees loaded (VIT + NC State)</div>
    <div><span class="yellow bold">Locale</span><span class="dim">:</span> San Jose, CA</div>
    <div class="neofetch-colors">
      <span style="background:var(--red)"></span>
      <span style="background:var(--green)"></span>
      <span style="background:var(--yellow)"></span>
      <span style="background:var(--blue)"></span>
      <span style="background:var(--purple)"></span>
      <span style="background:var(--aqua)"></span>
      <span style="background:var(--orange)"></span>
      <span style="background:var(--fg)"></span>
    </div>
  </div>
</div>`,

  'cat whoami.md': () => `
<div>
  <div class="out-h">About Me</div>
  <div class="kv-row"><span class="kv-key">Name</span><span class="kv-value green bold">Abhay Pratap Singh Sengar</span></div>
  <div class="kv-row"><span class="kv-key">Seeking</span><span class="kv-value">Firmware & Embedded Systems Engineer</span></div>
  <div class="kv-row"><span class="kv-key">Past Experience</span><span class="kv-value cyan">Firmware Dev Co-op @ Nokia</span></div>
  <div class="kv-row"><span class="kv-key">Masters</span><span class="kv-value">M.S. Computer Engineering — NC State</span></div>
  <div class="kv-row"><span class="kv-key">Bachelors</span><span class="kv-value">B.Tech EEE — VIT Vellore</span></div>
  <div class="kv-row"><span class="kv-key">Location</span><span class="kv-value">San Jose, CA</span></div>
  <div class="kv-row"><span class="kv-key">Focus</span><span class="kv-value">Firmware Design· Embedded System · IoT</span></div>
  <div class="kv-row"><span class="kv-key">Status</span><span class="kv-value"><span class="green">● Open to full-time roles</span></span></div>
  <br>
  <div class="out-dim">
    Firmware & embedded systems engineer with experience at Nokia designing
    boot-time integrity verification, C++ driver APIs, and build infrastructure for
    optical firmware, and at Digineous Technologies developing low-level
    embedded control units, sensor networks and IoT integrations. Skilled across the full hardware-software stack from bare-metal
    firmware on ARM Cortex-M and FreeRTOS scheduling to IoT sensor networks with
    Zigbee/BLE and MQTT-based cloud pipelines.
  </div>
    <div class="dim" style="margin-top:10px">Run <span class="cyan">cat experience.md</span> or click on experience in navigation bar to view work history.</div>
</div>`,

  'cat skills.md': () => `
<div>
  <div class="out-h">Languages</div>
  <div class="progress-row"><span class="progress-label">C / Embedded C</span>${bar(95)}<span class="bar-pct">95%</span></div>
  <div class="progress-row"><span class="progress-label">C++</span>${bar(90)}<span class="bar-pct">90%</span></div>
  <div class="progress-row"><span class="progress-label">Python</span>${bar(82, 'var(--bright-blue)')}<span class="bar-pct">82%</span></div>
  <div class="progress-row"><span class="progress-label">Bash / Shell</span>${bar(78, 'var(--orange)')}<span class="bar-pct">78%</span></div>

  <div class="out-h">Tools & Frameworks</div>
  <div class="chips">
    <span class="chip">FreeRTOS</span><span class="chip">MATLAB</span><span class="chip">Altium</span>
    <span class="chip">STM32 Cube IDE</span><span class="chip">JTAG</span><span class="chip">Git</span>
    <span class="chip">Yocto</span><span class="chip">Jenkins</span><span class="chip">Jira</span>
    <span class="chip">GDB</span><span class="chip">Valgrind</span><span class="chip">Doctest</span>
  </div>

  <div class="out-h">Hardware Platforms</div>
  <div class="chips">
    <span class="chip">8051 Controller</span><span class="chip">STM32Wb</span><span class="chip">STM32 Nucleo</span>
    <span class="chip">STM32F091RC</span><span class="chip">KL25Z</span><span class="chip">RPi 4B</span>
    <span class="chip">ESP32</span><span class="chip">ESP8266</span><span class="chip">Arduino Uno</span>
    <span class="chip">NodeMCU</span>
  </div>

  <div class="out-h">Protocols & Interfaces</div>
  <div class="chips">
    <span class="chip">TCP</span><span class="chip">MQTT</span><span class="chip">UART</span>
    <span class="chip">SPI</span><span class="chip">I2C</span><span class="chip">Zigbee</span>
    <span class="chip">BLE</span><span class="chip">CAN Bus</span><span class="chip">ADC</span>
    <span class="chip">DMA</span><span class="chip">GPIO / EXTI</span>
  </div>
</div>`,

  'ls projects/': () => `
<div>
<div class="out-pre"><span class="dim">total 11</span>  <button class="shortcut" style="margin-left:8px;font-size:0.72rem;padding:2px 10px;" onclick="runCmd('cat projects/all')">view all</button></div>

<div class="project-category">Embedded Systems & RTOS</div>
<div class="out-pre">  <span class="project-link" onclick="openProject('freertos')">freertos/</span>            <span class="dim">— RTOS scheduling (RM & EDF) on ARM Cortex-M0</span>
  <span class="project-link" onclick="openProject('rtos-fault')">rtos-fault/</span>          <span class="dim">— Multithreaded LED control & fault management</span>
  <span class="project-link" onclick="openProject('gpio-analysis')">gpio-analysis/</span>       <span class="dim">— Real-time GPIO response analysis on RPi 4B</span>
  <span class="project-link" onclick="openProject('img-stab')">img-stab/</span>            <span class="dim">— Image stabilization with ARM NEON SIMD</span>
</div>

<div class="project-category">Microarchitecture</div>
<div class="out-pre">  <span class="project-link" onclick="openProject('cache-sim')">cache-sim/</span>           <span class="dim">— Cache & Stream-Buffer Prefetch Simulator</span>
  <span class="project-link" onclick="openProject('branch-predictor')">branch-predictor/</span>    <span class="dim">— Configurable branch predictor simulator in C++</span>
  <span class="project-link" onclick="openProject('ooo-processor')">ooo-processor/</span>       <span class="dim">— 9-stage out-of-order processor simulator</span>
</div>

<div class="project-category">Compiler & Operating Systems</div>
<div class="out-pre">  <span class="project-link" onclick="openProject('matrix-reloaded')">matrix-reloaded/</span>     <span class="dim">— Compiler with Flex/Bison & LLVM IR</span>
  <span class="project-link" onclick="openProject('xinu')">xinu/</span>                <span class="dim">— Xinu OS kernel extensions (fork, schedulers)</span>
</div>

<div class="project-category">IoT & Sensor Networks</div>
<div class="out-pre">  <span class="project-link" onclick="openProject('care-link')">care-link/</span>           <span class="dim">— IoT fall detection system</span>
</div>

<div class="project-category">Power Electronics</div>
<div class="out-pre">  <span class="project-link" onclick="openProject('mppt')">mppt/</span>                <span class="dim">— MPPT DC-DC converter for photovoltaic systems</span>
</div>

<div class="dim" style="margin-top:8px">Click a project name or type <span class="cyan">cat projects/&lt;name&gt;</span> to view specific project, or click <span class="cyan">view all</span> to view all details.</div>
</div>`,

  'cat projects/all': () => [
    'freertos', 'rtos-fault', 'gpio-analysis', 'img-stab',
    'care-link', 'attention-hw', 'cache-sim', 'branch-predictor', 'ooo-processor',
    'matrix-reloaded', 'xinu', 'mppt'
  ].map(name => COMMANDS[`cat projects/${name}`]()).join('') +
    `<div class="dim" style="margin-top:16px; margin-bottom:8px;">Tip: To close all projects at once, type <span class="cyan">clear</span> or press <span class="cyan">Ctrl+L</span>.</div>`,

  /* ═══ PROJECT DETAILS ═══════════════════════════════════ */

  'cat projects/freertos': () => `
<div class="project-card">
  <button class="project-close" onclick="closeBlock(this)" title="Close">✕</button>
  <div class="project-title">FreeRTOS Scheduling Algorithms on ARM Cortex-M0</div>
  <ul class="project-bullets">
    <li>
      Implemented Rate-Monotonic and Earliest Deadline First scheduling on STM32F091RC by
      modifying FreeRTOS kernel internals including the Task Control Block, ready-list, and
      context-switch routine for deadline-aware scheduling.
    </li>
    <li>
      Validated RM schedulability (U=0.494, hyper-period=12s) via fixed-point RTA and 100Hz UART
      tick traces. Confirmed WCRTs (R₁=10, R₂=15, R₃=47, R₄=162 ticks) and reproduced deadline
      violations under overload (U=1.20).
    </li>
    <li>
      Engineered a mixed real-time workload achieving 55.8% periodic utilization, integrating
      interrupt-driven sporadic task activation via GPIO EXTI on PC13 with software debouncing.
    </li>
  </ul>
  <div class="project-meta">
    <div>Stack: <span>C · FreeRTOS </span></div>
    <div>Hardware: <span>STM32F091RC · SSD1306 OLED I2C display </span></div>
    <div>GitHub: <span><a href="https://github.com/abhay202/Real_System_Project" target="_blank" rel="noopener" class="cyan" style="display: inline-flex; align-items: center; gap: 4px; vertical-align: middle;" title="GitHub Repository"><svg viewBox="0 0 16 16" width="14" height="14" fill="currentColor" style="vertical-align: middle;"><path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.013 8.013 0 0016 8c0-4.42-3.58-8-8-8z"/></svg></a></span></div>
  </div>
</div>`,

  'cat projects/rtos-fault': () => `
<div class="project-card">
  <button class="project-close" onclick="closeBlock(this)" title="Close">✕</button>
  <div class="project-title">RTOS-Based Multithreaded LED Control & Fault Management</div>
  <ul class="project-bullets">
    <li>
      Developed a real-time embedded system on the Cortex-M0+ based KL25Z, integrating a buck
      converter, LCD, and Analog Discovery 2 to measure LED current, adjust brightness based on
      tilt, and update the LCD in real-time.
    </li>
    <li>
      Integrated RTOS-based synchronization for stable waveform display and mutex-protected
      LCD updates with 125 µs acquisition time and 193 critical sections averaging 186 µs duration.
    </li>
    <li>
      Engineered a 10-fault management system addressing stack overflow, disabled IRQs, PWM
      timer corruption, and mutex deadlock using a 1 kHz watchdog timer with 1024-count overflow,
      achieving fault detection within 41.667 µs and automatic recovery within 1 second.
    </li>
  </ul>
  <div class="project-meta">
    <div>Stack: <span>C · freeRTOS · Makefile </span></div>
    <div>Hardware: <span>ARM Cortex-M0+ (KL25Z) . ST7789 LCD screen . Analog Discovery 3 </span></div>
    <div>GitHub: <span><a href="https://github.com/abhay202/RTOS-Fault-Management" target="_blank" rel="noopener" class="cyan" style="display: inline-flex; align-items: center; gap: 4px; vertical-align: middle;" title="GitHub Repository"><svg viewBox="0 0 16 16" width="14" height="14" fill="currentColor" style="vertical-align: middle;"><path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.013 8.013 0 0016 8c0-4.42-3.58-8-8-8z"/></svg></a></span></div>
  </div>
</div>`,

  'cat projects/gpio-analysis': () => `
<div class="project-card">
  <button class="project-close" onclick="closeBlock(this)" title="Close">✕</button>
  <div class="project-title">Real-Time GPIO Input/Output Response Analysis</div>
  <ul class="project-bullets">
    <li>
      Analyzed GPIO event detection on Raspberry Pi 4B by comparing polling and event-driven
      methods (gpiomon, memory-mapped I/O, and kernel interrupts with high-resolution timers)
      to benchmark latency and optimize real-time performance.
    </li>
    <li>
      Achieved response times of 98.23 ns (polling), 4.369 µs (kernel interrupts), and 2.003 ms
      (user-space gpiomon), demonstrating trade-offs between high-speed detection, CPU utilization,
      and system responsiveness.
    </li>
    <li>
      Polling-based methods reach 100% CPU usage, while event-driven approaches maintained
      efficiency at less than 8%, highlighting scalability for embedded real-time systems.
    </li>
  </ul>
  <div class="project-meta">
    <div>Stack: <span>C · Makefile </span></div>
    <div>Hardware: <span>RPi 4 Model B</span></div>
    <div>GitHub: <span><a href="https://github.com/abhay202/Input-Output-Response-Time" target="_blank" rel="noopener" class="cyan" style="display: inline-flex; align-items: center; gap: 4px; vertical-align: middle;" title="GitHub Repository"><svg viewBox="0 0 16 16" width="14" height="14" fill="currentColor" style="vertical-align: middle;"><path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.013 8.013 0 0016 8c0-4.42-3.58-8-8-8z"/></svg></a></span></div>
  </div>
</div>`,

  'cat projects/img-stab': () => `
<div class="project-card">
  <button class="project-close" onclick="closeBlock(this)" title="Close">✕</button>
  <div class="project-title">Image Stabilization — Scalar & ARM NEON SIMD Vectorization</div>
  <ul class="project-bullets">
    <li>
      Utilized Raspberry Pi 4 Model B with ARM Cortex-A72 at 1.5 GHz, achieving an initial
      baseline execution time of ~21 ms/frame for real-time YUV image stabilization tasks.
    </li>
    <li>
      Enhanced processing performance by 65%, reducing frame execution time from 21 ms to 7.5 ms
      through scalar optimizations — removing redundant memory operations, restructuring loops
      for cache efficiency, and simplifying control flow.
    </li>
    <li>
      Achieved a 75% performance boost by applying ARM NEON SIMD vectorization, using techniques
      like parallelized color matching and bulk pixel processing, reducing runtime to ~1.9 ms/frame.
    </li>
  </ul>
  <div class="project-meta">
    <div>Stack: <span>C  · Python</span></div>
    <div> Hardware: <span> Rpi MOdel 4B</span></div>
    <div>GitHub: <span><a href="https://github.com/abhay202/Image_Stabilizer" target="_blank" rel="noopener" class="cyan" style="display: inline-flex; align-items: center; gap: 4px; vertical-align: middle;" title="GitHub Repository"><svg viewBox="0 0 16 16" width="14" height="14" fill="currentColor" style="vertical-align: middle;"><path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.013 8.013 0 0016 8c0-4.42-3.58-8-8-8z"/></svg></a></span></div>
  </div>
</div>`,

  'cat projects/care-link': () => `
<div class="project-card">
  <button class="project-close" onclick="closeBlock(this)" title="Close">✕</button>
  <div class="project-title">Care-Link IoT Fall Detection System</div>
  <ul class="project-bullets">
    <li>
      Designed a multi-node IoT system across heterogeneous hardware — NodeMCU ESP8266
      for real-time heart rate monitoring at 100 Hz using MAX3010x pulse sensor, and Arduino Uno
      for sound amplitude detection at 150 Hz, transmitting synchronized sensor streams.
    </li>
    <li>
      Developed a Raspberry Pi-based data collection and MQTT publish pipeline in Python to
      aggregate multi-sensor data into structured CSV datasets for downstream ML model training
      and real-time inference through a subscriber-based architecture.
    </li>
    <li>
      Built an end-to-end ML pipeline integrating IMU training data with multi-sensor inputs,
      demonstrating a complete edge-to-cloud IoT workflow across embedded, single-board, and
      laptop computing tiers.
    </li>
  </ul> 
  <div class="project-meta">
    <div>Stack: <span>Python · C/C++</span></div>
    <div>Hardware: <span>ESP8266 · Arduino · RPi 4B · IMU · MAX3010x pulse sensor · Sound sensor</span></div>
    <div>GitHub: <span><a href="https://github.com/abhay202/Care-Link-IoT" target="_blank" rel="noopener" class="cyan" style="display: inline-flex; align-items: center; gap: 4px; vertical-align: middle;" title="GitHub Repository"><svg viewBox="0 0 16 16" width="14" height="14" fill="currentColor" style="vertical-align: middle;"><path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.013 8.013 0 0016 8c0-4.42-3.58-8-8-8z"/></svg></a></span></div>
  </div>
</div>`,

  'cat projects/ooo-processor': () => `
<div class="project-card">
  <button class="project-close" onclick="closeBlock(this)" title="Close">✕</button>
  <div class="project-title">Out-of-Order Superscalar Processor for Dynamic Instruction Scheduling</div>
  <ul class="project-bullets">
    <li>
      Designed and implemented a cycle-accurate out-of-order superscalar processor simulator in C++
      featuring a 9-stage pipeline with configurable superscalar width (up to 7-wide), Reorder Buffer (up to
      512 entries), and Issue Queue depth for exploring performance - complexity tradeoffs.
    </li>
    <li>
      Engineered dynamic scheduling with ROB-tag-based register renaming, multi-stage wakeup broadcasting
      (Issue Queue, Dispatch, and Register Read), and oldest-first issue policy to extract maximum
      instruction-level parallelism from SPEC benchmark traces.
    </li>
    <li>
      Implemented precise per-instruction timing across all 9 pipeline stages with stall-aware duration
      tracking, reverse-order stage execution for single-cycle resource forwarding, and in-order
      retirement with Rename Map Table cleanup to maintain correct architectural state.
    </li>
    <li>
      Identified and resolved a critical pipeline deadlock where premature ROB ready-flag invalidation
      on retirement starved late-arriving consumers, implementing a deferred-reset scheme that preserves
      producer readiness until ROB entry reallocation.
    </li>
    <li>
      Validated simulator correctness across 8 benchmark configurations with reference outputs,
      demonstrating IPC scaling from 0.97 for single-issue and 16-entry ROB to 6.24 for 7-wide and
      512-entry ROB, resulting in a 6.4 times throughput improvement.
    </li>
  </ul>
  <div class="project-meta">
    <div>Stack: <span>C++ · Bash</span></div>
    <div>GitHub: <span><a href="https://github.com/abhay202/Nine-Stage-out-of-order-simulator" target="_blank" rel="noopener" class="cyan" style="display: inline-flex; align-items: center; gap: 4px; vertical-align: middle;" title="GitHub Repository"><svg viewBox="0 0 16 16" width="14" height="14" fill="currentColor" style="vertical-align: middle;"><path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.013 8.013 0 0016 8c0-4.42-3.58-8-8-8z"/></svg></a></span></div>
  </div>
</div>`,

  'cat projects/cache-sim': () => `
<div class="project-card">
  <button class="project-close" onclick="closeBlock(this)" title="Close">✕</button>
  <div class="project-title">Cache and Stream-Buffer Prefetch Simulator</div>
  <ul class="project-bullets">
    <li>
      Designed and implemented a configurable memory hierarchy simulator in C++ supporting L1-only, L1+L2, and stream-buffer prefetching configurations using real SPEC 2006/2017 benchmark traces.
    </li>
    <li>
      Engineered a stream-buffer prefetch unit with N buffers and M-block capacity, handling all four cache/prefetch interaction scenarios (demand miss, prefetch hit, cache hit, simultaneous hit) with LRU replacement policy.
    </li>
    <li>
      Reduced effective L1 miss rate from 19.2% to 15.5% and L2 miss rate from 30.9% to 12.4% through stream-buffer prefetching, validated against reference outputs across 8 benchmark configurations.
    </li>
    <li>
      Modeled write-back, write-allocate cache semantics with LRU eviction, dirty-block writebacks, and accurate memory traffic accounting across multi-level hierarchies.
    </li>
    <li>
      Tracked and reported 17 performance metrics per simulation run including miss rates, writebacks, demand vs. prefetch reads, and total memory traffic for performance analysis.
    </li>
  </ul>
  <div class="project-meta">
    <div>Stack: <span>C++ · Bash</span></div>
    <div>GitHub: <span><a href="https://github.com/abhay202/Cache-and-Stream-Buffer-Prefetch-Simulator" target="_blank" rel="noopener" class="cyan" style="display: inline-flex; align-items: center; gap: 4px; vertical-align: middle;" title="GitHub Repository"><svg viewBox="0 0 16 16" width="14" height="14" fill="currentColor" style="vertical-align: middle;"><path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.013 8.013 0 0016 8c0-4.42-3.58-8-8-8z"/></svg></a></span></div>
  </div>
</div>`,

  'cat projects/branch-predictor': () => `
<div class="project-card">
  <button class="project-close" onclick="closeBlock(this)" title="Close">✕</button>
  <div class="project-title">Configurable Branch Predictor Simulator</div>
  <ul class="project-bullets">
    <li>
      Designed and implemented a configurable branch predictor simulator in C++ supporting Bimodal,
      Gshare, and Hybrid prediction schemes, processing instruction traces to evaluate prediction
      accuracy across different hardware configurations.
    </li>
    <li>
      Engineered a Gshare predictor with XOR-based index hashing that combines N-bit global
      Branch History Register with PC bits to capture both spatial and temporal branch correlation,
      reducing destructive aliasing compared to direct-mapped approaches.
    </li>
    <li>
      Built a McFarling-style hybrid tournament predictor with a dynamic chooser table that teaches
      per-branch which predictor performs better, using selective table updates to prevent pollution
      of the unchosen predictor's learned patterns.
    </li>
    <li>
      Modeled 2-bit saturating counter mechanics with configurable table sizes of 2^M entries,
      word-aligned PC indexing, and proper counter hysteresis to filter prediction noise, with full
      output of final predictor state for validation against reference outputs.
    </li>
  </ul>
  <div class="project-meta">
    <div>Stack: <span>C++ · Bash</span></div>
    <div>GitHub: <span><a href="https://github.com/abhay202/Branch_Predictor" target="_blank" rel="noopener" class="cyan" style="display: inline-flex; align-items: center; gap: 4px; vertical-align: middle;" title="GitHub Repository"><svg viewBox="0 0 16 16" width="14" height="14" fill="currentColor" style="vertical-align: middle;"><path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.013 8.013 0 0016 8c0-4.42-3.58-8-8-8z"/></svg></a></span></div>
  </div>
</div>`,

  'cat projects/matrix-reloaded': () => `
<div class="project-card">
  <button class="project-close" onclick="closeBlock(this)" title="Close">✕</button>
  <div class="project-title">Matrix Reloaded Compiler</div>
  <ul class="project-bullets">
    <li>
      Designed a domain-specific language compiler using Flex/Bison and LLVM IR to support matrix
      operations like inverse, determinant, and arithmetic operations.
    </li>
    <li>
      Refactored codebase to modularize repetitive IR generation logic and integrated matrix support
      via Eigen, reducing static instructions to 243 and achieving top 3 performance in the class.
    </li>
    <li>
      Demonstrated low-level systems skills through debugging, IR verification, and function
      prototype generation using LLVM APIs.
    </li>
  </ul>
  <div class="project-meta">
    <div>Stack: <span>C · Flex · Bison</span></div>
    <div>Rank: <span>Top 3 in class</span></div>
    <div>GitHub: <span><a href="https://github.com/umi001/Matrix_Reloaded" target="_blank" rel="noopener" class="cyan" style="display: inline-flex; align-items: center; gap: 4px; vertical-align: middle;" title="GitHub Repository"><svg viewBox="0 0 16 16" width="14" height="14" fill="currentColor" style="vertical-align: middle;"><path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.013 8.013 0 0016 8c0-4.42-3.58-8-8-8z"/></svg></a></span></div>
  </div>
</div>`,

  'cat projects/xinu': () => `
<div class="project-card">
  <button class="project-close" onclick="closeBlock(this)" title="Close">✕</button>
  <div class="project-title">Xinu OS Kernel Extensions</div>
  <ul class="project-bullets">
    <li>
      Extended the Xinu OS kernel by implementing cascading termination with a user_process PCB
      flag, redesigning kill() to recursively terminate child processes, and developing a Unix-style
      fork() system call that duplicates parent stack frames and execution context.
    </li>
    <li>
      Implemented Lottery Scheduling by modifying the scheduler to allocate CPU time proportional
      to ticket count with PID-based tie-breaking, and Multi-Level Feedback Queue (MLFQ) scheduling
      with configurable priority levels, doubling time allotments per level, and periodic priority boost.
    </li>
    <li>
      Designed and validated 15+ process test suites covering cascading termination, fork behavior,
      and scheduler fairness — conducting turnaround time ratio analysis (F = T₁/T₂) across
      increasing workloads to verify probabilistic fairness convergence.
    </li>
  </ul>
  <div class="project-meta">
    <div>Stack: <span>C · Xinu OS </span></div>
    <div>GitHub: <span><a href="https://github.com/abhay202/Xinu-Kernel-Extensions" target="_blank" rel="noopener" class="cyan" style="display: inline-flex; align-items: center; gap: 4px; vertical-align: middle;" title="GitHub Repository"><svg viewBox="0 0 16 16" width="14" height="14" fill="currentColor" style="vertical-align: middle;"><path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.013 8.013 0 0016 8c0-4.42-3.58-8-8-8z"/></svg></a></span></div>
  </div>
</div>`,

  'cat projects/mppt': () => `
<div class="project-card">
  <button class="project-close" onclick="closeBlock(this)" title="Close">✕</button>
  <div class="project-title">MPPT DC-DC Converter for Photovoltaic Systems</div>
  <ul class="project-bullets">
    <li>
      Designed and developed a 1.5 kW photovoltaic MPPT system using a boost DC-DC converter,
      modeling the power stage in MATLAB and achieving ~96.5% tracking efficiency with the
      Incremental Conductance (IC) algorithm during hardware testing.
    </li>
    <li>
      Implemented Arduino-based MPPT firmware with switchable IC and P&amp;O algorithms, validated
      across 100–1000 W/m² irradiance and 20–50 °C, with IC demonstrating faster MPP convergence
      and ~6% higher efficiency than P&amp;O.
    </li>
    <li>
      Engineered a 20 kHz boost converter with analytically sized 190 µH inductor and ≥80 µF
      capacitor to limit ripple; specified IGBT, diode, and TLP250 gate driver, verified &lt;9 V ripple
      and 30 A peak current.
    </li>
  </ul>
  <div class="project-meta">
    <div>Stack: <span>C · Arduino · MATLAB</span></div>
  </div>
</div>`,

  /* ═══ EXPERIENCE & CONTACT ══════════════════════════════ */

  'cat experience.md': () => `
<div>
  <div class="out-h">Work Experience</div>

  <div class="exp-card">
    <div class="exp-header">
      <div>
        <span class="exp-title">Firmware Development Co-op</span>
        <span class="exp-company"> — Nokia</span>
      </div>
      <span class="exp-date">Jan 2026 - May 2026</span>
    </div>
    <div class="exp-location">San Jose, California</div>
    <ul class="exp-bullets">
      <li>Designed boot-time SHA-256 integrity verification on AMCU to prevent boot into SEU-corrupted firmware with distinct running-image vs target-image failure paths, CRITICAL logging, and host-visible I2C status register updates.</li>
      <li>Built and validated C++ API interfaces for firmware driver commands, including SDK-based device queries and Doctest automated unit tests covering response integrity, version format parsing, and error handling.</li>
      <li>Consolidated OIF-TROSA and Nokia-specific I2C register definitions into a unified shared header to eliminate cross-module duplication across multi-target builds.</li>
      <li>Applied perfector generation to produce one .c/.h file per object, replacing monolithic objectdef.c. Developed Bash git pre-commit hooks and built a shared Firmware Template repository for new optical product lines.</li>
    </ul>
  </div>

  <div class="exp-card">
    <div class="exp-header">
      <div>
        <span class="exp-title">Embedded Software Intern</span>
        <span class="exp-company"> — Digineous Technologies</span>
      </div>
      <span class="exp-date">Aug 2023 - Feb 2024</span>
    </div>
    <div class="exp-location">Pune, India</div>
    <ul class="exp-bullets">
      <li>Developed low-level firmware for STM32WB interfacing vibration (I2C), temperature (ADC), and pressure (I2C) sensors using HAL drivers with Zigbee-based wireless transmission.</li>
      <li>Established gateway communication between embedded hardware and cloud using Zigbee protocol, improving data transmission efficiency by 40% and implementing machine fault alert systems for reduced downtime.</li>
    </ul>
  </div>
  <div class="exp-card">
    <div class="exp-header">
      <div>
        <span class="exp-title">Research Intern</span>
        <span class="exp-company"> — BARC (Bhabha Atomic Research Centre)</span>
      </div>
      <span class="exp-date">Dec 2022 - May 2023</span>
    </div>
    <div class="exp-location">Mumbai, Maharashtra, India · On-site</div>
    <ul class="exp-bullets">
      <li>Designed a PID-controlled trigger-pulse PCB using an ATmega328, integrating with SCR configurations in a water-cooled 12-pulse rectifier system and achieving a 20% reduction in energy consumption across installed rectifiers.</li>
      <li>Led end-to-end testing and validation of battery unit circuits, researching and deploying strategies to minimize energy usage in rectifier units — resulting in measurable performance gains and strict adherence to quality standards.</li>
    </ul>
  </div>
  <div class="dim" style="margin-top:10px">Run <span class="cyan">cat education.md</span> or click on education in navigation bar to view academic background.</div>
</div>`,

  'cat education.md': () => `
<div>
  <div class="out-h"> Education</div>

  <div class="edu-card">
    <div class="edu-header">
      <span class="edu-school">North Carolina State University</span>
      <span class="edu-date">Aug 2024 -  May 2026</span>
    </div>
    <div class="edu-degree">Master of Science, Computer Engineering</div>
    <div class="edu-gpa">GPA: 3.65 / 4.00</div>
  </div>

  <div class="edu-card">
    <div class="edu-header">
      <span class="edu-school">Vellore Institute of Technology</span>
      <span class="edu-date">Jul 2019 - Jul 2023</span>
    </div>
    <div class="edu-degree">B.Tech, Electrical and Electronics Engineering</div>
    <div class="edu-gpa">GPA: 8.94 / 10.00</div>
  </div>

  <div class="out-h" style="margin-top:14px"> Relevant Coursework</div>
  <div class="chips">
    <span class="chip">Embedded System Architecture</span>
    <span class="chip">Operating System Design</span>
    <span class="chip">Real Time Computer System (freeRTOS)</span>
    <span class="chip">Advanced Embedded System Design</span>
    <span class="chip">Compiler Optimization and Scheduling</span>
    <span class="chip">Internet of Things: Application and Implementation</span>
    <span class="chip">Digital Circuit Design</span>
    <span class="chip">Microprocessors and Microcontrollers</span>
  </div>
  <div class="dim" style="margin-top:20px">Run <span class="cyan">ls projects/</span> or click on projects in navigation bar to view projects (click <span class="cyan">view all</span> to see all descriptions).</div>
</div>`,

  'cat contact.md': () => `
<div>
  <div class="out-h">Contact</div>
  <div class="kv-row"><span class="kv-key">Email</span><span class="kv-value"><a class="cyan" href="mailto:apsengar@ncsu.edu">apsengar@ncsu.edu</a></span></div>
  <div class="kv-row"><span class="kv-key">Phone</span><span class="kv-value cyan">984-382-9404</span></div>
  <div class="kv-row"><span class="kv-key">LinkedIn</span><span class="kv-value"><a class="cyan" href="https://www.linkedin.com/in/abhay-sengar2412/" target="_blank" rel="noopener">linkedin.com/in/abhay-sengar2412</a></span></div>
  <div class="kv-row"><span class="kv-key">GitHub</span><span class="kv-value"><a class="cyan" href="https://github.com/abhay202" target="_blank" rel="noopener">github.com/abhay202</a></span></div>
  <div class="kv-row"><span class="kv-key">Location</span><span class="kv-value">San Jose, CA</span></div>
  <br>
  <div class="out-dim">Currently open to full-time opportunities in firmware engineering, embedded systems, and RTOS development. Let's connect!</div>
</div>`,

  'uname -a': () => `
<div class="out-pre green">Linux abhay-portfolio 3.65-ncstate-LTS #1 SMP PREEMPT_RT ARM Cortex-M0+ FreeRTOS/Nokia x86_64 GNU/Linux</div>`,

  'clear': () => {
    output.innerHTML = '';
    return null;
  },
  'play': () => {
    const gameId = ++shooterGameCount;
    setTimeout(() => initShooterGame(gameId), 50);
    return renderShooterBoard(gameId);
  },
  'shooter': () => COMMANDS['play'](),
  'tictactoe': () => {
    const gameId = ++tttGameCount;
    return renderTTTBoard(gameId, Array(9).fill(' '));
  },
  'whoami': () => COMMANDS['cat whoami.md'](),
  'cat skills.txt': () => COMMANDS['cat skills.md'](),
  'cat contact.txt': () => COMMANDS['cat contact.md'](),
};

/* ── Command runner ───────────────────────────────────────── */
function runCmd(raw) {
  const cmd = raw.trim();
  const lowerCmd = cmd.toLowerCase();
  if (COMMANDS[lowerCmd]) {
    const result = COMMANDS[lowerCmd]();
    if (result !== null) appendBlock(result, cmd);
  } else {
    appendBlock(
      `<div class="err-line">bash: ${escHtml(cmd)}: command not found</div>
  <div class="dim">Type <span class="cyan">help</span> to see available commands.</div>`,
      cmd
    );
  }
}

/* ═══════════════════════════════════════════════════════════
   0 and 1 TIC TAC TOE GAME ENGINE
   ═══════════════════════════════════════════════════════════ */
let tttGameCount = 0;

function renderTTTBoard(gameId, board, statusText = "Your turn! Click a cell to place '1'.") {
  const cell = (idx) => {
    const val = board[idx];
    if (val === ' ') {
      return `<button class="ttt-cell" onclick="makeTTTMove(${gameId}, ${idx}, '${board.join('')}')">·</button>`;
    } else {
      const cls = val === '1' ? 'green bold' : 'yellow bold';
      return `<span class="ttt-cell-taken ${cls}">${val}</span>`;
    }
  };

  return `
<div class="ttt-container" id="ttt-game-${gameId}">
  <style>
    .ttt-container {
      margin: 10px 0;
      padding: 14px;
      background: var(--bg1);
      border: 1px solid var(--bg3);
      border-radius: var(--radius-sm);
      display: inline-block;
      min-width: 200px;
    }
    .ttt-board {
      display: grid;
      grid-template-columns: repeat(3, 40px);
      grid-gap: 6px;
      margin: 12px 0;
    }
    .ttt-cell {
      width: 40px;
      height: 40px;
      background: var(--bg2);
      border: 1px solid var(--bg3);
      color: var(--fg-dim);
      font-family: var(--font-mono);
      font-size: 1.2rem;
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: center;
      border-radius: 4px;
      transition: background 0.15s, border-color 0.15s;
    }
    .ttt-cell:hover {
      background: var(--bg3);
      border-color: var(--bright-green);
      color: var(--bright-green);
    }
    .ttt-cell-taken {
      width: 40px;
      height: 40px;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 1.4rem;
      border: 1px solid var(--bg3);
      background: var(--bg1);
      border-radius: 4px;
    }
    .ttt-row {
      display: contents;
    }
  </style>
  <div class="out-h" style="margin-top: 0;">0 and 1 Tic-Tac-Toe</div>
  <div class="ttt-status dim" style="font-size: 0.8rem; line-height: 1.4;">${statusText}</div>
  <div class="ttt-board">
    ${cell(0)} ${cell(1)} ${cell(2)}
    ${cell(3)} ${cell(4)} ${cell(5)}
    ${cell(6)} ${cell(7)} ${cell(8)}
  </div>
  <button class="shortcut" style="font-size: 0.72rem; padding: 2px 8px;" onclick="resetTTT(${gameId})">Restart</button>
</div>`;
}

window.makeTTTMove = function (gameId, playerIdx, boardStr) {
  let board = boardStr.split('');
  board[playerIdx] = '1';

  if (checkTTTWin(board, '1')) {
    updateTTTUI(gameId, board, "🎉 Player '1' wins!");
    return;
  }

  if (!board.includes(' ')) {
    updateTTTUI(gameId, board, "👔 It's a tie!");
    return;
  }

  const emptyIndices = board.map((val, idx) => val === ' ' ? idx : null).filter(val => val !== null);
  if (emptyIndices.length > 0) {
    const cpuIdx = getBestTTTMove(board, '0', '1') ?? emptyIndices[Math.floor(Math.random() * emptyIndices.length)];
    board[cpuIdx] = '0';

    if (checkTTTWin(board, '0')) {
      updateTTTUI(gameId, board, "💻 Computer '0' wins!");
      return;
    }
  }

  if (!board.includes(' ')) {
    updateTTTUI(gameId, board, "👔 It's a tie!");
    return;
  }

  updateTTTUI(gameId, board, "Your turn! Click a cell to place '1'.");
};

window.checkTTTWin = function (board, char) {
  const winLines = [
    [0, 1, 2], [3, 4, 5], [6, 7, 8],
    [0, 3, 6], [1, 4, 7], [2, 5, 8],
    [0, 4, 8], [2, 4, 6]
  ];
  return winLines.some(line => line.every(idx => board[idx] === char));
};

window.getBestTTTMove = function (board, cpuChar, playerChar) {
  const winLines = [
    [0, 1, 2], [3, 4, 5], [6, 7, 8],
    [0, 3, 6], [1, 4, 7], [2, 5, 8],
    [0, 4, 8], [2, 4, 6]
  ];

  for (let line of winLines) {
    const chars = line.map(idx => board[idx]);
    if (chars.filter(c => c === cpuChar).length === 2 && chars.filter(c => c === ' ').length === 1) {
      return line[chars.indexOf(' ')];
    }
  }

  for (let line of winLines) {
    const chars = line.map(idx => board[idx]);
    if (chars.filter(c => c === playerChar).length === 2 && chars.filter(c => c === ' ').length === 1) {
      return line[chars.indexOf(' ')];
    }
  }

  if (board[4] === ' ') return 4;
  return null;
};

window.updateTTTUI = function (gameId, board, statusText) {
  const gameEl = document.getElementById(`ttt-game-${gameId}`);
  if (gameEl) {
    gameEl.outerHTML = renderTTTBoard(gameId, board, statusText);
  }
};

window.resetTTT = function (gameId) {
  updateTTTUI(gameId, Array(9).fill(' '), "Game restarted! Click a cell to place '1'.");
};

/* ═══════════════════════════════════════════════════════════
   FIRMWARE BUG DEFENDER GAME ENGINE (TERMINAL SHOOTER)
   ═══════════════════════════════════════════════════════════ */
let shooterGameCount = 0;
let shooterGames = {};

// Web Audio Synth for 8-bit retro sound effects
let shooterAudioCtx = null;
function getShooterAudioCtx() {
  if (!shooterAudioCtx) {
    shooterAudioCtx = new (window.AudioContext || window.webkitAudioContext)();
  }
  if (shooterAudioCtx.state === 'suspended') {
    shooterAudioCtx.resume();
  }
  return shooterAudioCtx;
}

window.playShooterSound = function (type) {
  try {
    const ctx = getShooterAudioCtx();
    if (!ctx) return;

    const now = ctx.currentTime;

    if (type === 'laser') {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(350, now);
      osc.frequency.exponentialRampToValueAtTime(1000, now + 0.1);
      gain.gain.setValueAtTime(0.06, now);
      gain.gain.exponentialRampToValueAtTime(0.005, now + 0.1);
      osc.start(now);
      osc.stop(now + 0.1);
    } else if (type === 'hit') {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(160, now);
      osc.frequency.linearRampToValueAtTime(30, now + 0.15);
      gain.gain.setValueAtTime(0.1, now);
      gain.gain.exponentialRampToValueAtTime(0.005, now + 0.15);
      osc.start(now);
      osc.stop(now + 0.15);
    } else if (type === 'gameover') {
      const notes = [440, 392, 349, 293]; // A4, G4, F4, D4
      notes.forEach((freq, idx) => {
        const o = ctx.createOscillator();
        const g = ctx.createGain();
        o.connect(g);
        g.connect(ctx.destination);
        o.type = 'sawtooth';
        o.frequency.setValueAtTime(freq, now + idx * 0.12);
        g.gain.setValueAtTime(0.08, now + idx * 0.12);
        g.gain.exponentialRampToValueAtTime(0.005, now + idx * 0.12 + 0.18);
        o.start(now + idx * 0.12);
        o.stop(now + idx * 0.12 + 0.18);
      });
    }
  } catch (e) {
    // Fail silently if blocked or unsupported
  }
};

// Local storage high score persistence
window.getShooterHighScore = function () {
  try {
    return parseInt(localStorage.getItem('bug_defender_highscore') || '0', 10);
  } catch (e) {
    return 0;
  }
};

window.saveShooterHighScore = function (score) {
  try {
    const currentHigh = getShooterHighScore();
    if (score > currentHigh) {
      localStorage.setItem('bug_defender_highscore', score.toString());
    }
  } catch (e) { }
};

window.renderShooterBoard = function (gameId) {
  return `
<div class="ttt-container shooter-container" id="shooter-game-${gameId}" style="max-width: 270px; text-align: left;" tabindex="0">
  <style>
    .shooter-container {
      margin: 10px 0;
      padding: 14px;
      background: var(--bg1);
      border: 1px solid var(--bg3);
      border-radius: var(--radius-sm);
      display: inline-block;
      width: 100%;
      outline: none;
      transition: border-color 0.2s, box-shadow 0.2s;
    }
    .shooter-container:focus-within {
      border-color: var(--bright-green);
      box-shadow: 0 0 14px rgba(78, 201, 86, 0.4);
    }
    .shooter-canvas-wrapper {
      position: relative;
      background: #000;
      border: 1px solid var(--bg3);
      border-radius: 6px;
      overflow: hidden;
      margin: 12px 0 8px;
      cursor: crosshair;
      width: 240px;
      height: 360px;
    }
    .shooter-canvas {
      display: block;
      background: #05070a;
    }
    .shooter-btn {
      width: 100%;
      padding: 6px 12px;
      background: var(--bg2);
      border: 1px solid var(--bg3);
      color: var(--bright-green);
      font-size: 0.8rem;
      cursor: pointer;
      border-radius: 4px;
      transition: all 0.15s;
      text-transform: uppercase;
      font-weight: bold;
      text-align: center;
      display: block;
      box-sizing: border-box;
    }
    .shooter-btn:hover {
      background: var(--bg3);
      border-color: var(--bright-green);
      color: var(--fg);
    }
  </style>
  <div class="out-h" style="margin-top: 0; font-size: 1.05rem;">Firmware Bug Defender</div>
  <div class="dim" style="font-size: 0.76rem; margin-bottom: 4px; line-height: 1.4;">
    Slide <span class="cyan">Mouse / Touch</span> on board or use <span class="cyan">A / D / Arrows</span>. Auto-fires lasers continuously!
  </div>
  <div class="shooter-canvas-wrapper">
    <canvas id="shooter-canvas-${gameId}" class="shooter-canvas" width="240" height="360"></canvas>
  </div>
  <button class="shooter-btn" onclick="resetShooter(${gameId})">Reboot Core</button>
</div>`;
};

window.initShooterGame = function (gameId) {
  const canvas = document.getElementById(`shooter-canvas-${gameId}`);
  if (!canvas) return;

  const ctx = canvas.getContext('2d');
  if (!ctx) return;

  const game = {
    player: { x: 120, y: 325, width: 28, height: 14, targetX: undefined },
    bullets: [],
    enemies: [],
    particles: [],
    stars: [],
    score: 0,
    highScore: getShooterHighScore(),
    lives: 3,
    level: 1,
    over: false,
    frameId: null,
    keys: {},
    lastFireTime: 0,
    lastSpawnTime: 0
  };

  shooterGames[gameId] = game;

  // Initialize scrolling stars
  for (let i = 0; i < 20; i++) {
    game.stars.push({
      x: Math.random() * 240,
      y: Math.random() * 360,
      speed: Math.random() * 0.4 + 0.15,
      size: Math.random() * 1.5 + 0.5
    });
  }

  // Mouse controls
  canvas.addEventListener('mousemove', e => {
    if (game.over) return;
    const rect = canvas.getBoundingClientRect();
    game.player.targetX = e.clientX - rect.left;
    try { getShooterAudioCtx(); } catch (err) { }
  });

  // Touch controls
  canvas.addEventListener('touchmove', e => {
    if (game.over) return;
    e.preventDefault();
    const rect = canvas.getBoundingClientRect();
    const touch = e.touches[0];
    game.player.targetX = touch.clientX - rect.left;
    try { getShooterAudioCtx(); } catch (err) { }
  }, { passive: false });

  // Keyboard continuous controls
  const container = document.getElementById(`shooter-game-${gameId}`);
  if (container) {
    container.addEventListener('keydown', e => {
      if (game.over) return;
      const key = e.key.toLowerCase();
      if (['arrowleft', 'arrowright', 'a', 'd'].includes(key)) {
        game.keys[key] = true;
        game.player.targetX = undefined; // Override mouse
        e.preventDefault();
        e.stopPropagation();
        try { getShooterAudioCtx(); } catch (err) { }
      }
    });

    container.addEventListener('keyup', e => {
      const key = e.key.toLowerCase();
      if (['arrowleft', 'arrowright', 'a', 'd'].includes(key)) {
        game.keys[key] = false;
        e.preventDefault();
        e.stopPropagation();
      }
    });
  }

  const enemyLabels = [
    { text: "OVF", hp: 1, color: "#e06c75" },  // Stack Overflow
    { text: "BUG", hp: 1, color: "#e06c75" },  // Compiler bug
    { text: "WDT", hp: 2, color: "#d19a66" },  // Watchdog timeout
    { text: "ISR", hp: 1, color: "#e5c07b" },  // Unhandled ISR
    { text: "ERR", hp: 1, color: "#e06c75" },  // Standard Error
    { text: "NULL", hp: 2, color: "#c678dd" }  // Null pointer dereference
  ];

  function spawnEnemy() {
    const label = enemyLabels[Math.floor(Math.random() * enemyLabels.length)];
    game.enemies.push({
      x: Math.random() * 200 + 20,
      y: -20,
      vx: (Math.random() - 0.5) * 0.6,
      vy: Math.random() * 0.5 + 0.6 + (game.level * 0.12),
      width: 24,
      height: 14,
      hp: label.hp,
      maxHp: label.hp,
      text: label.text,
      color: label.color
    });
  }

  function spawnParticles(x, y, count) {
    for (let i = 0; i < count; i++) {
      const angle = Math.random() * Math.PI * 2;
      const speed = Math.random() * 2 + 0.5;
      game.particles.push({
        x: x,
        y: y,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed,
        color: Math.random() < 0.35 ? "#56b6c2" : "#4ec956",
        alpha: 1.0,
        decay: Math.random() * 0.04 + 0.02,
        size: Math.random() * 2.5 + 1.0
      });
    }
  }

  // Animation Loop
  function loop() {
    const currentCanvas = document.getElementById(`shooter-canvas-${gameId}`);
    if (!currentCanvas) {
      if (game.frameId) cancelAnimationFrame(game.frameId);
      delete shooterGames[gameId];
      return;
    }

    if (!game.over) {
      update();
    }
    draw();

    game.frameId = requestAnimationFrame(loop);
  }

  function update() {
    const now = Date.now();

    // 1. Auto-firing core laser
    if (now - game.lastFireTime > 180) {
      game.bullets.push({
        x: game.player.x,
        y: game.player.y - 8,
        vy: -6,
        size: 3
      });
      game.lastFireTime = now;
      playShooterSound('laser');
    }

    // 2. Enemy Spawning based on level progression
    const spawnDelay = Math.max(450, 1100 - (game.level * 100));
    if (now - game.lastSpawnTime > spawnDelay) {
      spawnEnemy();
      game.lastSpawnTime = now;
    }

    // 3. Player horizontal position lerping/sliding
    if (game.player.targetX !== undefined) {
      // Lerp mouse target coordinates
      game.player.x += (game.player.targetX - game.player.x) * 0.32;
    } else {
      // Slide horizontally via keyboard
      const speed = 4.8;
      if (game.keys['a'] || game.keys['arrowleft']) {
        game.player.x -= speed;
      }
      if (game.keys['d'] || game.keys['arrowright']) {
        game.player.x += speed;
      }
    }
    // Clamp player boundaries
    game.player.x = Math.max(game.player.width / 2 + 4, Math.min(240 - game.player.width / 2 - 4, game.player.x));

    // 4. Update background scrolling star field
    game.stars.forEach(s => {
      s.y += s.speed;
      if (s.y > 360) {
        s.y = 0;
        s.x = Math.random() * 240;
      }
    });

    // 5. Update lasers
    game.bullets.forEach((b, idx) => {
      b.y += b.vy;
      if (b.y < -10) {
        game.bullets.splice(idx, 1);
      }
    });

    // 6. Update digital bugs
    game.enemies.forEach((e, idx) => {
      e.y += e.vy;
      e.x += e.vx;

      // Bounce bugs off side walls
      if (e.x <= 12 || e.x >= 228) {
        e.vx = -e.vx;
      }

      // Check if bug slipped through stack (past player border)
      if (e.y > 360) {
        game.enemies.splice(idx, 1);
        game.lives--;
        playShooterSound('hit');

        // Spawn error particles
        spawnParticles(e.x, 340, 12);

        if (game.lives <= 0) {
          game.over = true;
          saveShooterHighScore(game.score);
          playShooterSound('gameover');
        }
      }
    });

    // 7. Update glowing particles
    game.particles.forEach((p, idx) => {
      p.x += p.vx;
      p.y += p.vy;
      p.alpha -= p.decay;
      if (p.alpha <= 0) {
        game.particles.splice(idx, 1);
      }
    });

    // 8. Laser vs Bug collision detection
    game.bullets.forEach((b, bIdx) => {
      game.enemies.forEach((e, eIdx) => {
        const dist = Math.sqrt((b.x - e.x) * (b.x - e.x) + (b.y - e.y) * (b.y - e.y));
        if (dist < 15) {
          // Collision!
          game.bullets.splice(bIdx, 1);
          e.hp--;

          if (e.hp <= 0) {
            game.enemies.splice(eIdx, 1);
            game.score += 10;
            playShooterSound('hit');
            spawnParticles(e.x, e.y, 14);

            // Level progression logic
            const nextLevel = Math.floor(game.score / 100) + 1;
            if (nextLevel > game.level) {
              game.level = nextLevel;
            }
          }
        }
      });
    });
  }

  function draw() {
    // Backdrop space
    ctx.fillStyle = '#04060a';
    ctx.fillRect(0, 0, 240, 360);

    // Draw scrolling stars
    ctx.fillStyle = 'rgba(255, 255, 255, 0.45)';
    game.stars.forEach(s => {
      ctx.fillRect(s.x, s.y, s.size, s.size);
    });

    // Draw particle explosions
    game.particles.forEach(p => {
      ctx.save();
      ctx.globalAlpha = p.alpha;
      ctx.fillStyle = p.color;
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
    });

    // Draw lasers (glow)
    ctx.save();
    ctx.shadowBlur = 6;
    ctx.shadowColor = '#56b6c2';
    ctx.fillStyle = '#56b6c2';
    game.bullets.forEach(b => {
      ctx.fillRect(b.x - 1, b.y, 2, 7);
    });
    ctx.restore();

    // Draw bugs (as glowing register blocks)
    game.enemies.forEach(e => {
      ctx.save();
      ctx.shadowBlur = 4;
      ctx.shadowColor = e.color;
      ctx.strokeStyle = e.color;
      ctx.lineWidth = 1.5;

      // Draw rectangular warning chip
      ctx.strokeRect(e.x - 12, e.y - 7, 24, 14);

      // Draw labeling text
      ctx.fillStyle = e.color;
      ctx.font = 'bold 8px var(--font-mono)';
      ctx.textAlign = 'center';
      ctx.fillText(e.text, e.x, e.y + 3);
      ctx.restore();
    });

    // Draw Player Ship (STM32 CPU chip aesthetic)
    ctx.save();
    ctx.shadowBlur = 8;
    ctx.shadowColor = '#4ec956';

    // Outer border
    ctx.strokeStyle = '#4ec956';
    ctx.lineWidth = 2;
    ctx.strokeRect(game.player.x - 12, game.player.y - 6, 24, 12);

    // Core silicon
    ctx.fillStyle = '#060a0f';
    ctx.fillRect(game.player.x - 11, game.player.y - 5, 22, 10);

    // MCU pins
    ctx.fillStyle = '#56b6c2';
    for (let i = -10; i <= 10; i += 5) {
      // top pins
      ctx.fillRect(game.player.x + i - 1, game.player.y - 8, 2, 2);
      // bottom pins
      ctx.fillRect(game.player.x + i - 1, game.player.y + 6, 2, 2);
    }
    ctx.restore();

    // Draw HUD metrics
    ctx.fillStyle = 'rgba(255, 255, 255, 0.45)';
    ctx.font = 'bold 9px var(--font-mono)';
    ctx.fillText(`LVL:${game.level}`, 6, 15);
    ctx.fillText(`HIGH:${game.highScore}`, 182, 15);
    ctx.fillText(`SCORE:${game.score}`, 6, 350);

    // Draw digital life indicator bars
    ctx.fillStyle = 'rgba(255, 255, 255, 0.2)';
    ctx.fillRect(174, 343, 60, 8); // Track

    ctx.fillStyle = game.lives === 1 ? '#e06c75' : '#4ec956';
    ctx.fillRect(174, 343, game.lives * 20, 8); // Filled bars

    // Game Over Overlay
    if (game.over) {
      ctx.fillStyle = 'rgba(0, 0, 0, 0.85)';
      ctx.fillRect(0, 0, 240, 360);

      ctx.fillStyle = '#e06c75';
      ctx.font = 'bold 16px var(--font-mono)';
      ctx.textAlign = 'center';
      ctx.fillText('STACK DUMP OVERFLOW', 120, 140);

      ctx.fillStyle = '#fff';
      ctx.font = '10px var(--font-mono)';
      ctx.fillText(`Score: ${game.score} pts`, 120, 180);
      ctx.fillText(`High Score: ${getShooterHighScore()} pts`, 120, 205);

      ctx.fillStyle = 'rgba(255, 255, 255, 0.4)';
      ctx.font = '8px var(--font-mono)';
      ctx.fillText('Click Reboot Core below to patch stack', 120, 240);
      ctx.textAlign = 'left';
    }
  }

  // Spawn initial enemy
  game.lastSpawnTime = Date.now();
  spawnEnemy();

  // Run loop
  loop();
};


window.resetShooter = function (gameId) {
  const game = shooterGames[gameId];
  if (game) {
    if (game.frameId) cancelAnimationFrame(game.frameId);
  }
  initShooterGame(gameId);
};

/* ═══════════════════════════════════════════════════════════
   CONTACT FORM — AJAX submit (stay on page)
   ═══════════════════════════════════════════════════════════ */
(function initContactForm() {
  const form = document.getElementById('contact-form');
  const btn = document.getElementById('contact-submit');
  const label = document.getElementById('submit-label');
  const feedback = document.getElementById('contact-feedback');
  if (!form) return;

  form.addEventListener('submit', async (e) => {
    e.preventDefault();

    // Validate all fields
    const nameVal = form.querySelector('#contact-name').value.trim();
    const emailVal = form.querySelector('#contact-email').value.trim();
    const messageVal = form.querySelector('#contact-message').value.trim();

    feedback.style.display = 'none';

    if (!nameVal || !emailVal || !messageVal) {
      const missing = [];
      if (!nameVal) missing.push('Name');
      if (!emailVal) missing.push('Email');
      if (!messageVal) missing.push('Message');

      feedback.style.display = 'block';
      feedback.innerHTML = `
        <div style="
          display:inline-flex; align-items:center; gap:8px;
          color:var(--bright-red); font-size:0.84rem;
          animation: fadeIn 0.3s ease both;
        ">
          <span>✕</span> Please fill in: ${missing.join(', ')}
        </div>`;
      // Highlight the empty inputs
      form.querySelectorAll('.form-input').forEach(el => {
        const isEmpty = el.value.trim() === '';
        el.style.borderColor = isEmpty ? 'rgba(224,108,117,0.6)' : '';
        el.style.boxShadow = isEmpty ? '0 0 0 3px rgba(224,108,117,0.08)' : '';
      });
      return;
    }

    // Clear any prior error highlights
    form.querySelectorAll('.form-input').forEach(el => {
      el.style.borderColor = '';
      el.style.boxShadow = '';
    });

    // Loading state
    btn.disabled = true;
    label.innerHTML = '<span style="margin-right:6px;">⏳</span> sending...';

    try {
      const data = new FormData(form);
      const res = await fetch(form.action, {
        method: 'POST',
        body: data,
        headers: { 'Accept': 'application/json' }
      });

      if (res.ok) {
        // Success
        form.style.opacity = '0';
        form.style.transition = 'opacity 0.4s ease';
        setTimeout(() => { form.style.display = 'none'; }, 400);

        feedback.style.display = 'block';
        feedback.innerHTML = `
          <div style="
            display:flex; flex-direction:column; align-items:center; gap:14px;
            animation: fadeIn 0.5s ease both;
          ">
            <div style="
              display:inline-flex; align-items:center; gap:10px;
              background:rgba(78,201,86,0.08);
              border:1px solid rgba(78,201,86,0.35);
              border-radius:6px; padding:14px 24px;
              font-size:0.88rem; color:var(--bright-green);
            ">
              <span style="font-size:1.2rem;">✓</span>
              Message sent! I'll get back to you soon.
            </div>
            <button onclick="
              document.getElementById('contact-feedback').style.display='none';
              const f=document.getElementById('contact-form');
              f.reset();
              f.style.display='flex';
              f.style.opacity='0';
              f.style.transition='opacity 0.4s ease';
              requestAnimationFrame(()=>{ f.style.opacity='1'; });
              document.getElementById('submit-label').innerHTML='<span style=\\'margin-right:6px;\\'>✉</span> send message';
              document.getElementById('contact-submit').disabled=false;
            " style="
              font-family:var(--font-mono); font-size:0.78rem;
              color:var(--fg-dim); background:transparent;
              border:1px solid var(--bg3); border-radius:4px;
              padding:6px 16px; cursor:pointer;
              transition:color 0.2s, border-color 0.2s;
            "
            onmouseover="this.style.color='var(--fg)';this.style.borderColor='var(--fg-dim)';"
            onmouseout="this.style.color='var(--fg-dim)';this.style.borderColor='var(--bg3)';"
            >↺ send another</button>
          </div>`;
      } else {
        throw new Error('non-ok response');
      }
    } catch {
      // Error state — re-enable
      btn.disabled = false;
      label.innerHTML = '<span style="margin-right:6px;">✉</span> send message';
      feedback.style.display = 'block';
      feedback.innerHTML = `
        <div style="
          display:inline-flex; align-items:center; gap:8px;
          color:var(--bright-red); font-size:0.84rem;
          animation: fadeIn 0.4s ease both;
        ">
          <span>✕</span> Something went wrong. Try emailing directly:
          <a href="mailto:apsengar@ncsu.edu" style="color:var(--link);">apsengar@ncsu.edu</a>
        </div>`;
    }
  });
})();
