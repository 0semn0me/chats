// bg.js — Planos de fundo do Chatzão
window.CHATZAO_BG = [
  { id: "homer_hedge", label: "Homer (Hedge)", src: "URL_DIRETA_DA_IMAGEM_AQUI" },
  { id: "bugs_stoned", label: "Bugs (Stoned)", src: "URL_DIRETA_DA_IMAGEM_AQUI" },
  { id: "squidward_coffee", label: "Squidward (Coffee)", src: "URL_DIRETA_DA_IMAGEM_AQUI" },
  { id: "homer_peeking", label: "Homer (Peeking)", src: "URL_DIRETA_DA_IMAGEM_AQUI" },
  { id: "bart_peeking", label: "Bart (Bart)", src: "URL_DIRETA_DA_IMAGEM_AQUI" },
  { id: "bart_flashlight", label: "Bart Flashlight", src: "URL_DIRETA_DA_IMAGEM_AQUI" },
  { id: "mordecai_rigby", label: "Mordecai & Rigby", src: "URL_DIRETA_DA_IMAGEM_AQUI" },
  { id: "rick_morty", label: "Rick and Morty", src: "URL_DIRETA_DA_IMAGEM_AQUI" },
  { id: "gumball_darwin", label: "Gumball", src: "URL_DIRETA_DA_IMAGEM_AQUI" }
];

// Garante que o sistema encontre o fundo
window.getBackgroundById = function(id) {
  const bg = window.CHATZAO_BG.find(item => item.id === id);
  return bg ? bg.src : null;
};
