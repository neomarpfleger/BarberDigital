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

document.addEventListener("DOMContentLoaded", function() {
    const horariosContainer = document.getElementById('horarios');
    const usuarioCard = document.getElementById('usuarioCard');

    const nomeUsuario = localStorage.getItem('nomeUsuario');
    const nomeServico = localStorage.getItem('selectedService');
    const tempoServico = parseInt(localStorage.getItem('selectedTime'), 10); // Certifique-se de que seja um número
    const diaSelecionado = localStorage.getItem('diaSelecionado');
    const mesAnoSelecionado = localStorage.getItem('mesAnoSelecionado');
    const telUsuario = localStorage.getItem('telUsuario');

    function mostrarInformacoesUsuario() {
        usuarioCard.innerHTML = `
            <h3>Informações do Usuário</h3>
            <p><strong>Nome:</strong> ${nomeUsuario || 'Não fornecido'}</p>
            <p><strong>Telefone:</strong> ${telUsuario || 'Não fornecido'}</p>
            <p><strong>Serviço:</strong> ${nomeServico || 'Não selecionado'}</p>
            <p><strong>Tempo:</strong> ${tempoServico ? tempoServico + ' minutos' : 'Não selecionado'}</p>
            <p><strong>Data:</strong> ${diaSelecionado ? diaSelecionado + ' de ' + mesAnoSelecionado : 'Não selecionada'}</p>
        `;
    }

    function verificarDataSelecionada() {
        const dataAtual = new Date();
        const diaAtual = dataAtual.getDate();
        const mesAtual = dataAtual.toLocaleString('pt-BR', { month: 'long' });
        const mesAtualFormatado = mesAtual.charAt(0).toUpperCase() + mesAtual.slice(1);
        const anoAtual = dataAtual.getFullYear();
    
        const dataSelecionada = `${diaSelecionado} de ${mesAnoSelecionado}`;
        const dataAtualFormatada = `${diaAtual.toString().padStart(2, '0')} de ${mesAtualFormatado} ${anoAtual}`;
    
        const dataEhIgual = dataSelecionada === dataAtualFormatada;
    
        console.log(`Data selecionada: ${dataSelecionada}`);
        console.log(`Data atual: ${dataAtualFormatada}`);
        console.log(`Data é igual ao dia atual: ${dataEhIgual}`);
        
        return dataEhIgual;
    }
    
    function gerarHorarios() {
        const horarios = [];
        let hora = 9;
        let minuto = 0;

        while (hora < 19) {
            if (hora === 12) {
                hora = 13;
                minuto = 0;
            }
            const horario = `${hora.toString().padStart(2, '0')}:${minuto.toString().padStart(2, '0')}`;
            horarios.push(horario);

            minuto += 20;
            if (minuto >= 60) {
                minuto = 0;
                hora += 1;
            }
        }
        return horarios;
    }

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

    async function exibirHorarios() {
        const horarios = gerarHorarios();
        horariosContainer.innerHTML = '';
    
        const { mesNumero, ano } = parseMesAno(mesAnoSelecionado);
        const dataConsulta = `${diaSelecionado}/${mesNumero}/${ano}`;
        const agendamentosRef = collection(db, "agendamentos");
        const q = query(agendamentosRef, where("data", "==", dataConsulta));
        const querySnapshot = await getDocs(q);
        const horariosOcupados = querySnapshot.docs
            .filter(doc => doc.data().statusAgendamento === "Agendado")
            .map(doc => doc.data().horario);
    
        const dataEhIgual = verificarDataSelecionada();
        const dataAtual = new Date();
    
        horarios.forEach((horario, index) => {
            const div = document.createElement('div');
            div.className = 'horario';
            div.innerText = horario;
    
            if (horariosOcupados.includes(horario)) {
                div.classList.add('ocupado');
    
                if (index > 0 && tempoServico > 21) {
                    const divAnterior = horariosContainer.children[index - 1];
                    if (divAnterior) {
                        divAnterior.style.backgroundColor = 'gray';
                    }
                }
            } else {
                if (dataEhIgual) {
                    const [hora, minuto] = horario.split(':').map(Number);
                    const horarioAtual = dataAtual.getHours() * 60 + dataAtual.getMinutes();
                    const horarioEmMinutos = hora * 60 + minuto;
                    
                    if (horarioEmMinutos <= horarioAtual) {
                        div.classList.add('bloqueado');
                        div.style.backgroundColor = 'gray';
                    } else {
                        div.addEventListener('click', async (event) => {
                            const horarioSelecionado = event.target.innerText;
    
                            if (tempoServico > 21) {
                                const proximoDiv = horariosContainer.children[index + 1];
    
                                if (proximoDiv && proximoDiv.classList.contains('ocupado')) {
                                    alert("Tempo insuficiente");
                                    return;
                                }
                            }
                            localStorage.setItem('horario', horarioSelecionado);
                            window.location.href = "./confirmacaoEAgradecimento.html";
                        });
                    }
                } else {
                    div.addEventListener('click', async (event) => {
                        const horarioSelecionado = event.target.innerText;
    
                        if (tempoServico > 21) {
                            const proximoDiv = horariosContainer.children[index + 1];
    
                            if (proximoDiv && proximoDiv.classList.contains('ocupado')) {
                                alert("Tempo insuficiente");
                                return;
                            }
                        }
                        localStorage.setItem('horario', horarioSelecionado);
                        window.location.href = "./confirmacaoEAgradecimento.html";
                    });
                }
            }
            horariosContainer.appendChild(div);
        });
    }    
    mostrarInformacoesUsuario();
    exibirHorarios();
});
