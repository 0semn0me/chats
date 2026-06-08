import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import { 
  getFirestore, collection, addDoc, query, orderBy, onSnapshot, 
  doc, deleteDoc, updateDoc, setDoc
} from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

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
const COL_PRESENCE = collection(db, "presenca");

// Variáveis Globais
let meuApelido = localStorage.getItem('chat_nick') || '';
let meuNomeReal = localStorage.getItem('chat_nome_real') || '';
let meuAvatar = localStorage.getItem('chat_avatar') || 'https://cdn-icons-png.flaticon.com/512/149/149071.png';
let minhaCor = localStorage.getItem('chatzao_theme_color') || '#534AB7';
let avatarBase64 = ''; 

let selectedMsgId = null;
let selectedMsgData = null;
let replyId = null;
let editId = null;
let pasteImg = null;

const chatContainer = document.getElementById('chat-container');
const txtInput = document.getElementById('full-input');

// Funções de Sistema
async function registrarPresenca() {
  if(!meuApelido) return;
  await setDoc(doc(db, "presenca", meuApelido), {
    apelido: meuApelido,
    nome: meuNomeReal,
    status: "online",
    cor: minhaCor,
    timestamp: Date.now()
  });
}

async function entrarNoSistema() {
  const nomeReal = document.getElementById('nome-real-input').value.trim();
  const apelido = document.getElementById('nick-input').value.trim();
  
  if(!nomeReal || !apelido) return alert("Por favor, informe seu Nome e seu Apelido.");
  
  meuApelido = apelido;
  meuNomeReal = nomeReal;
  // Se subiu foto, usa ela, senão mantém a anterior ou o padrão
  meuAvatar = avatarBase64 || meuAvatar;

  localStorage.setItem('chat_nick', meuApelido);
  localStorage.setItem('chat_nome_real', meuNomeReal);
  localStorage.setItem('chat_avatar', meuAvatar);

  document.getElementById('login-screen').style.display = 'none';
  await addDoc(COL_MSG, { tipo: 'sistema', texto: `${meuApelido} entrou no chat`, tempo: Date.now() });
  await registrarPresenca();
  ouvirMensagens();
}

function inicializarEventosGerais() {
  // Lógica de upload de avatar
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

  document.getElementById('enter-btn').addEventListener('click', entrarNoSistema);
  // ... (o restante da sua lógica de eventos continua aqui)
  if(meuApelido) {
    document.getElementById('login-screen').style.display = 'none';
    registrarPresenca();
    ouvirMensagens();
  }
}

// Inicialização
inicializarEventosGerais();
