import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import { getFirestore, collection } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

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

let avatarBase64 = '';

function inicializarApp() {
  const avatarInput = document.getElementById('avatar-file-input');
  const avatarTrigger = document.getElementById('avatar-upload-trigger');
  
  if(avatarTrigger) {
    avatarTrigger.addEventListener('click', () => avatarInput.click());
    avatarInput.addEventListener('change', (e) => {
      const reader = new FileReader();
      reader.onload = (ev) => {
        avatarBase64 = ev.target.result;
        document.getElementById('avatar-status').style.display = 'block';
      };
      reader.readAsDataURL(e.target.files[0]);
    });
  }

  document.getElementById('enter-btn').addEventListener('click', () => {
    const nome = document.getElementById('nome-real-input').value.trim();
    const nick = document.getElementById('nick-input').value.trim();
    if (!nome || !nick) return alert("Preencha Nome e Nick!");
    localStorage.setItem('chat_nick', nick);
    localStorage.setItem('chat_nome_real', nome);
    if(avatarBase64) localStorage.setItem('chat_avatar', avatarBase64);
    location.reload();
  });

  if (localStorage.getItem('chat_nick')) {
    document.getElementById('login-screen').style.display = 'none';
  }
}

document.addEventListener('DOMContentLoaded', inicializarApp);
