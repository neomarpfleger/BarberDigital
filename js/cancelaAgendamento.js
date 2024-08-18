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

// Função para verificar e imprimir agendamentos (modificada)
async function verificarAgendamentos(telUsuario) {
    const agendamentosRef = collection(db, "agendamentos");
    const q = query(
        agendamentosRef,
        where("telUsuario", "==", telUsuario),
        where("statusAgendamento", "==", "Agendado")
    );

    try {
        const querySnapshot = await getDocs(q);
        const agendamentosDiv = document.querySelector('#agendamentosAtivos');
        agendamentosDiv.innerHTML = ''; // Limpar resultados anteriores

        if (!querySnapshot.empty) {
            querySnapshot.forEach((doc) => {
                const agendamento = doc.data();
                // Criar card com as informações do agendamento
                const card = document.createElement('div');
                card.className = 'card';
                card.innerHTML = `
                    <h3>${agendamento.nomeUsuario}</h3>
                    <p>Telefone: ${agendamento.telUsuario}</p>
                    <p>Data: ${agendamento.data}</p>
                    <p>Hora: ${agendamento.horario}</p>
                    <p>Status: ${agendamento.statusAgendamento}</p>
                    <button class="btnCancelaAgendamento" data-id="${doc.id}" type="button">Cancelar Agendamento</button>
                `;
                agendamentosDiv.appendChild(card);
            });

            document.querySelectorAll('.btnCancelaAgendamento').forEach(button => {
                button.addEventListener('click', async function() {
                    const agendamentoId = this.getAttribute('data-id');
                    await cancelarAgendamento(agendamentoId);
                });
            })

            const btnAnterior = document.querySelector('.btnAnterior');
            const btnProximo = document.querySelector('.btnProximo');
            
            btnAnterior.style.display = 'block';
            btnProximo.style.display = 'block';

            // Listener para mover para o próximo card
            btnProximo.addEventListener('click', function() { 
                agendamentosDiv.scrollBy({ left: agendamentosDiv.clientWidth, behavior: 'smooth' });
            });

            // Listener para mover para o card anterior
            btnAnterior.addEventListener('click', function() {
                agendamentosDiv.scrollBy({ left: -agendamentosDiv.clientWidth, behavior: 'smooth' });
            });

            // Opcional: Esconder os botões se houver apenas um card
            if (querySnapshot.size <= 1) {
                btnAnterior.style.display = 'none';
                btnProximo.style.display = 'none';
            }

            return true;
        } else {
            console.log("O usuário não tem agendamentos ou todos os agendamentos foram cancelados.");
            return false;
        }
    } catch (error) {
        console.error("Erro ao verificar agendamentos:", error);
        return false;
    }
}

// Função para cancelar agendamento
async function cancelarAgendamento(agendamentoId) {
    try {
        const agendamentoDoc = doc(db, "agendamentos", agendamentoId);
        await updateDoc(agendamentoDoc, {
            statusAgendamento: "Cancelado"
        });
        alert("Agendamento cancelado com sucesso!")
        console.log(`Agendamento ${agendamentoId} cancelado com sucesso.`);
        // Opcional: Remover ou atualizar o card do DOM após cancelar
        document.querySelector(`button[data-id="${agendamentoId}"]`).parentElement.remove();
    } catch (error) {
        console.error("Erro ao cancelar agendamento:", error);
    }
}

// Event listener para o botão de consulta de agendamento
const btnConsultaAgendamento = document.querySelector('#btnConsultaAgendamento');
if (btnConsultaAgendamento) {
    btnConsultaAgendamento.addEventListener("click", async function() {
        const telUsuario = document.querySelector('#telUsuario').value;
        if (telUsuario) {
            const temAgendamentos = await verificarAgendamentos(telUsuario);
            console.log(`Agendamentos encontrados: ${temAgendamentos}`);
        } else {
            console.log("Por favor, insira um telefone.");
        }
    });
}

// Event listener para o botão de cancelamento de agendamento
const btnMeuAgendamento = document.querySelector('#btnMeuAgendamento');
if (btnMeuAgendamento) {
    btnMeuAgendamento.addEventListener('click', function() {
        window.location.href = './html/cancelaAgendamento.html';
    });
}

// Event listener para o botão de voltar a pagina primaria.
const btnVoltar = document.getElementById("btnVoltar");
btnVoltar.addEventListener("click", function() {
    window.location.href = '../index.html';
    console.log("fui clicado")
});

