window.CHATZAO_BG = [
  { id: "bg-01", label: "Galáxia", src: "https://images.unsplash.com/photo-1451187580459-43490279c0fa" },
  { id: "bg-02", label: "Minimalismo", src: "https://images.unsplash.com/photo-1506744038136-46273834b3fb" }
];

window.injetarPlanosDeFundoNativos = () => {
  const container = document.getElementById('drawer-bg-list');
  if (!container) return;
  container.innerHTML = '';
  window.CHATZAO_BG.forEach(bg => {
    const btn = document.createElement('button');
    btn.className = 'bg-item-btn';
    btn.innerHTML = bg.label;
    btn.onclick = () => {
      const overlay = document.getElementById('bg-overlay');
      if (overlay) overlay.style.backgroundImage = `url(${bg.src})`;
    };
    container.appendChild(btn);
  });
};
