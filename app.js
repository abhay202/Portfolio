/**
 * Abhay Sengar | Portfolio — app.js
 * Terminal interpreter + dual-mode toggle (terminal ↔ clean view)
 */

/* ── Mode toggle ──────────────────────────────────────────── */
const terminalView = document.getElementById('terminal-view');
const cleanView = document.getElementById('clean-view');
const btnTerminal = document.getElementById('mode-toggle-terminal');
const btnClean = document.getElementById('mode-toggle-clean');

function showTerminal() {
  terminalView.removeAttribute('hidden');
  cleanView.setAttribute('hidden', '');
  inputEl.focus();
}

function showClean() {
  terminalView.setAttribute('hidden', '');
  cleanView.removeAttribute('hidden');
  window.scrollTo({ top: 0, behavior: 'instant' });
  animateCleanView();
}

btnTerminal.addEventListener('click', showClean);
btnClean.addEventListener('click', showTerminal);

/* ── Helpers ─────────────────────────────────────────────── */
const $ = id => document.getElementById(id);
const output = $('output-area');
const inputEl = $('cli-input');

// Set live date in MOTD
const sysDate = $('sys-date');
if (sysDate) {
  sysDate.textContent = new Date().toLocaleString('en-US', {
    weekday: 'short', month: 'short', day: 'numeric',
    hour: '2-digit', minute: '2-digit', year: 'numeric'
  });
}

// Click anywhere in terminal to focus input
document.querySelector('.terminal').addEventListener('click', () => inputEl.focus());

/* ── Command history (arrow key navigation) ────────────────── */
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

/* ── Shortcut buttons ─────────────────────────────────────── */
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
          <span class="user">abhay</span><span class="at">@</span><span class="host">portfolio</span><span class="colon">:</span><span class="path">~</span><span class="dollar">$</span>
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

