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

// PERSISTÊNCIA NATIVA - CONTROLE DE LOGIN AUTOMÁTICO
let meuApelido = localStorage.getItem('chat_nick') || '';
let meuNomeReal = localStorage.getItem('chat_nome_real') || '';
let meuAvatar = localStorage.getItem('chat_avatar') || 'https://cdn-icons-png.flaticon.com/512/149/149071.png';
let minhaCor = localStorage.getItem('chatzao_theme_color') || '#534AB7';

let selectedMsgId = null;
let selectedMsgData = null;
let replyId = null;
let editId = null;
let pasteImg = null;

let mediaRecorder = null;
let audioChunks = [];
let isRecording = false;
let recInterval = null;
let recSeconds = 0;

const chatContainer = document.getElementById('chat-container');
const txtInput = document.getElementById('full-input');

// EQUÊNCIAS DE EMOJIS RESTAURADAS EXATAMENTE
const EMOJIS_REGULARES = ["😀","😃","😄","😁","😆","😅","🤣","😂","🙂","🙃","🫠","😉","😊","😇","🥰","😍","🤩","😘","😗","☺️","😚","😙","🥲","😋","😛","😜","🤪","😝","🤑","🤗","🤭","🫢","🫣","🤫","🤔","🫡","🤐","🤨","😐","😑","😶","🫥","😶‍🌫️","😏","😒","🙄","😬","😮‍💨","🤥","🫨","🙂‍↔️","🙂‍↕️","😌","😔","😪","🤤","😴","🫩","😷","🤒","🤕","🤢","🤮","🤧","🥵","🥶","🥴","😵","😵‍💫","🤯","🤠","🥳","🥸","😎","🤓","🧐","😕","🫤","😟","🙁","☹️","😮","😯","😲","😳","🫪","🥺","🥹","😦","😧","😨","😰","😥","😢","😭","😱","😖","😣","😞","😓","😩","😫","🥱","😤","😡","😠","🤬","😈","👿","💀","☠️","💩","🤡","👹","👺","👻","👽","👾","🤖"];
const EMOJIS_MAOS = ["👋","🤚","🖐️","✋","🖖","🫱","🫲","🫳","🫴","🫷","🫸","👌","🤌","🤏","✌️","🤞","🫰","🤟","🤘","🤙","👈","👉","👆","🖕","👇","☝️","🫵","👍","👎","✊","👊","🤛","🤜","👏","🙌","👐","🤲","🤝","🙏"];
const EMOJIS_PESSOAS = ["🙍","🙍‍♂️","🙍‍♀️","🙎","🙎‍♂️","🙎‍♀️","🙅","🙅‍♂️","🙅‍♀️","🙆","🙆‍♂️","🙆‍♀️","💁","🙍‍♂️","💁‍♀️","🙋","🙋‍♂️","🙋‍♀️","🧏","🧏‍♂️","🧏‍♀️","🙇","🙇‍♂️","🙇‍♀️","🤦","🤦‍♂️","🤦‍♀️","🤷","🤷‍♂️","🤷‍♀️"];
const PELE_MODS = ["", "🏻", "🏼", "🏽", "🏾", "🏿"];

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

function escutarPresenca() {
  onSnapshot(COL_PRESENCE, (snap) => {
    const listEl = document.getElementById('online-users-list');
    if(!listEl) return;
    listEl.innerHTML = "";
    snap.forEach(d => {
      const u = d.data();
      const li = document.createElement('li');
      // Exibe estritamente o @Apelido nas marcações
      li.innerHTML = `<span style="width:8px;height:8px;background:${u.cor || 'var(--p)'};border-radius:50%"></span> <b>@${u.apelido}</b>`;
      li.style.cursor = "pointer";
      li.addEventListener('click', () => {
        txtInput.value += `@${u.apelido} `;
        txtInput.focus();
        document.getElementById('online-users-flav').style.display = "none";
      });
      listEl.appendChild(li);
    });
  });
}

