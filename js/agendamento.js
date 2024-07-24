
const btnAgendamento = document.querySelector(".btnAgendamento");
btnAgendamento.addEventListener("click", async function() {

    // Capturar os dados do formulário
    const nomeUsuario = document.getElementById("nomeUsuario").value;
    const telUsuario = document.getElementById("telUsuario").value;

    // Verificar se os campos estão preenchidos
    if (nomeUsuario && telUsuario) {
        try {
            // Armazenar o nome do usuário no localStorage
            localStorage.setItem('nomeUsuario', nomeUsuario);
            localStorage.setItem('telUsuario', telUsuario);

            // Redirecionar para outra página
            window.location.href = "./html/servicos.html";
        } catch (e) {
            console.error("Erro ao adicionar documento: ", e);
        }
    } else {
        alert("Por favor, preencha todos os campos.");
    }
});

const btnMeuAcesso = document.querySelector("#btnMeuAcesso");
btnMeuAcesso.addEventListener("click", function() {
    window.location = './html/gestao.html'
});
