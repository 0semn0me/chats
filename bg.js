/**
 * Designer Note:
 * Mantemos o array window.CHATZAO_BG como o "Single Source of Truth".
 * Isso permite que qualquer módulo futuro acesse as imagens de fundo 
 * sem precisar re-declarar variáveis ou fazer chamadas desnecessárias ao banco de dados.
 */

window.CHATZAO_BG = [
  { 
    id: "bg-01", 
    label: "Galáxia Premium", 
    src: "https://images.unsplash.com/photo-1451187580459-43490279c0fa" 
  },
  { 
    id: "bg-02", 
    label: "Minimalismo Dark", 
    src: "https://images.unsplash.com/photo-1506744038136-46273834b3fb" 
  },
  { 
    id: "bg-03", 
    label: "Abstrato Chroma", 
    src: "https://images.unsplash.com/photo-1550684848-fac1c5b4e853" 
  }
];

// Função de injeção (Módulo de UI)
window.injetarPlanosDeFundoNativos = () => {
  const container = document.getElementById('drawer-bg-list');
  if (!container) return;

  container.innerHTML = ''; // Limpa antes de injetar

  window.CHATZAO_BG.forEach(bg => {
    const btn = document.createElement('button');
    btn.className = 'bg-item-btn';
    btn.innerHTML = `<i class="ti ti-photo"></i> ${bg.label}`;
    
    btn.onclick = () => {
      // Aplica o fundo ao overlay principal
      const overlay = document.getElementById('bg-overlay');
      if (overlay) {
        overlay.style.backgroundImage = `url(${bg.src})`;
        overlay.style.backgroundSize = 'cover';
        overlay.style.backgroundPosition = 'center';
      }
    };
    
    container.appendChild(btn);
  });
};