function inicializarEventosGerais() {
  carregarPreferenciasGuardadas();
  escutarPresenca();

  // LOGIN AUTOMÁTICO: Se já tem apelido salvo, pula a tela direto
  if(meuApelido) {
    document.getElementById('login-screen').style.display = 'none';
    registrarPresenca();
    ouvirMensagens();
  }

  document.getElementById('enter-btn').addEventListener('click', entrarNoSistema);
  
  document.getElementById('sair-btn').addEventListener('click', async () => {
    // Sair limpa a persistência para permitir trocar de nome
    if(meuApelido) await deleteDoc(doc(db, "presenca", meuApelido));
    localStorage.removeItem('chat_nick');
    localStorage.removeItem('chat_nome_real');
    location.reload();
  });

  // Disparador da bolinha verde de conectados
  document.getElementById('status-online-trigger').addEventListener('click', (e) => {
    e.stopPropagation();
    const f = document.getElementById('online-users-flav');
    f.style.display = f.style.display === "flex" ? "none" : "flex";
  });
  document.addEventListener('click', () => {
    document.getElementById('online-users-flav').style.display = "none";
  });

  const drawer = document.getElementById('drawer');
  const overlay = document.getElementById('drawer-overlay');
  document.getElementById('open-menu-btn').addEventListener('click', ()=>{ drawer.classList.add('open'); overlay.style.display = 'block'; });
  document.getElementById('close-menu-btn').addEventListener('click', ()=>{ drawer.classList.remove('open'); overlay.style.display = 'none'; });
  overlay.addEventListener('click', ()=>{ drawer.classList.remove('open'); overlay.style.display = 'none'; });

  document.getElementById('emoji-toggle-btn').addEventListener('click', () => {
    document.getElementById('emoji-keyboard').classList.toggle('emoji-box-hidden');
  });

  document.querySelectorAll('.tab-item').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('.tab-item').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      renderizarCategoriaEmoji(btn.dataset.cat);
    });
  });
  renderizarCategoriaEmoji('regulares');

  // Teclado nativo pula linha com Enter puro
  txtInput.addEventListener('keydown', (e) => {
    if(e.key === 'Enter' && !e.shiftKey) {
      // Deixa pular linha nativamente
    }
  });
}

async function entrarNoSistema() {
  const nomeReal = document.getElementById('nome-real-input').value.trim();
  const apelido = document.getElementById('nick-input').value.trim();
  let avatar = document.getElementById('avatar-input').value.trim();

  if(!nomeReal || !apelido) return alert("Por favor, informe seu Nome e seu Apelido.");
  if(!avatar) avatar = "https://cdn-icons-png.flaticon.com/512/149/149071.png";

  meuApelido = apelido;
  meuNomeReal = nomeReal;
  meuAvatar = avatar;

  localStorage.setItem('chat_nick', meuApelido);
  localStorage.setItem('chat_nome_real', meuNomeReal);
  localStorage.setItem('chat_avatar', meuAvatar);

  document.getElementById('login-screen').style.display = 'none';

  // Log textual enxuto dispara estritamente na primeira conexão
  await addDoc(COL_MSG, {
    tipo: 'sistema',
    texto: `${meuApelido} entrou no chat`,
    tempo: Date.now()
  });

  await registrarPresenca();
  ouvirMensagens();
}

function renderizarCategoriaEmoji(cat) {
  const grid = document.getElementById('emoji-grid-render');
  grid.innerHTML = "";
  let targetArr = EMOJIS_REGULARES;
  let comPele = false;

  if(cat === 'maos') { targetArr = EMOJIS_MAOS; comPele = true; }
  if(cat === 'pessoas') { targetArr = EMOJIS_PESSOAS; comPele = true; }

  targetArr.forEach(emo => {
    const span = document.createElement('span');
    span.className = "emoji-clickable";
    span.innerText = emo;
    
    span.addEventListener('click', (e) => {
      // REGRA 5: Clique direto no navegador abre a tabela flutuante instantaneamente
      if(comPele) {
        abrirSeletorPele(e, emo);
      } else {
        txtInput.value += emo;
        txtInput.focus();
      }
    });
    grid.appendChild(span);
  });
}

