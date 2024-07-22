import { initializeApp } from "https://www.gstatic.com/firebasejs/10.10.0/firebase-app.js";
import { getFirestore, collection, query, where, getDocs, updateDoc, doc } from "https://www.gstatic.com/firebasejs/10.10.0/firebase-firestore.js";

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

// Inicializar Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

document.addEventListener("DOMContentLoaded", function() {
    // Chama a função para buscar informações do cliente ao carregar a página
    buscarInformacoesCliente();

    // Adiciona listener ao botão de cancelamento de agendamento se existir
    const btnCancelaAgendamento = document.querySelector('#btnCancelaAgendamento');
    if (btnCancelaAgendamento) {
        btnCancelaAgendamento.addEventListener('click', function() {
            window.location.href = './html/cancelaAgendamento.html';
        });
    }
});

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
            exibirInformacoesCliente(querySnapshot.docs);
        } else {
            exibirMensagemSemAgendamentos();
        }
    } catch (error) {
        console.error("Erro ao buscar informações do cliente: ", error);
        alert("Ocorreu um erro ao buscar as informações do cliente.");
    }
}

// Função para exibir as informações do cliente em um card
function exibirInformacoesCliente(agendamentos) {
    const cardCliente = document.getElementById('cardCliente');
    if (cardCliente) {
        cardCliente.innerHTML = ''; // Limpar conteúdo anterior
        let agendamentosValidos = 0;

        agendamentos.forEach((doc) => {
            const agendamento = doc.data();
            if (agendamento.statusAgendamento !== "Cancelado") { // Verificar se o agendamento não está cancelado
                agendamentosValidos++;
                const card = document.createElement('div');
                card.className = 'card';
                card.innerHTML = `
                    <div class="cardCliente">
                        <h3>Informações do Cliente</h3>
                        <p><strong>Nome:</strong> ${agendamento.nomeUsuario}</p>
                        <p><strong>Serviço:</strong> ${agendamento.nomeServico}</p>
                        <p><strong>Tempo:</strong> ${agendamento.tempoServico} minutos</p>
                        <p><strong>Data:</strong> ${agendamento.data}</p>
                        <p><strong>Horário:</strong> ${agendamento.horario}</p>
                        <button type="button" class="btnStatusAgendamento" data-id="${doc.id}">Cancelar Agendamento</button>
                    </div>
                `;
                cardCliente.appendChild(card);

                // Adicionar listener para os botões de cancelamento de cada agendamento
                document.querySelector(`.btnStatusAgendamento[data-id="${doc.id}"]`).addEventListener('click', function() {
                    const agendamentoId = this.getAttribute('data-id');
                    cancelarAgendamento(agendamentoId);
                });
            }
        });

        // Se nenhum agendamento válido for encontrado, exibir mensagem
        if (agendamentosValidos === 0) {
            exibirMensagemSemAgendamentos();
        }
    } else {
        console.error("Elemento 'cardCliente' não encontrado.");
    }
}

// Função para exibir mensagem de que não há agendamentos
function exibirMensagemSemAgendamentos() {
    const cardCliente = document.getElementById('cardCliente');


    /*if (nomeUsuario && telUsuario) {
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
    }*/


    if (cardCliente) {
        cardCliente.innerHTML = `
            <div id="consultaNegativa">
                <h1>Você não possui agendamentos.</h1>
                <button type="button" class="btnVoltar">Voltar</button>
            </div>
        `;

        // Adicionar listener ao botão "Voltar"
        document.querySelector('.btnVoltar').addEventListener('click', function() {
            window.location.href = '../index.html';
        });
    }
}

// Função para cancelar agendamento
async function cancelarAgendamento(agendamentoId) {
    try {
        const agendamentoDoc = doc(db, "agendamentos", agendamentoId);
        await updateDoc(agendamentoDoc, {
            statusAgendamento: "Cancelado"
        });
        alert("Agendamento cancelado com sucesso.");
        // Recarregar a lista de agendamentos após o cancelamento
        buscarInformacoesCliente();
    } catch (error) {
        console.error("Erro ao cancelar o agendamento: ", error);
        alert("Ocorreu um erro ao cancelar o agendamento.");
    }
}
