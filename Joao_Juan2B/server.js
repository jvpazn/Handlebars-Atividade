const express = require('express');
const exphbs = require('express-handlebars');

const pessoa = require('./models/pessoa.model')
const db = require('./config/database')

const app = express();
const port = 3000;

app.use(express.json());
app.use(express.urlencoded({extended: true}));

app.engine('handlebars', exphbs.engine({defaultLayout: false}));
app.set('view engine', 'handlebars');

app.get('/', (req,res) => {res.render('home')});

app.get('/pessoas', async (req,res) =>{
    try{
        let pessoas = await pessoa.findAll({raw: true}); 

        res.render('listarPessoas', { pessoas })
    } catch (error) {
        console.error('Erro ao buscar pessoas:', error);
        res.status(500).send('Erro ao Buscar Pessoas! :3')
    }
}); 

app.get('/pessoas/nova', (req,res) => res.render('cadastrarPessoa')); 

app.get('/pessoas/:id', async(req,res) =>{
    try{
        const pessoaDetalhar = await pessoa.findByPk(req.params.id ,{raw: true});

        res.render('detalharPessoa', {pessoa : pessoaDetalhar});
    } catch (error) {
        console.error('Erro ao buscar pessoa:', error);
        res.status(500).send('Erro ao buscar Pessoa! :3')
    }

});

app.post('/pessoas', async (req,res) =>{
        try{
        await pessoa.create({
            nome: req.body.nome
        });
        
        res.redirect('/pessoas');
    } catch (error) {
        console.error('Erro ao cadastrar pessoa:', error);
        res.status(500).send('Erro ao cadastrar Pessoa! :3')
    }

    res.render('listarPessoas', {pessoas})
}); 

app.get('/pessoas/:id/editar', async (req, res) =>{
    try{
        const pessoaEditar = await pessoa.findByPk(req.params.id ,{raw: true});
        
        res.render('editarPessoa', { pessoa : pessoaEditar})

    } catch (error) {
        console.error('Erro ao buscar pessoa:', error);
        res.status(500).send('Erro ao buscar Pessoa! :3')
    }
});

app.post('/pessoas/:id', async (req, res) => {
    try{
        let pessoaAtualizar = await pessoa.findByPk(req.params.id);
        
        pessoaAtualizar.nome = req.body.nome;

        await pessoaAtualizar.save()

        res.redirect('/pessoas')

    } catch (error) {
        console.error('Erro ao atualizar pessoa:', error);
        res.status(500).send('Erro ao atualizar Pessoa! :3')
    }
});

app.post('/pessoas/excluir/:id', async (req, res) => {
    try{
        let pessoaExcluir = await pessoa.findByPk(req.params.id);

        await pessoaExcluir.destroy()

        res.redirect('/pessoas')

    } catch (error) {
        console.error('Erro ao DELETAR pessoa:', error);
        res.status(500).send('Erro ao DELETAR Pessoa! >:3')
    }
});
 
db.sync()
.then(() => {
    console.log('Banco de dados sincronizado.');
})
.catch((e) =>{
    console.error('Erro ao sincronizar o banco de dados:', e);
});


app.listen(port, () => {
    console.log(`Servidor em execução: http://localhost:${port}`);
})