function abrirSeletorPele(e, baseEmoji) {
  e.stopPropagation();
  const picker = document.getElementById('skin-tone-picker');
  picker.innerHTML = "";
  picker.classList.remove('skin-picker-hidden');

  const rect = e.target.getBoundingClientRect();
  picker.style.top = `${rect.top - 54 + window.scrollY}px`;
  picker.style.left = `${rect.left + window.scrollX}px`;

  PELE_MODS.forEach(mod => {
    const b = document.createElement('span');
    b.className = "skin-block";
    b.innerText = baseEmoji + mod;
    b.addEventListener('click', () => {
      txtInput.value += b.innerText;
      picker.classList.add('skin-picker-hidden');
      txtInput.focus();
    });
    picker.appendChild(b);
  });
}

document.addEventListener('click', (e) => {
  if(!e.target.classList.contains('skin-block')) {
    document.getElementById('skin-tone-picker').classList.add('skin-picker-hidden');
  }
});

function ouvirMensagens(){
  const q = query(COL_MSG, orderBy("tempo", "asc"));
  onSnapshot(q, (snapshot)=>{
    chatContainer.innerHTML = '';
    snapshot.forEach((d)=>{
      renderizarMensagem(d.id, d.data());
    });
    chatContainer.scrollTop = chatContainer.scrollHeight;
    vincularEventosAudio();
  });
}

function renderizarMensagem(id, m){
  if(m.tipo === 'sistema') {
    const sLog = document.createElement('div');
    sLog.className = "system-log-text";
    sLog.innerText = m.texto;
    chatContainer.appendChild(sLog);
    return;
  }

  const isMe = m.nick === meuApelido;
  const wrapper = document.createElement('div');
  wrapper.className = `msg-wrapper-full ${isMe ? 'me' : 'other'}`;
  
  const imgAv = document.createElement('img');
  imgAv.className = "user-avatar";
  imgAv.src = m.avatar || 'https://cdn-icons-png.flaticon.com/512/149/149071.png';
  
  const row = document.createElement('div');
  row.className = `msg-row ${isMe ? 'me' : 'other'}`;

  let replyHTML = '';
  if(m.replyTo){
    replyHTML = `<div class="reply-badge"><span class="reply-badge-target">@${m.replyTo.nick}</span> ${m.replyTo.texto || 'Mídia'}</div>`;
  }

  let contentHTML = '';
  if(m.tipo === 'imagem'){
    contentHTML = `<img src="${m.url}" class="msg-media" alt="Mídia">`;
  } else if(m.tipo === 'audio'){
    contentHTML = `
      <div class="audio-player">
        <button class="audio-btn dynamic-play-btn"><i class="ti ti-play"></i></button>
        <input type="range" class="audio-slider" min="0" max="100" value="0">
        <span class="audio-time">0:00</span>
        <audio src="${m.url}" class="native-audio-el" preload="metadata"></audio>
      </div>
    `;
  } else {
    contentHTML = `<span>${formatarTexto(m.texto)}</span>`;
  }

  const hora = m.tempo ? new Date(m.tempo).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'}) : '--:--';

  let reactionsHTML = "";
  if(m.reactions && Object.keys(m.reactions).length > 0) {
    reactionsHTML = `<div class="reactions-wrapper">`;
    Object.entries(m.reactions).forEach(([user, emo]) => {
      reactionsHTML += `<span class="reaction-item-bubble" title="${user}">${emo}</span>`;
    });
    reactionsHTML += `</div>`;
  }

  // REGRA 1: Aplica as cores customizadas atreladas dinamicamente à mensagem
  const corCard = isMe ? (m.userColor || 'var(--p)') : 'var(--s1)';
  const estiloCard = isMe ? `background:${corCard}; border:none; color:var(--pt)` : `background:var(--s1); border-color:var(--b1)`;

  row.innerHTML = `
    <div class="msg-meta" style="color: ${m.userColor || 'var(--t3)'}">
      <span>${m.nick}</span>
      ${m.editado ? '<span style="font-size:9px;opacity:0.5">(editada)</span>' : ''}
    </div>
    <div class="msg-box ${m.isTriggeredDeletedLoop ? 'msg-box-deleted-loop' : ''}" style="${estiloCard}">
      ${replyHTML}
      ${contentHTML}
      <span class="msg-time" style="${isMe ? 'color:rgba(255,255,255,0.6)' : 'color:var(--t3)'}">${hora}</span>
      ${reactionsHTML}
    </div>
  `;

  // REGRA 4: O loop roda apenas na primeira passagem visual do usuário local
  if(m.isTriggeredDeletedLoop && !localStorage.getItem(`visto_del_${id}`)) {
    localStorage.setItem(`visto_del_${id}`, 'true');
    setTimeout(async () => {
      await updateDoc(doc(db, "mensagens", id), { isTriggeredDeletedLoop: false });
    }, 8000);
  }

  const box = row.querySelector('.msg-box');
  box.addEventListener('click', () => abrirAcoes(id, m));

  if(m.tipo === 'imagem'){
    row.querySelector('.msg-media').addEventListener('click', (e)=>{
      e.stopPropagation();
      document.getElementById('lbx-img').src = m.url;
      document.getElementById('lightbox').style.display = 'flex';
    });
  }

  wrapper.appendChild(imgAv);
  wrapper.appendChild(row);
  chatContainer.appendChild(wrapper);
}

