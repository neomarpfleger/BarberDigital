import { initializeApp } from "https://www.gstatic.com/firebasejs/10.10.0/firebase-app.js";
import { getFirestore, collection, addDoc } from "https://www.gstatic.com/firebasejs/10.10.0/firebase-firestore.js";

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

document.addEventListener("DOMContentLoaded", function() {
    const usuarioCard = document.getElementById('usuarioCard');

    const nomeUsuario = localStorage.getItem('nomeUsuario');
    const nomeServico = localStorage.getItem('selectedService');
    const tempoServico = localStorage.getItem('selectedTime');
    const diaSelecionado = localStorage.getItem('diaSelecionado');
    const mesAnoSelecionado = localStorage.getItem('mesAnoSelecionado');
    const horario = localStorage.getItem('horario');

    function mostrarInformacoesUsuario() {
        usuarioCard.innerHTML = `
            <h3>Informações do Usuário</h3>
            <p><strong>Nome:</strong> ${nomeUsuario || 'Não fornecido'}</p>
            <p><strong>Serviço:</strong> ${nomeServico || 'Não selecionado'}</p>
            <p><strong>Tempo:</strong> ${tempoServico ? tempoServico + ' minutos' : 'Não selecionado'}</p>
            <p><strong>Data:</strong> ${diaSelecionado ? diaSelecionado + ' de ' + mesAnoSelecionado : 'Não selecionada'}</p>
            <p><strong>Horário:</strong> ${horario || 'Não fornecido'}</p>
        `;
    }

    mostrarInformacoesUsuario();
});

const btnConfirmacaoDeAgendamento = document.querySelector("#btnConfirmacaoDeAgendamento");

btnConfirmacaoDeAgendamento.addEventListener('click', async () => {

    const nomeUsuario = localStorage.getItem('nomeUsuario') || 'Não fornecido';
    const nomeServico = localStorage.getItem('selectedService') || 'Não selecionado';
    const tempoServico = parseInt(localStorage.getItem('selectedTime'), 10); // Certifique-se de que seja um número
    const diaSelecionado = localStorage.getItem('diaSelecionado');
    const mesAnoSelecionado = localStorage.getItem('mesAnoSelecionado');
    const horario = localStorage.getItem('horario') || 'Não fornecido';

    // Verificar se a data e o horário foram fornecidos
    if (!diaSelecionado || !mesAnoSelecionado || !horario) {
        alert('Por favor, forneça a data e o horário.');
        return;
    }

    // Converter data para o formato desejado
    const { mesNumero, ano } = parseMesAno(mesAnoSelecionado);
    const data = `${diaSelecionado}/${mesNumero}/${ano}`;

    // Adicionar o agendamento ao Firestore
    await addAgendamento(horario, data, nomeUsuario, nomeServico, tempoServico);

    // Se tempoServico for maior que 21 minutos, adicionar um segundo agendamento
    if (tempoServico > 21) {
        const [hora, minuto] = horario.split(':').map(Number);
        const novoMinuto = minuto + 20;
        const novaHora = novoMinuto >= 60 ? hora + 1 : hora;
        const minutoFormatado = (novoMinuto >= 60 ? novoMinuto - 60 : novoMinuto).toString().padStart(2, '0');
        const novoHorario = `${novaHora.toString().padStart(2, '0')}:${minutoFormatado}`;

        await addAgendamento(novoHorario, data, nomeUsuario, nomeServico, 20); // Adiciona mais 20 minutos de serviço
    }

    alert('Agendamento realizado com sucesso');
    exibirHorarios();
});

// Função para adicionar agendamento ao Firestore
async function addAgendamento(horario, data, nomeUsuario, nomeServico, tempoServico) {
    try {
        const docRef = await addDoc(collection(db, "agendamentos"), {
            nomeUsuario: nomeUsuario,
            nomeServico: nomeServico,
            tempoServico: tempoServico,
            data: data,
            horario: horario,
            timestamp: new Date() // Adiciona um timestamp
        });
        console.log("Documento adicionado com ID: ", docRef.id);
    } catch (e) {
        console.error("Erro ao adicionar agendamento: ", e);
        alert('Erro ao adicionar agendamento. Consulte o console para mais detalhes.');
    }
}

// Função para converter o mês e ano selecionado para o formato desejado
function parseMesAno(mesAnoSelecionado) {
    const [mes, ano] = mesAnoSelecionado.split(' ');
    const mesNumero = {
        'Janeiro': '01',
        'Fevereiro': '02',
        'Março': '03',
        'Abril': '04',
        'Maio': '05',
        'Junho': '06',
        'Julho': '07',
        'Agosto': '08',
        'Setembro': '09',
        'Outubro': '10',
        'Novembro': '11',
        'Dezembro': '12'
    }[mes];

    return { mesNumero, ano };
}

// Event listener para o botão de novo agendamento
const novoAgendamento = document.querySelector('#novoAgendamento');
novoAgendamento.addEventListener("click", () => {
    window.location.href = "../index.html";
});

// Função para fechar a página
function fecharPagina() {
    window.close();
}

// Adicionando um event listener ao botão para chamar a função quando clicado
document.getElementById('fecharPagina').addEventListener('click', fecharPagina);
