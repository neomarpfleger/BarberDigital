import { initializeApp } from "https://www.gstatic.com/firebasejs/10.10.0/firebase-app.js";
import { getFirestore, collection, query, where, getDocs } from "https://www.gstatic.com/firebasejs/10.10.0/firebase-firestore.js";


// Configuração do Firebase
const firebaseConfig = {
    apiKey: "AIzaSyCjikfZGyH08hxyNq9lFbeW_nnZKToMDfs",
    authDomain: "barbearia-632bf.firebaseapp.com",
    projectId: "barbearia-632bf",
    storageBucket: "barbearia-632bf",
    messagingSenderId: "900539097858",
    appId: "1:900539097858:web:2b92d32cdb3c209fa5581b",
    measurementId: "G-GK6S7FYXYS"
};

// Inicialização do Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// Função para somar todos os agendamentos que estão com status de "agendado"
async function somaAgendamentosAgendados() {
    const agendamentosRef = collection(db, "agendamentos");
    const q = query(agendamentosRef, where("statusAgendamento", "==", "Agendado")); // Filtrar agendamentos pelo status "agendado"

    try {
        const querySnapshot = await getDocs(q);
        let totalAgendados = 0;
        
        querySnapshot.forEach((doc) => {
            totalAgendados++;
        });
        console.log(totalAgendados)
        return totalAgendados;
    } catch (error) {
        console.error("Erro ao somar agendamentos:", error);
        return 0;
    }
}

// Função para atualizar a soma dos agendamentos com status "agendado"
async function atualizarSomaAgendamentos() {

    //Resgata o nome do usuario armazenado no localStorage
    let nomeUsuarioLogado = localStorage.getItem("nomeUsuarioLogado");
    const totalAgendamentos = await somaAgendamentosAgendados();
    const somaAgendamentoElement = document.getElementById('totalAgendamentos');
    somaAgendamentoElement.innerHTML = `<h1 class= "tituloh1" >Seja Bem Vindo ${nomeUsuarioLogado}</h1>
                                        <h2 class= "tituloh2" titulo>Você está com <span>${totalAgendamentos}</span> agendamentos ativos!</h2>`
}

window.onload = async () => {
    await atualizarSomaAgendamentos();
};
