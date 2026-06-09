// bg.js — Planos de fundo do Chatzão
window.CHATZAO_BG = [
  { id: "homer_hedge", label: "Homer (Hedge)", src: "https://pin.it/6PV16AFY9" },
  { id: "bugs_stoned", label: "Bugs (Stoned)", src: "https://pin.it/4Hz4bdKkM" },
  { id: "squidward_coffee", label: "Squidward (Coffee)", src: "https://pin.it/DqC9a9xk0" },
  { id: "homer_peeking", label: "Homer (Peeking)", src: "https://pin.it/2dfbFRq6R" },
  { id: "bart_peeking", label: "Bart (Bart)", src: "https://pin.it/6NJXEe9PF" },
  { id: "bart_flashlight", label: "Bart Flashlight", src: "https://pin.it/10De0hASZ" },
  { id: "mordecai_rigby", label: "Mordecai & Rigby", src: "https://pin.it/37szSHRJZ" },
  { id: "rick_morty", label: "Rick and Morty", src: "https://pin.it/3m0gi5YFG" },
  { id: "gumball_darwin", label: "Gumball", src: "https://pin.it/1GcpWSt1B" },
  { id: "extra_1", label: "Extra 1", src: "https://pin.it/7CO7pCMsQ" },
  { id: "extra_2", label: "Extra 2", src: "https://pin.it/6q7FfxSN7" }
];

// Função para buscar a URL do fundo baseada no ID
window.getBackgroundById = function(id) {
  const bg = window.CHATZAO_BG.find(item => item.id === id);
  return bg ? bg.src : null;
};

// Exemplo de uso:
// console.log(getBackgroundById("homer_hedge"));