function formatarTexto(t){
  if(!t) return '';
  return t.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/\n/g, '<br>');
}

const sheet = document.getElementById('msg-actions-sheet');
function abrirAcoes(id, m){
  selectedMsgId = id; selectedMsgData = m; sheet.style.display = 'flex';
  const isMe = m.nick === meuApelido;
  
  // Menu Enxuto Obrigatório para mensagem própria
  if(isMe) {
    document.getElementById('act-reply').style.display = 'none';
    document.getElementById('reactions-header-box').style.display = 'none';
    document.getElementById('act-del').style.display = 'flex';
    document.getElementById('act-edit').style.display = m.tipo === 'texto' ? 'flex' : 'none';
  } else {
    document.getElementById('act-reply').style.display = 'flex';
    document.getElementById('reactions-header-box').style.display = 'flex';
    document.getElementById('act-del').style.display = 'none';
    document.getElementById('act-edit').style.display = 'none';
  }
}

document.querySelectorAll('.react-click').forEach(span => {
  span.addEventListener('click', async () => {
    let currentReactions = selectedMsgData.reactions || {};
    currentReactions[meuApelido] = span.dataset.emo;
    await updateDoc(doc(db, "mensagens", selectedMsgId), { reactions: currentReactions });
    sheet.style.display = 'none';
  });
});

document.getElementById('act-cancel').addEventListener('click', ()=>sheet.style.display='none');

document.getElementById('act-reply').addEventListener('click', ()=>{
  replyId = selectedMsgId; document.getElementById('edit-panel').style.display = 'none'; editId = null;
  document.getElementById('reply-text').innerText = `@${selectedMsgData.nick}: ${selectedMsgData.texto || 'Mídia'}`;
  document.getElementById('reply-panel').style.display = 'flex'; sheet.style.display = 'none'; txtInput.focus();
});

document.getElementById('act-edit').addEventListener('click', ()=>{
  editId = selectedMsgId; document.getElementById('reply-panel').style.display = 'none'; replyId = null;
  txtInput.value = selectedMsgData.texto || ''; document.getElementById('edit-text').innerText = `Editando sua mensagem...`;
  document.getElementById('edit-panel').style.display = 'flex'; sheet.style.display = 'none'; txtInput.focus();
});

document.getElementById('act-del').addEventListener('click', async()=>{
  await updateDoc(doc(db, "mensagens", selectedMsgId), {
    tipo: 'texto',
    texto: "🚫 Mensagem Apagada",
    isTriggeredDeletedLoop: true
  });
  sheet.style.display = 'none';
});

async function enviarMensagem(){
  const texto = txtInput.value.trim();
  if(!texto && !pasteImg) return;

  let pacote = {
    nick: meuApelido,
    avatar: meuAvatar,
    userColor: minhaCor,
    tempo: Date.now(),
    tipo: 'texto'
  };

  if(replyId){
    pacote.replyTo = { id: replyId, nick: selectedMsgData.nick, texto: selectedMsgData.texto || '' };
    cancelReply();
  }

  if(editId){
    await updateDoc(doc(db, "mensagens", editId), { texto: texto, editado: true });
    cancelEdit(); txtInput.value = ''; return;
  }

  if(pasteImg){
    pacote.tipo = 'imagem'; pacote.url = pasteImg; pasteImg = null;
    document.getElementById('paste-preview').style.display = 'none';
  } else {
    pacote.texto = texto;
  }

  txtInput.value = '';
  await addDoc(COL_MSG, { ...pacote });
}

