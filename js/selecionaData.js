let dataAtual = new Date();

function gerarCalendario() {
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

    // Preencher os dias do mês
    for (let i = 1; i <= ultimoDia; i++) {
        const diaFormatado = i.toString().padStart(2, '0');
        htmlDias += `<div data-value="${diaFormatado}" class="dia">${diaFormatado}</div>`;
    }

    diasContainer.innerHTML = htmlDias;

    // Adicionar evento de clique a cada dia
    const dias = diasContainer.querySelectorAll('div[data-value]');
    const hoje = new Date();

    dias.forEach(dia => {
        const diaSelecionado = dia.getAttribute('data-value');
        const dataDia = new Date(ano, mes, parseInt(diaSelecionado));

        // Verificar se o dia é passado
        if (dataDia < hoje && (dataDia.getMonth() < hoje.getMonth() || dataDia.getFullYear() < hoje.getFullYear() || (dataDia.getMonth() === hoje.getMonth() && dataDia.getDate() < hoje.getDate()))) {
            dia.classList.add('dia-passado'); // Adicionar classe para dias passados
        } else {
            dia.addEventListener('click', (event) => {
                const diaSelecionado = event.target.getAttribute('data-value');
                const mesAnoSelecionado = mesAnoElement.innerText;

                // Armazenar o dia selecionado, mês e ano no localStorage
                localStorage.setItem('diaSelecionado', diaSelecionado);
                localStorage.setItem('mesAnoSelecionado', mesAnoSelecionado);

                // Redirecionar para outra página (opcional)
                window.location.href = "./agendamentoDoHorario.html";
            });
        }
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
window.onload = gerarCalendario;
