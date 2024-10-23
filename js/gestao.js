import { initializeApp } from "https://www.gstatic.com/firebasejs/10.10.0/firebase-app.js";
import { getFirestore, collection, query, where, getDocs } from "https://www.gstatic.com/firebasejs/10.10.0/firebase-firestore.js";

let nomeUsuarioLogado; // Variável global para armazenar o nome do usuário logado

async function verificarLogin(usuario, password) {
    // Configuração do Firebase
    const firebaseConfig = {
        apiKey: "AIzaSyCjikfZGyH08hxyNq9lFbeW_nnZKToMDfs",
        authDomain: "barbearia-632bf.firebaseapp.com",
        projectId: "barbearia-632bf",
        storageBucket: "barbearia-632bf.appspot.com",
        messagingSenderId: "900539097858",
        appId: "1:900539097858:web:2b92d32cdb3c209fa5581b",
        measurementId: "G-GK6S7FYXYS"
    };

    // Inicialização do Firebase
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
