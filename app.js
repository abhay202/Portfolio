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
  { text: '[    0.400]   ├── I2C / SPI / UART / CAN buses          [  OK  ]', cls: 'boot-ok', delay: 70 },
  { text: '[    0.468]   ├── Zigbee / BLE protocol stack            [  OK  ]', cls: 'boot-ok', delay: 70 },
  { text: '[    0.536]   └── MQTT / TCP networking                  [  OK  ]', cls: 'boot-ok', delay: 70 },
  { text: '[    0.604] Mounting /dev/nokia-firmware...', cls: 'boot-highlight', delay: 100 },
  { text: '[    0.720] Loading Nokia optical firmware modules...', cls: 'boot-highlight', delay: 120 },
  { text: '[    0.848] SHA-256 integrity verification               [PASS]', cls: 'boot-ok', delay: 80 },
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
  const chars = '01ABCDEF{}[]<>=/\\|;:,.アイウエオカキクケコ';
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
    { t: '[    0.352001]', m: 'sha256: AMCU integrity check [PASS]', c: 'log-ok' },
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
      home: null,
      skills: 'cat skills.txt',
      projects: 'ls projects/',
      experience: 'cat experience.md',
      education: 'cat education.md',
      contact: 'cat contact.txt'
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
    const val = inputEl.value.trim();
    const match = Object.keys(COMMANDS).find(c => c.startsWith(val) && c !== val);
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
  const block = el.closest('.output-block');
  if (block) {
    block.style.transition = 'opacity 0.25s ease, transform 0.25s ease';
    block.style.opacity = '0';
    block.style.transform = 'translateY(-8px)';
    setTimeout(() => block.remove(), 250);
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

  <span class="cyan">neofetch</span>             — System overview
  <span class="cyan">whoami</span>               — About me
  <span class="cyan">cat skills.txt</span>       — Technical skill stack
  <span class="cyan">ls projects/</span>         — List all projects
  <span class="cyan">cat projects/&lt;n&gt;</span>     — Open a project (e.g. <span class="yellow">cat projects/freertos</span>)
  <span class="cyan">cat experience.md</span>    — Work experience & education
  <span class="cyan">cat contact.txt</span>      — Get in touch
  <span class="cyan">uname -a</span>             — System info
  <span class="cyan">clear</span>                — Clear terminal  <span class="dim">(or Ctrl+L)</span>
  <span class="cyan">help</span>                 — Show this message

<span class="dim">Tip: Use ↑ ↓ arrow keys for history, Tab to autocomplete.</span>
<span class="dim">Click any project name in <span class="cyan">ls projects/</span> to open it directly.</span>
</div>`,

  'neofetch': () => `<div class="neofetch-grid">
  <pre class="neofetch-ascii">
      ┌─┬──┬──┬──┬─┐
   ───┤ │  │  │  │ ├───
   ───┤            ├───
   ───┤  A.SENGAR  ├───
   ───┤   v2.0     ├───
   ───┤            ├───
   ───┤ │  │  │  │ ├───
      └─┴──┴──┴──┴─┘
  </pre>
  <div class="neofetch-info">
    <div><span class="green bold">abhay</span><span class="dim">@</span><span class="blue bold">abhayportfolio</span></div>
    <div class="neofetch-separator">────────────────────────</div>
    <div><span class="yellow bold">OS</span><span class="dim">:</span> Firmware Engineer LTS</div>
    <div><span class="yellow bold">Host</span><span class="dim">:</span> Nokia (Firmware Dev Co-op)</div>
    <div><span class="yellow bold">Kernel</span><span class="dim">:</span> M.S. Computer Engineering</div>
    <div><span class="yellow bold">Uptime</span><span class="dim">:</span> since Aug 2024</div>
    <div><span class="yellow bold">Shell</span><span class="dim">:</span> C / C++ / Python / Bash</div>
    <div><span class="yellow bold">DE</span><span class="dim">:</span> STM32 Cube IDE / Altium</div>
    <div><span class="yellow bold">WM</span><span class="dim">:</span> FreeRTOS / Bare-metal</div>
    <div><span class="yellow bold">CPU</span><span class="dim">:</span> ARM Cortex-M0/M0+/M4</div>
    <div><span class="yellow bold">GPU</span><span class="dim">:</span> N/A (bare-metal life)</div>
    <div><span class="yellow bold">Memory</span><span class="dim">:</span> 3.65 / 4.00 GPA</div>
    <div><span class="yellow bold">Disk</span><span class="dim">:</span> 2 degrees loaded</div>
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

  'whoami': () => `
<div>
  <div class="out-h">$ cat about.txt</div>
  <div class="kv-row"><span class="kv-key">Name</span><span class="kv-value green bold">Abhay Pratap Singh Sengar</span></div>
  <div class="kv-row"><span class="kv-key">Role</span><span class="kv-value">Firmware & Embedded Systems Engineer</span></div>
  <div class="kv-row"><span class="kv-key">Current</span><span class="kv-value cyan">Firmware Dev Co-op @ Nokia</span></div>
  <div class="kv-row"><span class="kv-key">Degree</span><span class="kv-value">M.S. Computer Engineering — NC State (3.65 GPA)</span></div>
  <div class="kv-row"><span class="kv-key">Undergrad</span><span class="kv-value">B.Tech EEE — VIT Vellore (8.94/10)</span></div>
  <div class="kv-row"><span class="kv-key">Location</span><span class="kv-value">San Jose, CA</span></div>
  <div class="kv-row"><span class="kv-key">Focus</span><span class="kv-value">Firmware · RTOS · Embedded C/C++ · IoT · ARM</span></div>
  <div class="kv-row"><span class="kv-key">Status</span><span class="kv-value"><span class="green">● Open to full-time roles</span></span></div>
  <br>
  <div class="out-dim">
    Firmware & embedded systems engineer with production experience at Nokia designing
    boot-time integrity verification, C++ driver APIs, and build infrastructure for
    optical firmware. Skilled across the full hardware-software stack — from bare-metal
    firmware on ARM Cortex-M and FreeRTOS scheduling to IoT sensor networks with
    Zigbee/BLE and MQTT-based cloud pipelines.
  </div>
</div>`,

  'cat skills.txt': () => `
<div>
  <div class="out-h">Languages</div>
  <div class="progress-row"><span class="progress-label">C / Embedded C</span>${bar(95)}<span class="bar-pct">95%</span></div>
  <div class="progress-row"><span class="progress-label">C++</span>${bar(85)}<span class="bar-pct">85%</span></div>
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
<div class="out-pre"><span class="dim">total 10</span>  <button class="shortcut" style="margin-left:8px;font-size:0.72rem;padding:2px 10px;" onclick="runCmd('cat projects/all')">view all</button></div>

<div class="project-category">Embedded Systems & RTOS</div>
<div class="out-pre">  <span class="project-link" onclick="openProject('freertos')">freertos/</span>            <span class="dim">— RTOS scheduling (RM & EDF) on ARM Cortex-M0</span>
  <span class="project-link" onclick="openProject('rtos-fault')">rtos-fault/</span>          <span class="dim">— Multithreaded LED control & fault management</span>
  <span class="project-link" onclick="openProject('gpio-analysis')">gpio-analysis/</span>       <span class="dim">— Real-time GPIO response analysis on RPi 4B</span>
  <span class="project-link" onclick="openProject('img-stab')">img-stab/</span>            <span class="dim">— Image stabilization with ARM NEON SIMD</span>
</div>

<div class="project-category">IoT & Sensor Networks</div>
<div class="out-pre">  <span class="project-link" onclick="openProject('care-link')">care-link/</span>           <span class="dim">— IoT fall detection system (multi-node)</span>
</div>

<div class="project-category">ASIC, FPGA & Microarchitecture</div>
<div class="out-pre">  <span class="project-link" onclick="openProject('attention-hw')">attention-hw/</span>        <span class="dim">— Self-Attention hardware accelerator (SystemVerilog)</span>
  <span class="project-link" onclick="openProject('ooo-processor')">ooo-processor/</span>       <span class="dim">— Out-of-Order superscalar processor simulator</span>
</div>

<div class="project-category">Compiler & Operating Systems</div>
<div class="out-pre">  <span class="project-link" onclick="openProject('matrix-reloaded')">matrix-reloaded/</span>     <span class="dim">— DSL compiler with Flex/Bison & LLVM IR</span>
  <span class="project-link" onclick="openProject('xinu')">xinu/</span>                <span class="dim">— Xinu OS kernel extensions (fork, schedulers)</span>
</div>

<div class="project-category">Power Electronics</div>
<div class="out-pre">  <span class="project-link" onclick="openProject('mppt')">mppt/</span>                <span class="dim">— MPPT DC-DC converter for photovoltaic systems</span>
</div>

<div class="dim" style="margin-top:8px">Click a project name or type <span class="cyan">cat projects/&lt;name&gt;</span> to view details.</div>
</div>`,

  'cat projects/all': () => [
    'freertos', 'rtos-fault', 'gpio-analysis', 'img-stab',
    'care-link', 'attention-hw', 'ooo-processor',
    'matrix-reloaded', 'xinu', 'mppt'
  ].map(name => COMMANDS[`cat projects/${name}`]()).join(''),

  /* ═══ PROJECT DETAILS ═══════════════════════════════════ */

  'cat projects/freertos': () => `
<div class="project-card">
  <button class="project-close" onclick="closeBlock(this)" title="Close">✕</button>
  <div class="project-title">FreeRTOS Scheduling Algorithms on ARM Cortex-M0</div>
  <div class="project-desc">
    Implemented Rate-Monotonic and Earliest Deadline First scheduling on STM32F091RC by
    modifying FreeRTOS kernel internals including the Task Control Block, ready-list, and
    context-switch routine for deadline-aware scheduling.
  </div>
  <div class="project-desc">
    Validated RM schedulability (U=0.494, hyper-period=12s) via fixed-point RTA and 100Hz UART
    tick traces. Confirmed WCRTs (R₁=10, R₂=15, R₃=47, R₄=162 ticks) and reproduced deadline
    violations under overload (U=1.20).
  </div>
  <div class="project-desc">
    Engineered a mixed real-time workload achieving 55.8% periodic utilization, integrating
    interrupt-driven sporadic task activation via GPIO EXTI on PC13 with software debouncing.
  </div>
  <div class="project-meta">
    <div>Stack: <span>C · FreeRTOS · ARM Cortex-M0 · UART · GPIO EXTI</span></div>
    <div>MCU: <span>STM32F091RC</span></div>
    <div>Utilization: <span>0.494 (RM) · 1.20 (overload test)</span></div>
  </div>
</div>`,

  'cat projects/rtos-fault': () => `
<div class="project-card">
  <button class="project-close" onclick="closeBlock(this)" title="Close">✕</button>
  <div class="project-title">RTOS-Based Multithreaded LED Control & Fault Management</div>
  <div class="project-desc">
    Developed a real-time embedded system on the Cortex-M0+ based KL25Z, integrating a buck
    converter, LCD, and Analog Discovery 2 to measure LED current, adjust brightness based on
    tilt, and update the LCD in real-time.
  </div>
  <div class="project-desc">
    Integrated RTOS-based synchronization for stable waveform display and mutex-protected
    LCD updates with 125 µs acquisition time and 193 critical sections averaging 186 µs duration.
  </div>
  <div class="project-desc">
    Engineered a 10-fault management system addressing stack overflow, disabled IRQs, PWM
    timer corruption, and mutex deadlock using a 1 kHz watchdog timer with 1024-count overflow,
    achieving fault detection within 41.667 µs and automatic recovery within 1 second.
  </div>
  <div class="project-meta">
    <div>Stack: <span>C · RTOS · KL25Z · ST7789 LCD · Buck Converter</span></div>
    <div>MCU: <span>ARM Cortex-M0+ (KL25Z)</span></div>
    <div>Watchdog: <span>1 kHz · 41.667 µs fault detection</span></div>
  </div>
</div>`,

  'cat projects/gpio-analysis': () => `
<div class="project-card">
  <button class="project-close" onclick="closeBlock(this)" title="Close">✕</button>
  <div class="project-title">Real-Time GPIO Input/Output Response Analysis</div>
  <div class="project-desc">
    Analyzed GPIO event detection on Raspberry Pi 4B by comparing polling and event-driven
    methods (gpiomon, memory-mapped I/O, and kernel interrupts with high-resolution timers)
    to benchmark latency and optimize real-time performance.
  </div>
  <div class="project-desc">
    Achieved response times of 98.23 ns (polling), 4.369 µs (kernel interrupts), and 2.003 ms
    (user-space gpiomon), demonstrating trade-offs between high-speed detection, CPU utilization,
    and system responsiveness.
  </div>
  <div class="project-desc">
    Polling-based methods reach 100% CPU usage, while event-driven approaches maintained
    efficiency at less than 8%, highlighting scalability for embedded real-time systems.
  </div>
  <div class="project-meta">
    <div>Stack: <span>C · Linux · RPi 4B · GPIO · Kernel Interrupts</span></div>
    <div>Best Latency: <span>98.23 ns (polling)</span></div>
    <div>CPU Savings: <span>100% → &lt;8% (event-driven)</span></div>
  </div>
</div>`,

  'cat projects/img-stab': () => `
<div class="project-card">
  <button class="project-close" onclick="closeBlock(this)" title="Close">✕</button>
  <div class="project-title">Image Stabilization — Scalar & ARM NEON SIMD Vectorization</div>
  <div class="project-desc">
    Utilized Raspberry Pi 4 Model B with ARM Cortex-A72 at 1.5 GHz, achieving an initial
    baseline execution time of ~21 ms/frame for real-time YUV image stabilization tasks.
  </div>
  <div class="project-desc">
    Enhanced processing performance by 65%, reducing frame execution time from 21 ms to 7.5 ms
    through scalar optimizations — removing redundant memory operations, restructuring loops
    for cache efficiency, and simplifying control flow.
  </div>
  <div class="project-desc">
    Achieved a 75% performance boost by applying ARM NEON SIMD vectorization, using techniques
    like parallelized color matching and bulk pixel processing, reducing runtime to ~1.9 ms/frame.
  </div>
  <div class="project-meta">
    <div>Stack: <span>C · ARM NEON SIMD · RPi 4B · Cortex-A72</span></div>
    <div>Speedup: <span>21 ms → 1.9 ms/frame (11× faster)</span></div>
    <div>Optimization: <span>Scalar + NEON Vectorization</span></div>
  </div>
</div>`,

  'cat projects/care-link': () => `
<div class="project-card">
  <button class="project-close" onclick="closeBlock(this)" title="Close">✕</button>
  <div class="project-title">Care-Link IoT Fall Detection System</div>
  <div class="project-desc">
    Designed a multi-node IoT system across heterogeneous hardware — NodeMCU ESP8266
    for real-time heart rate monitoring at 100 Hz using MAX3010x pulse sensor, and Arduino Uno
    for sound amplitude detection at 150 Hz, transmitting synchronized sensor streams.
  </div>
  <div class="project-desc">
    Developed a Raspberry Pi-based data collection and MQTT publish pipeline in Python to
    aggregate multi-sensor data into structured CSV datasets for downstream ML model training
    and real-time inference through a subscriber-based architecture.
  </div>
  <div class="project-desc">
    Built an end-to-end ML pipeline integrating IMU training data with multi-sensor inputs,
    demonstrating a complete edge-to-cloud IoT workflow across embedded, single-board, and
    laptop computing tiers.
  </div>
  <div class="project-meta">
    <div>Stack: <span>Python · MQTT · ESP8266 · Arduino · RPi 4B</span></div>
    <div>Sensors: <span>MAX3010x (100 Hz) · Sound (150 Hz) · IMU</span></div>
    <div>Pipeline: <span>MQTT → CSV → ML Inference</span></div>
  </div>
</div>`,

  'cat projects/attention-hw': () => `
<div class="project-card">
  <button class="project-close" onclick="closeBlock(this)" title="Close">✕</button>
  <div class="project-title">Self-Attention Hardware Accelerator</div>
  <div class="project-desc">
    Designed and implemented a Transformer-based hardware module in SystemVerilog to compute
    scaled dot-product attention, including query, key, value, score, and self-attention matrices,
    leveraging SRAM for input, intermediate, and output storage.
  </div>
  <div class="project-desc">
    Developed an efficient matrix multiplication engine for QK&#x1D40; and S×V computations with
    optimized memory mapping and control signals for seamless SRAM interfacing, adhering to
    timing constraints.
  </div>
  <div class="project-desc">
    Verified and synthesized using industry-standard tools — simulation log validation and
    synthesis compliance prevented latches and combinational feedback, achieving 9,215.5 µm²
    area, 6.8 ns clock period, and 2850 cycles.
  </div>
  <div class="project-meta">
    <div>Stack: <span>SystemVerilog · SRAM · Synthesis Tools</span></div>
    <div>Area: <span>9,215.5 µm²</span></div>
    <div>Clock: <span>6.8 ns · 2850 cycles</span></div>
  </div>
</div>`,

  'cat projects/ooo-processor': () => `
<div class="project-card">
  <button class="project-close" onclick="closeBlock(this)" title="Close">✕</button>
  <div class="project-title">Out-of-Order Superscalar Processor Simulator</div>
  <div class="project-desc">
    Developed a simulator capable of fetching and issuing N instructions per cycle, incorporating
    dynamic scheduling with Issue Queue (IQ), Reorder Buffer (ROB), and Rename Map Table (RMT).
  </div>
  <div class="project-desc">
    Modeled pipeline stages (Fetch, Decode, Rename, Register Read, Execute, Writeback, Retire)
    with accurate timing tracking for each instruction, and conducted experiments to measure
    Instructions Per Cycle (IPC) across varying configurations.
  </div>
  <div class="project-desc">
    Ensured simulator outputs matched trace files, validating the correctness of the dynamic
    instruction scheduling mechanism.
  </div>
  <div class="project-meta">
    <div>Stack: <span>C++ · Microarchitecture · Dynamic Scheduling</span></div>
    <div>Features: <span>IQ · ROB · RMT · N-wide fetch/issue</span></div>
    <div>Validation: <span>Trace-file verified IPC measurements</span></div>
  </div>
</div>`,

  'cat projects/matrix-reloaded': () => `
<div class="project-card">
  <button class="project-close" onclick="closeBlock(this)" title="Close">✕</button>
  <div class="project-title">Matrix Reloaded — DSL Compiler</div>
  <div class="project-desc">
    Designed a domain-specific language compiler using Flex/Bison and LLVM IR to support matrix
    operations like inverse, determinant, and arithmetic operations.
  </div>
  <div class="project-desc">
    Refactored codebase to modularize repetitive IR generation logic and integrated matrix support
    via Eigen, reducing static instructions to 243 and achieving top 3 performance in the class.
  </div>
  <div class="project-desc">
    Demonstrated low-level systems skills through debugging, IR verification, and function
    prototype generation using LLVM APIs.
  </div>
  <div class="project-meta">
    <div>Stack: <span>C++ · Flex · Bison · LLVM IR · Eigen</span></div>
    <div>Static Instrs: <span>243 (optimized)</span></div>
    <div>Rank: <span>Top 3 in class</span></div>
  </div>
</div>`,

  'cat projects/xinu': () => `
<div class="project-card">
  <button class="project-close" onclick="closeBlock(this)" title="Close">✕</button>
  <div class="project-title">Xinu OS Kernel Extensions</div>
  <div class="project-desc">
    Extended the Xinu OS kernel by implementing cascading termination with a user_process PCB
    flag, redesigning kill() to recursively terminate child processes, and developing a Unix-style
    fork() system call that duplicates parent stack frames and execution context.
  </div>
  <div class="project-desc">
    Implemented Lottery Scheduling by modifying the scheduler to allocate CPU time proportional
    to ticket count with PID-based tie-breaking, and Multi-Level Feedback Queue (MLFQ) scheduling
    with configurable priority levels, doubling time allotments per level, and periodic priority boost.
  </div>
  <div class="project-desc">
    Designed and validated 15+ process test suites covering cascading termination, fork behavior,
    and scheduler fairness — conducting turnaround time ratio analysis (F = T₁/T₂) across
    increasing workloads to verify probabilistic fairness convergence.
  </div>
  <div class="project-meta">
    <div>Stack: <span>C · Xinu OS · ARM · Kernel Development</span></div>
    <div>Features: <span>fork() · Lottery · MLFQ Scheduling</span></div>
    <div>Testing: <span>15+ process test suites</span></div>
  </div>
</div>`,

  'cat projects/mppt': () => `
<div class="project-card">
  <button class="project-close" onclick="closeBlock(this)" title="Close">✕</button>
  <div class="project-title">MPPT DC-DC Converter for Photovoltaic Systems</div>
  <div class="project-desc">
    Designed and developed a 1.5 kW photovoltaic MPPT system using a boost DC-DC converter,
    modeling the power stage in MATLAB and achieving ~96.5% tracking efficiency with the
    Incremental Conductance (IC) algorithm during hardware testing.
  </div>
  <div class="project-desc">
    Implemented Arduino-based MPPT firmware with switchable IC and P&amp;O algorithms, validated
    across 100–1000 W/m² irradiance and 20–50 °C, with IC demonstrating faster MPP convergence
    and ~6% higher efficiency than P&amp;O.
  </div>
  <div class="project-desc">
    Engineered a 20 kHz boost converter with analytically sized 190 µH inductor and ≥80 µF
    capacitor to limit ripple; specified IGBT, diode, and TLP250 gate driver, verified &lt;9 V ripple
    and 30 A peak current.
  </div>
  <div class="project-meta">
    <div>Stack: <span>C · Arduino · MATLAB · Power Electronics</span></div>
    <div>Power: <span>1.5 kW · 96.5% tracking efficiency</span></div>
    <div>Converter: <span>20 kHz boost · 190 µH · ≥80 µF</span></div>
  </div>
</div>`,

  /* ═══ EXPERIENCE & CONTACT ══════════════════════════════ */

  'cat experience.md': () => `
<div>
  <div class="out-h">💼  Work Experience</div>

  <div class="exp-card">
    <div class="exp-header">
      <div>
        <span class="exp-title">Firmware Development Co-op</span>
        <span class="exp-company"> — Nokia</span>
      </div>
      <span class="exp-date">Jan 2026 – May 2026</span>
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
      <span class="exp-date">Aug 2023 – Feb 2024</span>
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
      <span class="exp-date">Dec 2022 – May 2023</span>
    </div>
    <div class="exp-location">Mumbai, Maharashtra, India · On-site</div>
    <ul class="exp-bullets">
      <li>Designed a PID-controlled trigger-pulse PCB using an ATmega328, integrating with SCR configurations in a water-cooled 12-pulse rectifier system and achieving a 20% reduction in energy consumption across installed rectifiers.</li>
      <li>Led end-to-end testing and validation of battery unit circuits, researching and deploying strategies to minimize energy usage in rectifier units — resulting in measurable performance gains and strict adherence to quality standards.</li>
    </ul>
  </div>
  <div class="dim" style="margin-top:10px">Run <span class="cyan">cat education.md</span> to view academic background.</div>
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
    <span class="chip">Advanced Computer Architecture</span>
    <span class="chip">VLSI Design</span>
    <span class="chip">Digital System Design</span>
    <span class="chip">Real-Time Embedded Systems</span>
    <span class="chip">Hardware Security</span>
    <span class="chip">Compiler Optimization</span>
    <span class="chip">Operating Systems</span>
    <span class="chip">Power Electronics</span>
  </div>
  <div class="dim" style="margin-top:10px">Run <span class="cyan">cat experience.md</span> to view work history.</div>
</div>`,

  'cat contact.txt': () => `
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
};

/* ── Command runner ───────────────────────────────────────── */
function runCmd(raw) {
  const cmd = raw.trim();
  if (COMMANDS[cmd]) {
    const result = COMMANDS[cmd]();
    if (result !== null) appendBlock(result, cmd);
  } else {
    appendBlock(
      `<div class="err-line">bash: ${escHtml(cmd)}: command not found</div>
  <div class="dim">Type <span class="cyan">help</span> to see available commands.</div>`,
      cmd
    );
  }
}
