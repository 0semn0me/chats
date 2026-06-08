window.CHATZAO_BG = [
  { id: "bg-01", label: "Padrao", src: "none" }
];

window.injetarPlanosDeFundoNativos = () => {
  const container = document.getElementById('drawer-bg-list');
  if(!container) return;
  container.innerHTML = '';
  window.CHATZAO_BG.forEach(bg => {
    const btn = document.createElement('button');
    btn.innerText = bg.label;
    btn.style.display = 'block';
    btn.style.width = '100%';
    btn.onclick = () => document.body.style.backgroundImage = bg.src !== "none" ? `url(${bg.src})` : 'none';
    container.appendChild(btn);
  });
};
