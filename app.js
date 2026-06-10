import { initializeApp } from 'https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js';
import { getFirestore, collection, addDoc } from 'https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js';

// --- ATENÇÃO: COLE SUAS CONFIGURAÇÕES ABAIXO ---
const firebaseConfig = {
    apiKey: "SUA_API_KEY",
    authDomain: "SEU_PROJETO.firebaseapp.com",
    projectId: "SEU_PROJETO_ID",
    storageBucket: "SEU_PROJETO.appspot.com",
    messagingSenderId: "SEU_ID",
    appId: "SEU_APP_ID"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// Lógica de Envio
const msgInput = document.getElementById('msg-input');
msgInput.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
        e.preventDefault();
        enviarMensagem();
    }
});

async function enviarMensagem() {
    const text = msgInput.value.trim();
    if (!text) return;
    await addDoc(collection(db, "conversas_v2"), {
        text: text,
        sender: document.getElementById('nick-name').value,
        timestamp: Date.now()
    });
    msgInput.value = '';
}

document.getElementById('btn-login').addEventListener('click', () => {
    document.getElementById('login-screen').style.display = 'none';
    document.getElementById('chat-screen').style.display = 'flex';
});

console.log("Chatzão V2 pronto e configurado.");
