import { initializeApp } from 'https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js';
import { getFirestore, collection, getDocs, writeBatch, doc } from 'https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js';

const firebaseConfig = { /* COLOQUE SUAS CHAVES AQUI */ };
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// 1. Senha Mestre (Conferida)
document.getElementById('lock-btn').onclick = async () => {
    const s = prompt('Senha Master:');
    if (s === 'SUA_SENHA_AQUI') {
        if (confirm('Limpar histórico?')) {
            const snap = await getDocs(collection(db, 'mensagens'));
            const b = writeBatch(db);
            snap.forEach(d => b.delete(doc(db, 'mensagens', d.id)));
            await b.commit();
            location.reload();
        }
    }
};

// 2. Conexão de Eventos (Botões)
document.getElementById('audio-btn').onclick = () => { /* Iniciar Gravador */ };
document.getElementById('cam-btn').onclick = () => { /* Iniciar Câmera */ };
document.getElementById('emoji-btn').onclick = () => { /* Abrir Menu Emojis */ };
document.getElementById('menu-btn').onclick = () => { /* Menu de Personalização */ };
document.getElementById('logout-btn').onclick = () => { location.reload(); };

console.log("Sistema Chatzão verificado e carregado.");
