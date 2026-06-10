import { initializeApp } from 'https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js';
import { getFirestore, collection, addDoc, onSnapshot, query, orderBy, deleteDoc, doc, updateDoc } from 'https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js';

const firebaseConfig = { /* Sua config aqui */ };
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

let currentUser = { name: '', nick: '' };

// Evento de envio com Enter (pula linha com Shift)
document.getElementById('msg-input').addEventListener('keydown', (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
        e.preventDefault();
        enviarMensagem();
    }
});

async function enviarMensagem() {
    const input = document.getElementById('msg-input');
    if (!input.value.trim()) return;

    await addDoc(collection(db, "conversas_v2"), {
        text: input.value,
        sender: currentUser.nick,
        realName: currentUser.name,
        timestamp: Date.now()
    });
    input.value = '';
}

// Lógica de Deletar com Animação
async function deletarMensagem(msgId, element) {
    element.classList.add('deleting-animation');
    
    // Espera 8 segundos antes de remover do Firebase
    setTimeout(async () => {
        await deleteDoc(doc(db, "conversas_v2", msgId));
    }, 8000);
}

// UI: Indicador de conexão flutuante
document.getElementById('connection-indicator').addEventListener('click', () => {
    alert("Lista de usuários online (em breve)");
});

console.log("Sistema Chatzão V2 carregado.");
