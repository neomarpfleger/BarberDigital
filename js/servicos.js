document.addEventListener('DOMContentLoaded', ( ) => {
    // Recuperar o nome do usuário do localStorage
    const nomeUsuario = localStorage.getItem('nomeUsuario');

    // Exibir o nome do usuário na página
    if (nomeUsuario) {
        document.getElementById('mensagemUsuario').textContent = `Olá ${nomeUsuario}, que bom vê-lo aqui!`;
        document.getElementById('mensagemUsuarioServico').textContent = `Qual serviço você está precisando?`;
    } else {
        document.getElementById('mensagemUsuario').textContent = 'Olá, que bom vê-lo aqui!';
    }

    // Limpar o localStorage se necessário
    // localStorage.removeItem('nomeUsuario');
});

// Selecionar todos os botões de agendamento
const btnAgendamentos = document.querySelectorAll(".btnAgendamento");
    
// Adicionar o event listener a cada botão
btnAgendamentos.forEach(function(button) {
    button.addEventListener("click", function(event) {
        // Capturar o serviço selecionado
        const selectedService = event.target.value;
        const selectedTime = event.target.getAttribute('data-time');
        
        // Armazenar o serviço e o tempo do usuário no localStorage
        localStorage.setItem('selectedService', selectedService);
        localStorage.setItem('selectedTime', selectedTime);
        
        // Redirecionar para outra página
        window.location.href = "./selecionarHorario.html";
    });

});
