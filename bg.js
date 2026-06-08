// ── SISTEMA DE CORES CHROMA (CANVAS) ──
const canvas = document.getElementById('dc-canvas');
const ctx = canvas.getContext('2d');
const hueSlider = document.getElementById('dc-hue');

function renderChroma(hue) {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  // Criar gradiente de Saturação (X) e Luminosidade (Y) com base na Matiz (Hue)
  for (let y = 0; y < canvas.height; y++) {
    const l = 100 - (y / canvas.height) * 100;
    const grad = ctx.createLinearGradient(0, y, canvas.width, y);
    grad.addColorStop(0, `hsl(${hue}, 0%, ${l}%)`);
    grad.addColorStop(1, `hsl(${hue}, 100%, ${l}%)`);
    ctx.fillStyle = grad;
    ctx.fillRect(0, y, canvas.width, 1);
  }
}

// Atualizar o canvas quando arrastar o slider de Matiz
hueSlider.addEventListener('input', (e) => {
  renderChroma(e.target.value);
});

// Capturar o clique no Canvas para mudar a cor primária do sistema (--p)
canvas.addEventListener('click', (e) => {
  const rect = canvas.getBoundingClientRect();
  const x = e.clientX - rect.left;
  const y = e.clientY - rect.top;
  
  const s = Math.round((x / canvas.width) * 100);
  const l = Math.round(100 - (y / canvas.height) * 100);
  const hue = hueSlider.value;
  
  const escolhida = `hsl(${hue}, ${s}%, ${l}%)`;
  document.documentElement.style.setProperty('--p', escolhida);
  localStorage.setItem('chatzao_theme_color', escolhida);
});

// Inicializa o desenho do Canvas Chroma
renderChroma(hueSlider.value);


// ── CARREGAMENTO DE BG (bg.js) E SELEÇÃO ──
function carregarPlanosDeFundo() {
  const container = document.getElementById('drawer-bg-list');
  container.innerHTML = ""; // Limpa lixos antigos
  
  // Verifica se a lista global vinda do bg.js existe
  if (window.CHATZAO_BG && window.CHATZAO_BG.length > 0) {
    window.CHATZAO_BG.forEach((bg) => {
      const btn = document.createElement('button');
      btn.className = "bg-item-btn";
      btn.innerHTML = `<i class="ti ti-photo"></i> ${bg.label}`;
      
      btn.addEventListener('click', () => {
        aplicarPlanoDeFundo(bg.src);
        // Atualiza classe ativa visualmente
        document.querySelectorAll('.bg-item-btn').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
      });
      
      container.appendChild(btn);
    });
  }
}

function aplicarPlanoDeFundo(src) {
  const overlay = document.getElementById('bg-overlay');
  if (overlay) {
    overlay.style.backgroundImage = `url('${src}')`;
    overlay.style.opacity = "0.15"; // Ajuste fino opacidade para não atrapalhar leitura
    localStorage.setItem('chatzao_custom_bg', src);
  }
}


// ── UPLOAD DE FOTO DE ESCOLA ──
const bgUploadInput = document.getElementById('bg-upload-input');
const bgUploadTrigger = document.getElementById('bg-upload-trigger');

bgUploadTrigger.addEventListener('click', () => bgUploadInput.click());

bgUploadInput.addEventListener('change', (e) => {
  const file = e.target.files[0];
  if (file) {
    const reader = new FileReader();
    reader.onload = (event) => {
      const imagemCarregada = event.target.result;
      aplicarPlanoDeFundo(imagemCarregada);
      
      document.querySelectorAll('.bg-item-btn').forEach(b => b.classList.remove('active'));
      bgUploadTrigger.classList.add('active');
    };
    reader.readAsDataURL(file);
  }
});


// ── RESTAURAR CONFIGURAÇÕES SALVAS AO ENTRAR ──
function restaurarPreferencias() {
  // Cor primária salva
  const savedColor = localStorage.getItem('chatzao_theme_color');
  if (savedColor) {
    document.documentElement.style.setProperty('--p', savedColor);
  }
  
  // Background salvo
  const savedBg = localStorage.getItem('chatzao_custom_bg');
  if (savedBg) {
    aplicarPlanoDeFundo(savedBg);
  }
}

// Chame estas duas funções na inicialização do app ou logo após o login:
carregarPlanosDeFundo();
restaurarPreferencias();