document.getElementById('send-btn').addEventListener('click', enviarMensagem);

// GRAVAÇÃO COM EXPANSÃO DA CAIXA FLUTUANTE
const micBtn = document.getElementById('mic-btn');
const micTimer = document.getElementById('mic-timer');

micBtn.addEventListener('click', async()=>{
  if(!isRecording){
    if(!navigator.mediaDevices) return alert('Dispositivo sem suporte a áudio.');
    try{
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      audioChunks = [];
      mediaRecorder = new MediaRecorder(stream, { audioBitsPerSecond : 128000 });
      mediaRecorder.ondataavailable = e => audioChunks.push(e.data);
      mediaRecorder.onstop = async () => {
        const blob = new Blob(audioChunks, { type: 'audio/mp3' });
        const reader = new FileReader(); reader.readAsDataURL(blob);
        reader.onloadend = async () => {
          await addDoc(COL_MSG, {
            nick: meuApelido, avatar: meuAvatar, userColor: minhaCor,
            tempo: Date.now(), tipo: 'audio', url: reader.result
          });
        };
        stream.getTracks().forEach(t => t.stop());
      };
      mediaRecorder.start();
      isRecording = true;
      micBtn.classList.add('rec-active');
      micTimer.style.display = "inline";
      recSeconds = 0;
      recInterval = setInterval(() => {
        recSeconds++;
        const m = Math.floor(recSeconds / 60).toString().padStart(2, '0');
        const s = (recSeconds % 60).toString().padStart(2, '0');
        micTimer.innerText = `${m}:${s}`;
      }, 1000);
    }catch(err){ alert('Gravação negada.'); }
  } else {
    mediaRecorder.stop(); isRecording = false;
    micBtn.classList.remove('rec-active'); micTimer.style.display = "none";
    clearInterval(recInterval);
  }
});

function vincularEventosAudio(){
  document.querySelectorAll('.audio-player').forEach(player => {
    const audio = player.querySelector('.native-audio-el');
    const playBtn = player.querySelector('.dynamic-play-btn');
    const slider = player.querySelector('.audio-slider');
    const timeDisplay = player.querySelector('.audio-time');

    if(player.dataset.bound) return;
    player.dataset.bound = "true";

    playBtn.addEventListener('click', ()=>{
      if(audio.paused){ audio.play(); playBtn.innerHTML = '<i class="ti ti-pause"></i>'; } 
      else { audio.pause(); playBtn.innerHTML = '<i class="ti ti-play"></i>'; }
    });

    audio.addEventListener('timeupdate', ()=>{
      if(!audio.duration) return;
      slider.value = (audio.currentTime / audio.duration) * 100;
      const m = Math.floor(audio.currentTime / 60); const s = Math.floor(audio.currentTime % 60);
      timeDisplay.innerText = `${m}:${s < 10 ? '0' : ''}${s}`;
    });
  });
}

// CHROMA DINÂMICO E REVERSÃO DE CORES EM ÍCONES
const canvasChroma = document.getElementById('dc-canvas');
const ctxChroma = canvasChroma ? canvasChroma.getContext('2d') : null;
const hueSliderChroma = document.getElementById('dc-hue');

function renderChromaPanel(hue) {
  if (!canvasChroma || !ctxChroma) return;
  ctxChroma.clearRect(0, 0, canvasChroma.width, canvasChroma.height);
  for (let y = 0; y < canvasChroma.height; y++) {
    const l = 100 - (y / canvasChroma.height) * 100;
    const grad = ctxChroma.createLinearGradient(0, y, canvasChroma.width, y);
    grad.addColorStop(0, `hsl(${hue}, 0%, ${l}%)`);
    grad.addColorStop(1, `hsl(${hue}, 100%, ${l}%)`);
    ctxChroma.fillStyle = grad; ctxChroma.fillRect(0, y, canvasChroma.width, 1);
  }
}

