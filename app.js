import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import { getFirestore, collection, addDoc, doc, setDoc } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

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
const COL_MSG = collection(db, "mensagens");

// Função de Inicialização (Designer: Garante que os elementos existam antes de interagir)
function iniciarChat() {
  const enterBtn = document.getElementById('enter-btn');
  
  if (enterBtn) {
    enterBtn.addEventListener('click', () => {
      const nome = document.getElementById('nome-real-input').value.trim();
      const nick = document.getElementById('nick-input').value.trim();
      
      if (!nome || !nick) return alert("Por favor, preencha os campos obrigatórios.");
      
      localStorage.setItem('chat_nick', nick);
      location.reload(); // Designer: Recarrega para aplicar o contexto do usuário limpo
    });
  }

  // Verificação de autenticação persistente
  const apelidoGuardado = localStorage.getItem('chat_nick');
  if (apelidoGuardado) {
    document.getElementById('login-screen').style.display = 'none';
  }

  // Carregamento de módulos visuais extras (se existirem no bg.js)
  if (typeof injetarPlanosDeFundoNativos === 'function') {
    injetarPlanosDeFundoNativos();
  }
}

// Execução segura
document.addEventListener('DOMContentLoaded', iniciarChat);
