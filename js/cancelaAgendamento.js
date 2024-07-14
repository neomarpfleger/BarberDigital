
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.10.0/firebase-app.js";
import { getFirestore, collection, query, where, getDocs } from "https://www.gstatic.com/firebasejs/10.10.0/firebase-firestore.js";

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
const db = getFirestore(app);


document.addEventListener("DOMContentLoaded", async function() {
    // Função para buscar informações do cliente do Firestore
    async function buscarInformacoesCliente() {
        const nomeUsuario = localStorage.getItem('nomeUsuario'); // Obter o nome do usuário do localStorage
        if (!nomeUsuario) {
            alert("Nenhuma informação de usuário encontrada no localStorage.");
            return;
        }

        try {
            const agendamentosRef = collection(db, "agendamentos");
            const q = query(agendamentosRef, where("nomeUsuario", "==", nomeUsuario));
            const querySnapshot = await getDocs(q);

            if (!querySnapshot.empty) {
                const agendamento = querySnapshot.docs[0].data(); // Pega o primeiro agendamento encontrado
                exibirInformacoesCliente(agendamento);
            } else {
                alert("Nenhum agendamento encontrado para este usuário.");
            }
        } catch (e) {
            console.error("Erro ao buscar informações do cliente: ", e);
        }
    }

    // Função para exibir as informações do cliente em um card
    function exibirInformacoesCliente(agendamento) {
        const cardCliente = document.getElementById('cardCliente');
        cardCliente.innerHTML = `
            <div class="card">
                <h3>Informações do Cliente</h3>
                <p><strong>Nome:</strong> ${agendamento.nomeUsuario}</p>
                <p><strong>Serviço:</strong> ${agendamento.nomeServico}</p>
                <p><strong>Tempo:</strong> ${agendamento.tempoServico} minutos</p>
                <p><strong>Data:</strong> ${agendamento.data}</p>
                <p><strong>Horário:</strong> ${agendamento.horario}</p>
                <button type="button" id="CanselamentoDeAgendamento">Cancelar Agendamento</button>
            </div>
        `;
    }

    // Chama a função para buscar informações do cliente ao carregar a página
    buscarInformacoesCliente();
});


const btnCancelaAgendamento = document.querySelector('#btnCancelaAgendamento');
btnCancelaAgendamento.addEventListener('click', function (){
    window.location.href = './html/cancelaAgendamento.html';
});