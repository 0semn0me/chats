// ... (mantenha o início do seu app.js até chegar na função abaixo)

function inicializarEventosGerais() {
  // --- Upload de Avatar (Login) ---
  const avatarInput = document.getElementById('avatar-file-input');
  const avatarTrigger = document.getElementById('avatar-upload-trigger');
  const avatarStatus = document.getElementById('avatar-status');

  if(avatarTrigger) {
    avatarTrigger.addEventListener('click', () => avatarInput.click());
    avatarInput.addEventListener('change', (e) => {
      const file = e.target.files[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = (event) => {
          avatarBase64 = event.target.result;
          avatarStatus.style.display = 'block';
        };
        reader.readAsDataURL(file);
      }
    });
  }

  // --- Botão de Login ---
  document.getElementById('enter-btn').addEventListener('click', entrarNoSistema);

  // --- Funcionalidades da Barra (Interface que está "morta") ---
  
  // Menu Lateral (Drawer)
  const openMenuBtn = document.getElementById('open-menu-btn');
  const closeMenuBtn = document.getElementById('close-menu-btn');
  const drawer = document.getElementById('drawer');
  const overlay = document.getElementById('drawer-overlay');

  if (openMenuBtn) openMenuBtn.addEventListener('click', () => { drawer.classList.add('active'); overlay.classList.add('active'); });
  if (closeMenuBtn) closeMenuBtn.addEventListener('click', () => { drawer.classList.remove('active'); overlay.classList.remove('active'); });

  // Emojis
  const emojiToggle = document.getElementById('emoji-toggle-btn');
  const emojiKeyboard = document.getElementById('emoji-keyboard');
  if (emojiToggle) emojiToggle.addEventListener('click', () => {
    emojiKeyboard.classList.toggle('emoji-box-hidden');
  });

  // Áudio e Imagem (Chamadas nativas)
  document.getElementById('mic-btn').addEventListener('click', () => {
    alert("Função de áudio reativada: Solicite permissão do microfone.");
  });
  
  document.getElementById('img-btn').addEventListener('click', () => {
    document.getElementById('img-input').click();
  });

  // Verificação inicial
  if(meuApelido) {
    document.getElementById('login-screen').style.display = 'none';
    registrarPresenca();
    ouvirMensagens();
  }
}

// Inicializa tudo
document.addEventListener('DOMContentLoaded', inicializarEventosGerais);