/* ── Command registry ─────────────────────────────────────── */
const COMMANDS = {

  'help': () => `
<div class="out-pre"><span class="green bold">Available commands:</span>

  <span class="cyan">whoami</span>              — About me
  <span class="cyan">cat skills.txt</span>      — Technical skill stack
  <span class="cyan">ls projects/</span>        — List all projects
  <span class="cyan">cat projects/&lt;n&gt;</span>    — Open a project (e.g. <span class="yellow">cat projects/risc-v</span>)
  <span class="cyan">cat experience.md</span>   — Education &amp; work history
  <span class="cyan">cat contact.txt</span>     — Get in touch
  <span class="cyan">uname -a</span>            — System info
  <span class="cyan">clear</span>               — Clear terminal  <span class="dim">(or Ctrl+L)</span>
  <span class="cyan">help</span>                — Show this message

<span class="dim">Tip: Use ↑ ↓ arrow keys for history, Tab to autocomplete.</span>
</div>`,

  'whoami': () => `
<div>
  <div class="out-h">$ cat about.txt</div>
  <div class="kv-row"><span class="kv-key">Name</span><span class="kv-value green bold">Abhay Sengar</span></div>
  <div class="kv-row"><span class="kv-key">Degree</span><span class="kv-value">M.S. Computer Engineering (in progress)</span></div>
  <div class="kv-row"><span class="kv-key">Focus</span><span class="kv-value">Embedded Systems · FPGAs · Linux · Edge AI</span></div>
  <div class="kv-row"><span class="kv-key">Location</span><span class="kv-value">United States</span></div>
  <div class="kv-row"><span class="kv-key">Status</span><span class="kv-value"><span class="green">● Open to internships &amp; full-time roles</span></span></div>
  <br>
  <div class="out-dim">
    Embedded systems engineer with a strong foundation in digital hardware design (FPGA/VLSI) and
    systems programming (C/C++, Linux kernel). Experienced working across the full hardware-software
    stack — from RTL simulation on FPGA boards and writing bare-metal firmware for ARM Cortex-M
    microcontrollers, to deploying ML inference pipelines on resource-constrained edge devices.
  </div>
</div>`,

  'cat skills.txt': () => `
<div>
  <div class="out-h">Hardware</div>
  <div class="progress-row"><span class="progress-label">SystemVerilog/Verilog</span>${bar(90)}<span class="bar-pct">90%</span></div>
  <div class="progress-row"><span class="progress-label">FPGA (Xilinx Vivado)</span>${bar(85)}<span class="bar-pct">85%</span></div>
  <div class="progress-row"><span class="progress-label">Computer Architecture</span>${bar(80)}<span class="bar-pct">80%</span></div>
  <div class="progress-row"><span class="progress-label">PCB / Schematics</span>${bar(65)}<span class="bar-pct">65%</span></div>

  <div class="out-h">Firmware &amp; Systems</div>
  <div class="progress-row"><span class="progress-label">C / Embedded C</span>${bar(92)}<span class="bar-pct">92%</span></div>
  <div class="progress-row"><span class="progress-label">C++17/20</span>${bar(80)}<span class="bar-pct">80%</span></div>
  <div class="progress-row"><span class="progress-label">FreeRTOS / RTOS</span>${bar(78)}<span class="bar-pct">78%</span></div>
  <div class="progress-row"><span class="progress-label">ARM Cortex-M / STM32</span>${bar(85)}<span class="bar-pct">85%</span></div>
  <div class="progress-row"><span class="progress-label">Linux Kernel / Drivers</span>${bar(72, 'var(--bright-aqua)')}<span class="bar-pct">72%</span></div>

  <div class="out-h">Software &amp; Tools</div>
  <div class="progress-row"><span class="progress-label">Python</span>${bar(85, 'var(--bright-blue)')}<span class="bar-pct">85%</span></div>
  <div class="progress-row"><span class="progress-label">PyTorch / TensorRT</span>${bar(70, 'var(--bright-blue)')}<span class="bar-pct">70%</span></div>
  <div class="progress-row"><span class="progress-label">Git / GDB / Valgrind</span>${bar(88, 'var(--orange)')}<span class="bar-pct">88%</span></div>
  <div class="progress-row"><span class="progress-label">Bash / Shell Scripting</span>${bar(80, 'var(--orange)')}<span class="bar-pct">80%</span></div>

  <div class="out-h">Boards &amp; Buses</div>
  <div class="chips">
    <span class="chip">Raspberry Pi</span><span class="chip">STM32</span><span class="chip">ESP32</span>
    <span class="chip">NVIDIA Jetson</span><span class="chip">BeagleBone</span>
    <span class="chip">I2C</span><span class="chip">SPI</span><span class="chip">UART</span>
    <span class="chip">CAN Bus</span><span class="chip">PCIe</span><span class="chip">DMA</span>
  </div>
</div>`,

  'ls projects/': () => `
<div>
<div class="out-pre"><span class="dim">total 5</span>
<span class="ls-dir">drwxr-xr-x</span>  <span class="ls-file">risc-v/</span>         <span class="dim">— 5-stage pipelined RISC-V CPU core</span>
<span class="ls-dir">drwxr-xr-x</span>  <span class="ls-file">rtos-hub/</span>       <span class="dim">— CAN-bus IoT telemetry hub (FreeRTOS)</span>
<span class="ls-dir">drwxr-xr-x</span>  <span class="ls-file">pcie-driver/</span>    <span class="dim">— PCIe DMA Linux kernel character driver</span>
<span class="ls-dir">drwxr-xr-x</span>  <span class="ls-file">edge-ai/</span>        <span class="dim">— INT8 object detection on NVIDIA Jetson</span>
<span class="ls-dir">drwxr-xr-x</span>  <span class="ls-file">pi-cluster/</span>     <span class="dim">— 4-node Raspberry Pi compute cluster</span>
</div>
<div class="dim" style="margin-top:6px">Type <span class="cyan">cat projects/&lt;name&gt;</span> to read details — e.g. <span class="yellow">cat projects/risc-v</span></div>
</div>`,

  'cat projects/risc-v': () => `
<div class="project-card">
  <div class="project-title">⚙  RISC-V Pipelined CPU Core</div>
  <div class="project-desc">
    Designed a 5-stage in-order RISC-V (RV32I) processor in SystemVerilog on a Xilinx Artix-7 FPGA.
    Implements full hazard detection, data forwarding, and static branch prediction.
    Verified with custom SystemVerilog testbenches and waveform analysis in GTKWave.
  </div>
  <div class="project-meta">
    <div>Stack: <span>SystemVerilog · Vivado · RISC-V ISA · GTKWave</span></div>
    <div>Fmax: <span>75 MHz (post-route)</span></div>
    <div>Board: <span>Arty A7-35T</span></div>
  </div>
</div>`,

  'cat projects/rtos-hub': () => `
<div class="project-card">
  <div class="project-title">📡  RTOS-Based CAN-Bus IoT Telemetry Hub</div>
  <div class="project-desc">
    Real-time sensor aggregation node on STM32F4 running FreeRTOS. Eight concurrent tasks handle
    high-speed SPI sensor polling, DMA ring buffers, low-power sleep cycles, and CAN-bus packet
    transmission to a host system.
  </div>
  <div class="project-meta">
    <div>Stack: <span>C · STM32 HAL · FreeRTOS · CAN · DMA</span></div>
    <div>MCU: <span>ARM Cortex-M4 @ 168 MHz</span></div>
    <div>Latency: <span>&lt; 1 ms end-to-end</span></div>
  </div>
</div>`,

  'cat projects/pcie-driver': () => `
<div class="project-card">
  <div class="project-title">🐧  PCIe DMA Linux Kernel Driver</div>
  <div class="project-desc">
    Character device driver (kernel module) for a custom FPGA PCIe board. Implements scatter-gather
    DMA for zero-copy user-space transfers, MSI-X interrupt handling, and mmap-based register access.
    Achieves ~3.2 GB/s sustained throughput on a PCIe Gen 3.0 x4 link.
  </div>
  <div class="project-meta">
    <div>Stack: <span>C · Linux Kernel API · PCIe · DMA · MSI-X</span></div>
    <div>Throughput: <span>3.2 GB/s</span></div>
    <div>Interface: <span>PCIe Gen 3.0 ×4</span></div>
  </div>
</div>`,

  'cat projects/edge-ai': () => `
<div class="project-card">
  <div class="project-title">🤖  Edge AI Real-Time Vision Pipeline</div>
  <div class="project-desc">
    YOLOv8 object detection pipeline optimized for NVIDIA Jetson Orin using TensorRT INT8 quantization.
    Custom C++ multi-threaded frame dispatcher achieves 45 FPS at 1080p with &lt; 12 W power draw.
  </div>
  <div class="project-meta">
    <div>Stack: <span>Python · PyTorch · TensorRT · CUDA · C++</span></div>
    <div>Device: <span>NVIDI`A Jetson Orin NX</span></div>
  <div>Performance: <span>45 FPS @ INT8</span></div>
  </div >
</div > `,

    'cat projects/pi-cluster': () => `
  < div class="project-card" >
  <div class="project-title">🍓  Raspberry Pi 4-Node Compute Cluster</div>
  <div class="project-desc">
    Bare-metal 4-node cluster built with Raspberry Pi 4B boards running Ubuntu Server 22.04 LTS.
    Configured NFS shared storage, SSH key-based orchestration, and custom Bash job dispatcher
    for parallel workloads. Used for distributed ML training experiments and parallel compilation benchmarks.
  </div>
  <div class="project-meta">
    <div>Stack: <span>Linux · Bash · NFS · SSH · MPI</span></div>
    <div>Nodes: <span>4× Raspberry Pi 4B (8 GB RAM each)</span></div>
    <div>Network: <span>Gigabit Ethernet</span></div>
  </div>
</div > `,

    'cat experience.md': () => `
  < div >
  <div class="out-h">🎓  Education</div>
  <div class="kv-row"><span class="kv-key">Degree</span><span class="kv-value green">M.S. Computer Engineering</span></div>
  <div class="kv-row"><span class="kv-key">Status</span><span class="kv-value">In Progress</span></div>
  <div class="kv-row"><span class="kv-key">Focus</span><span class="kv-value">Embedded Systems, Digital Design, Computer Architecture</span></div>

  <div class="out-h" style="margin-top:14px">💼  Research &amp; Lab Work</div>
  <div class="kv-row"><span class="kv-key">Role</span><span class="kv-value green">Graduate Research / Lab Assistant</span></div>
  <div class="kv-row"><span class="kv-key">Environment</span><span class="kv-value">ECE Lab (Raspberry Pi nodes, FPGA boards, instruments)</span></div>
  <div class="kv-row"><span class="kv-key">Activities</span><span class="kv-value">FPGA prototyping, firmware development, oscilloscopes, logic analyzers</span></div>

  <div class="out-h" style="margin-top:14px">📚  Relevant Coursework</div>
  <div class="chips">
    <span class="chip">Advanced Computer Architecture</span>
    <span class="chip">VLSI Design</span>
    <span class="chip">Digital System Design</span>
    <span class="chip">Real-Time Embedded Systems</span>
    <span class="chip">Parallel Computing</span>
    <span class="chip">Hardware Security</span>
    <span class="chip">ML Hardware Acceleration</span>
  </div>
</div > `,

    'cat contact.txt': () => `
  < div >
  <div class="out-h">📬  Contact</div>
  <div class="kv-row"><span class="kv-key">LinkedIn</span><span class="kv-value"><a class="cyan" href="https://www.linkedin.com/in/abhay-sengar2412/" target="_blank" rel="noopener">linkedin.com/in/abhay-sengar2412</a></span></div>
  <div class="kv-row"><span class="kv-key">GitHub</span><span class="kv-value"><a class="cyan" href="https://github.com/" target="_blank" rel="noopener">github.com/abhay-sengar</a></span></div>
  <div class="kv-row"><span class="kv-key">Email</span><span class="kv-value"><a class="cyan" href="mailto:apsengar@ncsu.edu">apsengar@ncsu.edu</a></span></div>
  <br>
  <div class="out-dim">I'm currently open to internship and full-time opportunities in embedded systems, hardware engineering, and edge computing. Feel free to reach out!</div>
</div>`,

    'uname -a': () => `
  < div class="out-pre green" > Linux abhay - portfolio 24.04.0 - portfolio - LTS #1 SMP CE - Master x86_64 GNU / Linux</div > `,

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
            `< div class="err-line" > bash: ${ escHtml(cmd) }: command not found</div >
  <div class="dim">Type <span class="cyan">help</span> to see available commands.</div>`,
            cmd
        );
    }
}

/* ── Clean view: fade-in animation on first reveal ─────────── */
function animateCleanView() {
    const cards = cleanView.querySelectorAll('.cv-project-card, .cv-skill-group, .cv-timeline-content, .cv-contact-card, .cv-stat');
    cards.forEach((el, i) => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(18px)';
        el.style.transition = 'opacity 0.45s ease, transform 0.45s ease';
        setTimeout(() => {
            el.style.opacity = '1';
            el.style.transform = 'translateY(0)';
        }, 80 + i * 55);
    });
}
