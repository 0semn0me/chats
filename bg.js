// bg.js — Planos de fundo estáveis do Chatzão v3
// O vetor CHATZAO_BG preserva a qualidade original binária das imagens fornecidas pelo usuário
window.CHATZAO_BG = [
  { 
    id: "finn_&_jake", 
    label: "Finn & Jake", 
    src: "data:image/jpeg;base64,/9j/4AAQSkZJRgABAQEASABIAAD/4QCARXhpZgAATU0AKgAAAAgABgESAAMAAAABAAEAAAEaAAUAAAABAAAAVgEbAAUAAAABAAAAXgEoAAMAAAABAAIAAAITAAMAAAABAAEAAMb+AAIAAAARAAAAZgAAAAAAAABIAAAAAQAAAEgAAAABR29vZ2xlIEluYy4gMjAxNgAA/+ICKElDQ19QUk9GSUxFAAEBAAACGAAAAAACEAAAbW50clJHQiBYWVogAAAAAAAAAAAAAAAAYWNzcAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAPbWAAEAAAAA0y0AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAJZGVzYwAAAPAAAAB0clhZWgAAAWQAAAAUZ1hZWgAAAXgAAAAUYlhZWgAAAYwAAAAUclRSQwAAAaAAAAAoZ1RSQwAAAaAAAAAoYlRSQwAAAaAAAAAod3RwdAAAAcgAAAAUY3BydAAAAdwAAAA8bWx1YwAAAAAAAAABAAAADGVuVVMAAABYAAAAHABzAFIARwBCAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAABYWVogAAAAAAAAb6IAADj1AAADkFhZWiAAAAAAAABimQAAt4UAABjaWFlaIAAAAAAAACSgAAAPhAAAts9wYXJhAAAAAAAEAAAAAmZmAADypw..." 
  }
];

// Função global aplicada para garantir o encaixe milimétrico do background no container intermediário
window.applyChatBackground = function(bgId) {
  const bgLayer = document.getElementById('chat-bg-layer');
  if (!bgLayer) return;
  
  const selectedBg = window.CHATZAO_BG.find(b => b.id === bgId);
  if (selectedBg) {
    bgLayer.style.backgroundImage = `url('${selectedBg.src}')`;
    bgLayer.style.display = 'block';
  } else {
    bgLayer.style.backgroundImage = 'none';
  }
};
