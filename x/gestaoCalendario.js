import { initializeApp } from "https://www.gstatic.com/firebasejs/10.10.0/firebase-app.js";
import { getFirestore, collection, query, where, getDocs } from "https://www.gstatic.com/firebasejs/10.10.0/firebase-firestore.js";

let nomeUsuarioLogado; // Variável global para armazenar o nome do usuário logado

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

// Função para formatar a data no formato 'dd/mm/yyyy'
function getFormattedDate(date = new Date()) {
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0'); // Janeiro é 0!
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
}

// Função para carregar agendamentos de um dia específico
async function carregaAgendamentosPorDia(data) {
    const agendamentoMesDiv = document.getElementById('agementoMes');
    agendamentoMesDiv.innerHTML = ''; // Limpar resultados anteriores

    const agendamentosRef = collection(db, "agendamentos");
    const q = query(agendamentosRef, where("data", "==", data)); // Filtrar agendamentos pela data clicada

    try {
        const querySnapshot = await getDocs(q);
        
        if (!querySnapshot.empty) {
            console.log("Agendamentos do dia:");
            querySnapshot.forEach((doc) => {
                const agendamento = doc.data();
                console.log(agendamento);
                // Criar card com as informações do agendamento
                const card = document.createElement('div');
                card.className = 'card';
                card.innerHTML = `
                    <h3>${agendamento.nomeUsuario}</h3>
                    <p>Telefone: ${agendamento.telUsuario}</p>
                    <p>Data: ${agendamento.data}</p>
                    <p>Hora: ${agendamento.horario}</p>
                    <p>Serviço: ${agendamento.nomeServico}</p>
                    <p>Tempo: ${agendamento.tempoServico}</p>
                `;
                agendamentoMesDiv.appendChild(card);
            });

        } else {
            console.log("Não há agendamentos para o dia selecionado.");
            agendamentoMesDiv.innerHTML = '<p>Não há agendamentos para o dia selecionado.</p>';
        }
    } catch (error) {
        console.error("Erro ao verificar agendamentos:", error);
        agendamentoMesDiv.innerHTML = '<p>Erro ao carregar os agendamentos.</p>';
    }
}

// Função para carregar agendamentos do mês
async function carregaAgendamentosMes(ano, mes) {
    const agendamentosRef = collection(db, "agendamentos");
    const primeiroDiaMes = new Date(ano, mes, 1);
    const ultimoDiaMes = new Date(ano, mes + 1, 0);

    const agendamentosDoMes = {};

    const querySnapshot = await getDocs(agendamentosRef);
    querySnapshot.forEach((doc) => {
        const agendamento = doc.data();
        const dataAgendamento = new Date(agendamento.data.split('/').reverse().join('/'));
        if (dataAgendamento >= primeiroDiaMes && dataAgendamento <= ultimoDiaMes) {
            const dia = dataAgendamento.getDate();
            if (!agendamentosDoMes[dia]) {
                agendamentosDoMes[dia] = 0;
            }
            agendamentosDoMes[dia]++;
        }
    });

    return agendamentosDoMes;
}

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
    const totalAgendamentos = await somaAgendamentosAgendados();
    const somaAgendamentoElement = document.getElementById('totalAgendamentos');
    somaAgendamentoElement.textContent = `Você esta com ${totalAgendamentos} agendamentos ativos!`;
}

// Função para gerar o calendário do mês
let dataAtual = new Date();

async function gerarCalendario() {
    const diasContainer = document.getElementById('dias');
    const mesAnoElement = document.getElementById('mesAno');
    const mes = dataAtual.getMonth();
    const ano = dataAtual.getFullYear();
    const primeiroDia = new Date(ano, mes, 1).getDay();
    const ultimoDia = new Date(ano, mes + 1, 0).getDate();

    const meses = [
        'Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho',
        'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'
    ];

    mesAnoElement.innerText = `${meses[mes]} ${ano}`;

    // Preencher os dias do mês
    diasContainer.innerHTML = '';
    let htmlDias = '';

    // Preencher os dias em branco do início do mês
    for (let i = 0; i < primeiroDia; i++) {
        htmlDias += '<div class="diaEmBranco"></div>';
    }

    // Obter a soma dos agendamentos para cada dia do mês
    const agendamentosDoMes = await carregaAgendamentosMes(ano, mes);

    // Preencher os dias do mês
    for (let i = 1; i <= ultimoDia; i++) {
        const somaAgendamentos = agendamentosDoMes[i] || 0;
        htmlDias += `
            <div class ="calendarioDia" data-value="${i}">
                ${i}
                <div class="somaAgendamentos">${somaAgendamentos}</div>
            </div>`;
    }

    diasContainer.innerHTML = htmlDias;

   // Adicionar evento de clique a cada dia
    const dias = diasContainer.querySelectorAll('div[data-value]');
    dias.forEach(dia => {
        dia.addEventListener('click', async (event) => {
            const diaClicado = event.currentTarget.getAttribute('data-value');
            const mesAtual = dataAtual.getMonth() + 1; // Mês atual (Janeiro é 0)
            const anoAtual = dataAtual.getFullYear();
            const dataClicada = `${String(diaClicado).padStart(2, '0')}/${String(mesAtual).padStart(2, '0')}/${anoAtual}`;

            await carregaAgendamentosPorDia(dataClicada);
            toggleVisibility(false); // Alterna para a visualização de agendamentos do dia
        });
    });
}

document.getElementById('proximoMes').addEventListener('click', () => {
    dataAtual.setMonth(dataAtual.getMonth() + 1);
    gerarCalendario();
});

document.getElementById('mesAnterior').addEventListener('click', () => {
    dataAtual.setMonth(dataAtual.getMonth() - 1);
    gerarCalendario();
});

// Gerar o calendário ao carregar a página
window.onload = async () => {
    await gerarCalendario();
    await atualizarSomaAgendamentos();
};

//Função btnVoltar para o Calendário.
const btnVoltar = document.querySelector(".btnVoltar");
btnVoltar.addEventListener("click", function() {
    const agendamentoMesDiv = document.getElementById('agementoMes');
    agendamentoMesDiv.innerHTML = ''; // Limpar resultados anteriores
    location.reload();
});


// Adicionar evento de clique ao botão de confirmação
/*const btnConfirmaAgendamento = card.querySelector('.btnConfirmaAgendamento');
btnConfirmaAgendamento.addEventListener("click", function(event){
    event.stopPropagation();
    alert("Atendimento confirmado para " + agendamento.nomeUsuario);
});*/
