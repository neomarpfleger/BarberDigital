const btnAgendamento = document.querySelector(".btnAgendamento");

btnAgendamento.addEventListener("click", async function() {
    // Capturar os dados do formulário
    const nomeUsuario = document.getElementById("nomeUsuario").value;
    const telUsuario = document.getElementById("telUsuario").value;

    // Função para validar o número de celular
    function validarNumeroCelular(numero) {
        // Remove espaços, parênteses, hífens e outros caracteres especiais
        let numeroLimpo = numero.replace(/\D/g, '');

        // Verifica se o número tem 11 dígitos (incluindo o DDD)
        const regex = /^[1-9]{2}9[0-9]{8}$/;

        // Verifica se todos os dígitos são iguais
        const todosIguais = numeroLimpo.split('').every(digito => digito === numeroLimpo[0]);

        if (todosIguais) {
            return false; // Número inválido (todos os dígitos são iguais)
        }

        if (regex.test(numeroLimpo)) {
            return true; // Número válido
        } else {
            return false; // Número inválido
        }
    }

    // Verificar se os campos estão preenchidos e se o telefone é válido
    if (nomeUsuario && telUsuario) {
        if (validarNumeroCelular(telUsuario)) {
            try {
                // Armazenar o nome do usuário e telefone no localStorage
                localStorage.setItem('nomeUsuario', nomeUsuario);
                localStorage.setItem('telUsuario', telUsuario);

                // Redirecionar para outra página
                window.location.href = "./html/servicos.html";
            } catch (e) {
                console.error("Erro ao adicionar documento: ", e);
            }
        } else {
            alert("Por favor, insira um número de telefone válido.");
        }
    } else {
        alert("Por favor, preencha todos os campos.");
    }
});

const btnMeuAcesso = document.querySelector("#btnMeuAcesso");
btnMeuAcesso.addEventListener("click", function() {
    window.location = './html/gestao.html'
});
