import { initializeApp } from "https://www.gstatic.com/firebasejs/10.10.0/firebase-app.js";
import { getFirestore, collection, query, where, getDocs, addDoc } from "https://www.gstatic.com/firebasejs/10.10.0/firebase-firestore.js";

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
    const tempoServico = localStorage.getItem('selectedTime');
    const diaSelecionado = localStorage.getItem('diaSelecionado');
    const mesAnoSelecionado = localStorage.getItem('mesAnoSelecionado');

    function mostrarInformacoesUsuario() {
        usuarioCard.innerHTML = `
            <h3>Informações do Usuário</h3>
            <p><strong>Nome:</strong> ${nomeUsuario || 'Não fornecido'}</p>
            <p><strong>Serviço:</strong> ${nomeServico || 'Não selecionado'}</p>
            <p><strong>Tempo:</strong> ${tempoServico ? tempoServico + ' minutos' : 'Não selecionado'}</p>
            <p><strong>Data:</strong> ${diaSelecionado ? diaSelecionado + ' de ' + mesAnoSelecionado : 'Não selecionada'}</p>
        `;
    }

    function gerarHorarios() {
        const horarios = [];
        let hora = 9;
        let minuto = 0;

        while (hora < 15) {
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

    /*async function exibirHorarios() {
        const horarios = gerarHorarios();
        horariosContainer.innerHTML = '';

        const { mesNumero, ano } = parseMesAno(mesAnoSelecionado);
        const dataConsulta = `${diaSelecionado}/${mesNumero}/${ano}`;
        const agendamentosRef = collection(db, "agendamentos");
        const q = query(agendamentosRef, where("data", "==", dataConsulta));
        const querySnapshot = await getDocs(q);
        const horariosOcupados = querySnapshot.docs.map(doc => doc.data().horario);

        horarios.forEach(horario => {
            const div = document.createElement('div');
            div.className = 'horario';
            if (horariosOcupados.includes(horario)) {
                div.classList.add('ocupado');
            } else {
                div.addEventListener('click', async (event) => {

                    const horario = event.target.innerText;
                    localStorage.setItem('horario', horario);

                    window.location.href = "./confirmacaoEAgradecimento.html";
                    exibirHorarios();
                });
            }
            div.innerText = horario;
            horariosContainer.appendChild(div);
        });
    }*/

        async function exibirHorarios() {
            const horarios = gerarHorarios();
            horariosContainer.innerHTML = '';
        
            const { mesNumero, ano } = parseMesAno(mesAnoSelecionado);
            const dataConsulta = `${diaSelecionado}/${mesNumero}/${ano}`;
            const agendamentosRef = collection(db, "agendamentos");
            const q = query(agendamentosRef, where("data", "==", dataConsulta));
            const querySnapshot = await getDocs(q);
            const horariosOcupados = querySnapshot.docs.map(doc => doc.data().horario);
        
            horarios.forEach((horario, index) => {
                const div = document.createElement('div');
                div.className = 'horario';
                div.innerText = horario;
        
                if (horariosOcupados.includes(horario)) {
                    div.classList.add('ocupado');
        
                    if (tempoServico > 21 && index < horarios.length - 1) {
                        // Torna a próxima div como ocupada
                        const divSucessor = horariosContainer.children[index - 1];
                        if (divSucessor) {
                            divSucessor.classList.add('ocupado');
                        }
                    }
                } else {
                    div.addEventListener('click', (event) => {
                        const horario = event.target.innerText;
                        localStorage.setItem('horario', horario);
                        window.location.href = "./confirmacaoEAgradecimento.html";
                    });
                }
        
                horariosContainer.appendChild(div);
            });
        }
              

    mostrarInformacoesUsuario();
    exibirHorarios();
});
