import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

const firebaseConfig = {
  apiKey: "AIzaSyAs7M-I2V5X-XvG2Y8M1W3O_8b4z7Y",
  authDomain: "chatz-cb30b.firebaseapp.com",
  projectId: "chatz-cb30b",
  storageBucket: "chatz-cb30b.appspot.com",
  messagingSenderId: "36712398412",
  appId: "1:36712398412:web:a62b8b4a7c12f4"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// --- Lógica de Interação ---
function inicializarEventos() {
  const openMenuBtn = document.getElementById('open-menu-btn');
  const drawer = document.getElementById('drawer');
  const overlay = document.getElementById('drawer-overlay');

  // Abertura e Fechamento do Menu Premium
  if (openMenuBtn) {
    openMenuBtn.addEventListener('click', () => {
      drawer.classList.add('active');
      overlay.classList.add('active');
    });
  }

  if (overlay) {
    overlay.addEventListener('click', () => {
      drawer.classList.remove('active');
      overlay.classList.remove('active');
    });
  }

  // Lógica de Login Persistente
  const loginBtn = document.getElementById('enter-btn');
  if (loginBtn) {
    loginBtn.addEventListener('click', () => {
      const nick = document.getElementById('nick-input').value;
      if (nick) {
        localStorage.setItem('chat_nick', nick);
        location.reload();
      }
    });
  }

  // Verifica estado de autenticação
  if (localStorage.getItem('chat_nick')) {
    document.getElementById('login-screen').style.display = 'none';
  }
}

document.addEventListener('DOMContentLoaded', inicializarEventos);
