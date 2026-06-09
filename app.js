import { initializeApp } from 'https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js';
import { getFirestore, collection, addDoc, onSnapshot, query, orderBy, doc, deleteDoc } from 'https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js';

// RESET DE SISTEMA: Aponta para a nova coleção
const db = getFirestore();
const MSG_COLLECTION = "mensagens_v2";

// Envio com Shift+Enter
const input = document.getElementById('msg-input');
input.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' && e.shiftKey) {
        e.preventDefault();
        enviarMensagem();
    }
});

// Qualidade de Mídia (Nativa)
async function capturarMidia() {
    const stream = await navigator.mediaDevices.getUserMedia({ 
        video: { width: { ideal: 4096 }, height: { ideal: 2160 } }, audio: true 
    });
    // ... lógica de processamento mantendo o blob original
}

// Lógica de Deletar com Animação
async function deletarMensagem(msgId, element) {
    element.classList.add('msg-deleted');
    setTimeout(() => {
        deleteDoc(doc(db, MSG_COLLECTION, msgId));
    }, 8000);
}