if (hueSliderChroma) {
  hueSliderChroma.addEventListener('input', (e) => renderChromaPanel(e.target.value));
  renderChromaPanel(hueSliderChroma.value);
}

if (canvasChroma) {
  canvasChroma.addEventListener('click', async (e) => {
    const rect = canvasChroma.getBoundingClientRect();
    const x = e.clientX - rect.left; const y = e.clientY - rect.top;
    const s = Math.round((x / canvasChroma.width) * 100); const l = Math.round(100 - (y / canvasChroma.height) * 100);
    minhaCor = `hsl(${hueSliderChroma.value}, ${s}%, ${l}%)`;
    
    document.documentElement.style.setProperty('--p', minhaCor);
    localStorage.setItem('chatzao_theme_color', minhaCor);
    
    document.querySelectorAll('.icon-dynamic').forEach(el => el.style.color = minhaCor);
    await registrarPresenca();
  });
}

function injetarPlanosDeFundoNativos() {
  const containerLista = document.getElementById('drawer-bg-list');
  if (!containerLista) return;
  containerLista.innerHTML = "";
  
  if (window.CHATZAO_BG) {
    window.CHATZAO_BG.forEach((bg) => {
      const btn = document.createElement('button');
      btn.className = "bg-item-btn";
      btn.innerHTML = `<i class="ti ti-photo icon-dynamic"></i> ${bg.label}`;
      btn.addEventListener('click', () => {
        executarMudancaBackground(bg.src);
        document.querySelectorAll('.bg-item-btn').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
      });
      containerLista.appendChild(btn);
    });
  }
}

function ejecutarMudancaBackground(src) {
  const overlayDoFundo = document.getElementById('bg-overlay');
  if (overlayDoFundo) {
    overlayDoFundo.style.backgroundImage = `url('${src}')`;
    localStorage.setItem('chatzao_custom_bg', src);
  }
}

function carregarPreferenciasGuardadas() {
  if (minhaCor) {
    document.documentElement.style.setProperty('--p', minhaCor);
    setTimeout(() => {
      document.querySelectorAll('.icon-dynamic').forEach(el => el.style.color = minhaCor);
    }, 400);
  }
  const fundoSalvo = localStorage.getItem('chatzao_custom_bg');
  if (fundoSalvo) executarMudancaBackground(fundoSalvo);
}

function cancelReply(){ replyId = null; document.getElementById('reply-panel').style.display = 'none'; }
function cancelEdit(){ editId = null; document.getElementById('edit-panel').style.display = 'none'; txtInput.value = ''; }

const imgInput = document.getElementById('img-input');
document.getElementById('img-btn').addEventListener('click', ()=>imgInput.click());
imgInput.addEventListener('change', (e)=>{
  const file = e.target.files[0]; if(!file) return;
  const reader = new FileReader();
  reader.onload = (evt)=>{ pasteImg = evt.target.result; document.getElementById('paste-img-el').src = pasteImg; document.getElementById('paste-preview').style.display = 'flex'; };
  reader.readAsDataURL(file);
});

const uploadInputFundo = document.getElementById('bg-upload-input');
const uploadTriggerFundo = document.getElementById('bg-upload-trigger');
if (uploadTriggerFundo && uploadInputFundo) {
  uploadTriggerFundo.addEventListener('click', () => uploadInputFundo.click());
  uploadInputFundo.addEventListener('change', (e) => {
    const arquivo = e.target.files[0];
    if (arquivo) {
      const leitor = new FileReader();
      leitor.onload = (event) => executarMudancaBackground(event.target.result);
      leitor.readAsDataURL(arquivo);
    }
  });
}

document.getElementById('reply-cancel').addEventListener('click', cancelReply);
document.getElementById('edit-cancel').addEventListener('click', cancelEdit);
document.getElementById('lightbox').addEventListener('click', ()=>document.getElementById('lightbox').style.display='none');

// Start up
inicializarEventosGerais();
injetarPlanosDeFundoNativos();
