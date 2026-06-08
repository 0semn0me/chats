import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";

const firebaseConfig = {
  apiKey: "AIzaSyAs7M-I2V5X-XvG2Y8M1W3O_8b4z7Y",
  projectId: "chatz-cb30b",
  appId: "1:36712398412:web:a62b8b4a7c12f4"
};

initializeApp(firebaseConfig);

document.addEventListener('DOMContentLoaded', () => {
  const drawer = document.getElementById('drawer');
  const overlay = document.getElementById('drawer-overlay');
  
  document.getElementById('open-menu-btn').onclick = () => {
    drawer.classList.add('active');
    overlay.classList.add('active');
  };

  overlay.onclick = () => {
    drawer.classList.remove('active');
    overlay.classList.remove('active');
  };

  document.getElementById('enter-btn').onclick = () => {
    localStorage.setItem('chat_nick', document.getElementById('nick-input').value);
    location.reload();
  };

  if(localStorage.getItem('chat_nick')) document.getElementById('login-screen').style.display = 'none';
  
  if(typeof injetarPlanosDeFundoNativos === 'function') injetarPlanosDeFundoNativos();
});
