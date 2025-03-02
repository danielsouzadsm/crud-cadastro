let express = require('express');
const fs = require('fs');
const app = express();
const PORT = 3000;

app.use(express.json());
app.use(express.static('crud-web'));

const arquivo = 'dados.json'

function GetUsuarios(){
    try{
        if(!fs.existsSync(arquivo)){
            fs.writeFileSync(arquivo, '[]');
        }
        const data = fs.readFileSync(arquivo,'UTF-8')
        return JSON.parse(data)

    }  catch(error){
        return [];
    }
}

function postUsuarios(usuarios){
    fs.writeFileSync(arquivo, JSON.stringify(usuarios, null, 2))
}
 
let usuarios = GetUsuarios()
app.get('/favicon.ico', (req, res) => res.status(204));
app.get('/usuarios', (req, res) => {
    return res.json(usuarios)
});

app.post('/usuarios', (req, res) => {
    const { nome, sobrenome, idade } = req.body;
    usuarios.push({nome, sobrenome, idade})
    postUsuarios(usuarios)

    return res.json(usuarios);
});


app.put('/usuarios/:index',(req, res) => {
    const index = parseInt(req.params.index);
    const {nome, sobrenome, idade} = req.body;
    
if(usuarios[index]) {
    usuarios[index] = {
        nome: nome ?? usuarios[index].nome,
        sobrenome: sobrenome ?? usuarios[index].sobrenome,
        idade: idade ?? usuarios[index].idade
    };
    postUsuarios(usuarios);
    return res.json(usuarios);
}else
    return res.status(404).json({ error: "Usuário não encontrado" });

});

app.delete('/usuarios/:index',(req,res) => {
    const index = parseInt(req.params.index);
    
    usuarios.splice(index, 1);
    postUsuarios(usuarios);
    return res.json({message: 'O usuario foi deletado!'});
});



app.listen(PORT, () => console.log(`Servidor rodando na porta ${PORT}`));