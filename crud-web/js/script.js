const apiServer = 'http://localhost:3000/usuarios';

const btnSalvar = document.getElementById("salvar");
const btnSalvarEdit = document.getElementById("btnEditSalvar");

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

            const btnEdit = document.createElement('button');
            btnEdit.innerText = '✏️';
            btnEdit.classList.add('btn','btn-edit','btn-warning', 'btn-sm', 'me-2');
            btnEdit.setAttribute('data-bs-toggle', 'modal');
            btnEdit.setAttribute('data-bs-target', '#modalEditar');
            btnEdit.addEventListener('click', () => {
                pegarValorInput(usuario, index)
            });

            const btnDelete = document.createElement('button');
            btnDelete.innerText = '🗑️';
            btnDelete.classList.add('btn','btn-danger', 'btn-sm')

            btnDelete.addEventListener('click',()=>{
                deletarUsuario(index);
            });

            tr.appendChild(tdNome);
            tr.appendChild(tdSobrenome);
            tr.appendChild(tdIdade);
            tr.appendChild(tdAcao);
            tdAcao.appendChild(btnEdit)
            tdAcao.appendChild(btnDelete);
            resultados.appendChild(tr);

        });
    }catch(error){
        console.error('erro ao carregar usuarios', error);
    }
}

function pegarValorInput(usuario, index) {
    console.log(usuario)
    const editNome = document.getElementById('editNome')
    const editSobrenome = document.getElementById('editSobrenome')
    const editIdade = document.getElementById('editIdade')
    const editIndex = document.getElementById('editIndex')

    editNome.value = usuario.nome;
    editSobrenome.value = usuario.sobrenome;
    editIdade.value = usuario.idade;
    editIndex.value = index;
}
async function salvarUsuarios() {
    const inputNome = document.getElementById('nome');
    const inputSobrenome = document.getElementById('sobrenome');
    const inputIdade = document.getElementById('idade');

    const nome = inputNome.value
    const sobrenome = inputSobrenome.value
    const idade = inputIdade.value


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

async function atualizarUsuario() {
    const index = document.getElementById('editIndex').value;
    const nome = document.getElementById('editNome').value;
    const sobrenome = document.getElementById('editSobrenome').value;
    const idade = document.getElementById('editIdade').value;
    
    if (!nome || !sobrenome || !idade) {
        alert('Preencha todos os campos');
        return;
    }
    
    await fetch(`${apiServer}/${index}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ nome, sobrenome, idade })
    });
    
    const modal = bootstrap.Modal.getInstance(document.getElementById('modalEditar'));
    modal.hide();
    carregarUsuarios();
}
btnSalvarEdit.addEventListener('click', ()=>{
    atualizarUsuario();
});

btnSalvar.addEventListener('click', ()=>{
    salvarUsuarios();
});

carregarUsuarios();