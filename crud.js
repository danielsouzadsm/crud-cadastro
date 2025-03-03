let express = require('express');
const fs = require('fs');
const db = require('mysql2')
const app = express();
const PORT = 3000;


app.use(express.json());
app.use(express.static('crud-web'));

const ligar = db.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'crud'
});

ligar.connect(error => {
    if (error) {
        console.error('Erro ao conectar MySQL!', error)
        return;
    } else
        console.error('MySQL conectado!')
});

app.get('/favicon.ico', (req, res) => res.status(204));

app.get('/usuarios', (req, res) => {
    ligar.query('SELECT * FROM usuarios', (error, results) => {
        if (error) {
            return res.status(500).json({error:'Erro na busca de usuários'})
        }
        return res.json(results);
    });

});

app.post('/usuarios', (req, res) => {
    const { nome, sobrenome, idade } = req.body;
    const db = 'INSERT INTO usuarios (nome, sobrenome, idade) VALUES(?, ?, ?)';
    
   ligar.query(db,[nome, sobrenome, idade], (error,result) => {
    if(error){
        return res.status(500).json({error:'Erro ao inserir usuário'});
    }
    return res.json({id: result.insertId, nome,sobrenome, idade});
   });
});


app.put('/usuarios/:id', (req, res) => {
    const {id} = req.params;
    const { nome, sobrenome, idade } = req.body;
    const db = 'UPDATE usuarios SET nome = ?, sobrenome = ?, idade = ? WHERE id = ?'

    ligar.query(db, [nome, sobrenome, idade, id], (error,result) => {
        if (error){
            return res.status(500).json({ error: 'Usuário não atualizado' });
        }
        return res.json({message: 'Usuário atualizado!'});
    });
});

app.delete('/usuarios/:id', (req, res) => {
    const {id} = req.params;
    const db = 'DELETE FROM usuarios WHERE id = ?';

    ligar.query(db, [id], (error, result) => {
        if(error){
            return res.status(500).json({error: 'Error ao deletar!'})
        }
        return res.json({ message: 'O usuario foi deletado!' });
    })

});

app.listen(PORT, () => console.log(`Servidor online! Porta  ${PORT}`));