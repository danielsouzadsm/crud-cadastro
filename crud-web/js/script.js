const apiServer = 'http://localhost:3000/usuarios';

async function carregarUsuarios() {
    try{
        const res = await fetch(apiServer);
        const usuarios = await res.json();
        const resultados = document.querySelector('.usuariosListas');
        
        resultados.innerText = '';

        usuarios.forEach((usuario, index)  => {
            const tr = document.createElement('tr');
            
            const tdNome = document.createElement('td');
            tdNome.innerText = usuario.nome;

            const tdSobrenome = document.createElement('td');
            tdSobrenome.innerText = usuario.sobrenome;

            const tdIdade = document.createElement('td');
            tdIdade.innerText = `${usuario.idade} anos`;
            
            const tdAcao = document.createElement('td');
            const btnDelete = document.createElement('button');

            btnDelete.innerText = 'Delete';
            btnDelete.classList.add('btn','btn-danger', 'btn-sm')

            btnDelete.addEventListener('click',()=>{
                deletarUsuario(index);
            });

            tdAcao.appendChild(btnDelete);
            tr.appendChild(tdNome);
            tr.appendChild(tdSobrenome);
            tr.appendChild(tdIdade);
            tr.appendChild(tdAcao);
            resultados.appendChild(tr);

        });
    }catch(error){
        console.error('erro ao carregar usuarios', error);
    }
}
async function salvarUsuarios() {
    const nome = document.getElementById('nome').value;
    const sobrenome = document.getElementById('sobrenome').value;
    const idade = document.getElementById('idade').value;
    if(!nome || !sobrenome || !idade){
        alert('Preencha os campos')
        return
        
    }

    await fetch(apiServer,{
        method: "POST",
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify({nome, sobrenome, idade})
    });

    const modal = bootstrap.Modal.getInstance(document.getElementById('modalCadastro'));
    modal.hide();

    carregarUsuarios();
}



async function deletarUsuario(index) {
    await fetch(`${apiServer}/${index}`, {
        method: "DELETE"
    });
    carregarUsuarios();
}


const btnSalvar = document.getElementById("salvar")

btnSalvar.addEventListener('click', ()=>{
    salvarUsuarios();
});

carregarUsuarios();