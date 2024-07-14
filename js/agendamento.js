/*import { initializeApp } from "https://www.gstatic.com/firebasejs/10.10.0/firebase-app.js";
import { getFirestore, collection, addDoc } from "https://www.gstatic.com/firebasejs/10.10.0/firebase-firestore.js";

const firebaseConfig = {
    apiKey: "AIzaSyCjikfZGyH08hxyNq9lFbeW_nnZKToMDfs",
    authDomain: "barbearia-632bf.firebaseapp.com",
    projectId: "barbearia-632bf",
    storageBucket: "barbearia-632bf.appspot.com",
    messagingSenderId: "900539097858",
    appId: "1:900539097858:web:2b92d32cdb3c209fa5581b",
    measurementId: "G-GK6S7FYXYS"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);*/

const btnAgendamento = document.querySelector(".btnAgendamento");
btnAgendamento.addEventListener("click", async function() {
    console.log("Fui clicado");

    // Capturar os dados do formulário
    const nomeUsuario = document.getElementById("nomeUsuario").value;
    const telUsuario = document.getElementById("telUsuario").value;

    // Verificar se os campos estão preenchidos
    if (nomeUsuario && telUsuario) {
        try {
            // Armazenar o nome do usuário no localStorage
            localStorage.setItem('nomeUsuario', nomeUsuario);

            // Redirecionar para outra página
            window.location.href = "./html/diaHora.html";
        } catch (e) {
            console.error("Erro ao adicionar documento: ", e);
        }
    } else {
        alert("Por favor, preencha todos os campos.");
    }
});
