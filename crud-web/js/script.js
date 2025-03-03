document.addEventListener('DOMContentLoaded', () => {
    const apiServer = 'http://localhost:3000/usuarios';

    const btnSalvar = document.getElementById("salvar");
    const btnSalvarEdit = document.getElementById("btnEditSalvar");

    btnSalvar.addEventListener('click', () => {
        salvarUsuarios();
    });

    btnSalvarEdit.addEventListener('click', () => {
        atualizarUsuario();
    });

    const inputNome = document.getElementById('nome');
    const inputSobrenome = document.getElementById('sobrenome');
    const inputIdade = document.getElementById('idade');
    const inputNomeEdit = document.getElementById('editNome');
    const inputSobrenomeEdit = document.getElementById('editSobrenome');
    const inputIdadeEdit = document.getElementById('editIdade');

    function PressionarEnter(e) {
        if (e.key === 'Enter') {
            e.preventDefault();
            salvarUsuarios();
        };
    };

    inputNome.addEventListener('keypress', PressionarEnter);
    inputSobrenome.addEventListener('keypress', PressionarEnter);
    inputIdade.addEventListener('keypress', PressionarEnter);

    function enterEditar(e) {
        if (e.key === 'Enter') {
            e.preventDefault();
            atualizarUsuario();
        };
    };

    inputNomeEdit.addEventListener('keypress', enterEditar);
    inputSobrenomeEdit.addEventListener('keypress', enterEditar);
    inputIdadeEdit.addEventListener('keypress', enterEditar);

    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            const btnNao = document.getElementById('btnNao');
            if (btnNao) {
                btnNao.click(); 
            }
        }
    });
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            const  modalEditar = document.getElementById('modalEditar');
            if (modalEditar) {
               const modal = bootstrap.Modal.getInstance(modalEditar);
               modal.hide();
            }
        }
    });

    const modalConfirmarDelete = new bootstrap.Modal(document.getElementById("modalConfirmarDelete"));
    const btnConfirmarDelete = document.getElementById("confirmarDelete");
    let usuarioParaExcluir = null

    function abrirModalExcluir(id) {
        usuarioParaExcluir = id;
        modalConfirmarDelete.show();
    };
    document.getElementById('confirmarDelete').addEventListener('click', () => {
        if (usuarioParaExcluir !== null) {
            deletarUsuario(usuarioParaExcluir);
            modalConfirmarDelete.hide();
        }
    });
    document.addEventListener("click", e => {
        if (e.target.classList.contains("btnDelete")) {
            modalConfirmarDelete.show();

            btnConfirmarDelete.onclick = () => {
                modalConfirmarDelete.hide();
            };
        }
    });

    async function carregarUsuarios() {
        try {
            const res = await fetch(apiServer);
            const usuarios = await res.json();
            const resultados = document.querySelector('.usuariosListas');

            resultados.innerText = '';

            usuarios.forEach((usuario, id) => {
                const tr = document.createElement('tr');

                const tdNome = document.createElement('td');
                tdNome.innerText = usuario.nome;

                const tdSobrenome = document.createElement('td');
                tdSobrenome.innerText = usuario.sobrenome;

                const tdIdade = document.createElement('td');
                tdIdade.innerText = `${usuario.idade} anos`;

                const tdAcao = document.createElement('td');
                tdAcao.classList.add('td', 'text-center')

                const btnEdit = document.createElement('button');
                btnEdit.innerText = '✏️';
                btnEdit.classList.add('btn', 'btn-warning', 'btn-sm', 'me-2');
                btnEdit.setAttribute('data-bs-toggle', 'modal');
                btnEdit.setAttribute('data-bs-target', '#modalEditar');
                btnEdit.addEventListener('click', () => {
                    pegarValorInput(usuario, usuario.id)
                });

                const btnDelete = document.createElement('button');
                btnDelete.innerText = '🗑️';
                btnDelete.classList.add('btn', 'btn-danger', 'btn-sm')
                btnDelete.addEventListener('click', () => {
                    abrirModalExcluir(usuario.id)
                })

                tr.appendChild(tdNome);
                tr.appendChild(tdSobrenome);
                tr.appendChild(tdIdade);
                tr.appendChild(tdAcao);
                tdAcao.appendChild(btnEdit)
                tdAcao.appendChild(btnDelete);
                resultados.appendChild(tr);

            });
        } catch (error) {
            console.error('erro ao carregar usuarios', error);
        }
    }

    function pegarValorInput(usuario, id) {
        const editNome = document.getElementById('editNome')
        const editSobrenome = document.getElementById('editSobrenome')
        const editIdade = document.getElementById('editIdade')
        const editIndex = document.getElementById('editIndex')

        editNome.value = usuario.nome;
        editSobrenome.value = usuario.sobrenome;
        editIdade.value = usuario.idade;
        editIndex.value = id;
    }

    async function salvarUsuarios() { 
        const inputNome = document.getElementById('nome');
        const inputSobrenome = document.getElementById('sobrenome');
        const inputIdade = document.getElementById('idade');

        const nome = inputNome.value
        const sobrenome = inputSobrenome.value
        const idade = inputIdade.value


        if (!nome || !sobrenome || !idade) {
            alert('Preencha os campos')
            return
        }

        await fetch(apiServer, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ nome, sobrenome, idade })
        });

        const modal = bootstrap.Modal.getInstance(document.getElementById('modalCadastro'));
        modal.hide();

        inputNome.value = "";
        inputSobrenome.value = "";
        inputIdade.value = "";

        carregarUsuarios();
    }

    async function deletarUsuario(id) {
        await fetch(`${apiServer}/${id}`, {
            method: "DELETE"
        });
        carregarUsuarios();
    }

    async function atualizarUsuario() {
        const id = document.getElementById('editIndex').value;
        const nome = document.getElementById('editNome').value;
        const sobrenome = document.getElementById('editSobrenome').value;
        const idade = document.getElementById('editIdade').value;

        if (!nome || !sobrenome || !idade) {
            alert('Preencha todos os campos');
            return;
        }

        await fetch(`${apiServer}/${id}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ nome, sobrenome, idade })
        });

        const modal = bootstrap.Modal.getInstance(document.getElementById('modalEditar'));
        modal.hide();
        carregarUsuarios();
    }

    carregarUsuarios();
});