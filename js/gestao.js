import { initializeApp } from "https://www.gstatic.com/firebasejs/10.10.0/firebase-app.js";
import { getFirestore, collection, query, where, getDocs } from "https://www.gstatic.com/firebasejs/10.10.0/firebase-firestore.js";

let nomeUsuarioLogado; // Variável global para armazenar o nome do usuário logado

async function verificarLogin(usuario, password) {
    
    const firebaseConfig = {
        apiKey: import.meta.env.VITE_API_KEY,
        authDomain: import.meta.env.VITE_AUTH_DOMAIN,
        projectId: import.meta.env.VITE_PROJECT_ID,
        storageBucket: import.meta.env.VITE_STORAGE_BUCKET,
        messagingSenderId: import.meta.env.VITE_MESSAGING_SENDER_ID,
        appId: import.meta.env.VITE_APP_ID,
        measurementId: import.meta.env.VITE_MEASUREMENT_ID
    };
    
    // Inicializar Firebase
    const app = initializeApp(firebaseConfig); 
    const db = getFirestore(app);    
    
    // Consulta no Firestore para verificar se o usuário e senha estão corretos
    const usersRef = collection(db, "baberDigital");
    const q = query(
        usersRef,
        where("usuario", "==", usuario),
        where("password", "==", password)
    );

    const snapshot = await getDocs(q);

    if (snapshot.empty) {
        return false; // Retorna false se não houver nenhum documento que corresponda ao nome e senha
    }

    snapshot.docs.forEach((doc) => {
        nomeUsuarioLogado = usuario; // Salva o nome do usuário na variável global
        localStorage.setItem('nomeUsuarioLogado', usuario); // Salva o nome do usuário no localStorage
        window.location = './telaGestao.html'
    });

    return true; // Retorna true se o usuário for válido
}

// Adiciona a referência para o botão de login
let btnLogin = document.getElementById("btnLogin");

btnLogin.addEventListener("click", async function(){
    const usuario = document.getElementById("usuario").value;
    const password = document.getElementById("password").value;

    const usuarioValido = await verificarLogin(usuario, password);

    if (!usuarioValido) {
        alert("Nome de usuário ou senha incorretos. Por favor, tente novamente.");
    } else {
        carregaAgendamentos(); // Carrega os agendamentos após login bem-sucedido
    }
});

const btnVoltar = document.querySelector("#btnVoltar");
btnVoltar.addEventListener('click', function() {
    window.location = '../index.html';
});
