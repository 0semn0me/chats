// bg.js — Planos de fundo do Chatzão v3 (Qualidade Original)
window.CHATZAO_BG = [
  { 
    id: "finn_&_jake", 
    label: "Finn & Jake", 
    src: "data:image/jpeg;base64,/9j/4AAQSkZJRgABAQEASABIAAD/4QCARXhpZgAATU0AKgAAAAgABgESAAMAAAABAAEAAAEaAAUAAAABAAAAVgEbAAUAAAABAAAAXgEoAAMAAAABAAIAAAITAAMAAAABAAEAAMb+AAIAAAARAAAAZgAAAAAAAABIAAAAAQAAAEgAAAABR29vZ2xlIEluYy4gMjAxNgAA/+ICKElDQ19QUk9GSUxFAAEBAAACGAAAAAACEAAAbW50clJHQiBYWVogAAAAAAAAAAAAAAAAYWNzcAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAPbWAAEAAAAA0y0AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAJZGVzYwAAAPAAAAB0clhZWgAAAWQAAAAUZ1hZWgAAAXgAAAAUYlhZWgAAAYwAAAAUclRSQwAAAaAAAAAoZ1RSQwAAAaAAAAAoYlRSQwAAAaAAAAAod3RwdAAAAcgAAAAUY3BydAAAAdwAAAA8bWx1YwAAAAAAAAABAAAADGVuVVMAAABYAAAAHABzAFIARwBCAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAABYWVogAAAAAAAAb6IAADj1AAADkFhZWiAAAAAAAABimQAAt4UAABjaWFlaIAAAAAAAACSgAAAPhAAAts9wYXJhAAAAAAAEAAAAAmZmAADypwAAAnR0clRSQwAAAaAAAAAoZ1RSQwAAAaAAAAAoYlRSQwAAAaAAAAAod3RwdAAAAcgAAAAUY3BydAAAAdwAAAA8bWx1YwAAAAAAAAABAAAADGVuVVMAAABYAAAAHABzAFIARwBCAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAABYWVogAAAAAAAAb6IAADj1AAADkFhZWiAAAAAAAABimQAAt4UAABjaWFlaIAAAAAAAACSgAAAPhAAAts9wYXJhAAAAAAAEAAAAAmZmAADypw==" 
  }
];

// Função de Inicialização dos Planos de Fundo no Drawer Lateral
window.initBackgrounds = function() {
  const container = document.getElementById('drawer-content');
  const bgLayer = document.getElementById('chat-bg-layer');
  if (!container || !bgLayer) return;

  container.innerHTML = '';

  // Opção Padrão (Sem Fundo)
  const delem = document.createElement('div');
  delem.className = 'bg-option active';
  delem.innerHTML = `<div style="width:100%;height:100%;display:flex;align-items:center;justify-content:center;color:var(--t3);font-size:13px;background:var(--s2)">Sem Fundo</div>`;
  delem.addEventListener('click', () => {
    document.querySelectorAll('.bg-option').forEach(el => el.classList.remove('active'));
    delem.classList.add('active');
    bgLayer.style.backgroundImage = 'none';
    localStorage.removeItem('chat_bg_selection');
  });
  container.appendChild(delem);

  // Injeção das Imagens com Qualidade Nativa
  window.CHATZAO_BG.forEach(bg => {
    const opt = document.createElement('div');
    opt.className = 'bg-option';
    opt.id = `bg-opt-${bg.id}`;
    
    const img = document.createElement('img');
    img.src = bg.src;
    img.alt = bg.label;
    img.style.width = '100%';
    img.style.height = '100%';
    img.style.objectFit = 'cover';
    
    opt.appendChild(img);

    opt.addEventListener('click', () => {
      document.querySelectorAll('.bg-option').forEach(el => el.classList.remove('active'));
      opt.classList.add('active');
      
      // Encaixe estrito delimitado pelas regras CSS do contêiner intermediário
      bgLayer.style.backgroundImage = `url('${bg.src}')`;
      localStorage.setItem('chat_bg_selection', bg.id);
    });

    container.appendChild(opt);
  });

  // Restaurar seleção prévia salva no dispositivo
  const savedBg = localStorage.getItem('chat_bg_selection');
  if (savedBg) {
    const activeOpt = document.getElementById(`bg-opt-${savedBg}`);
    if (activeOpt) {
      activeOpt.click();
    }
  }
};

// Executa a montagem assim que o DOM estiver totalmente pronto para evitar conflitos de carregamento
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => window.initBackgrounds());
} else {
  window.initBackgrounds();
}
