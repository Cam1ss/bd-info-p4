const express = require('express');
const bodyParser = require('body-parser');
const sqlite3 = require('sqlite3').verbose();

const app = express();
const port = 3000;

// Middleware para analisar o corpo das solicitações como JSON
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// Conecte-se ao banco de dados SQLite
const db = new sqlite3.Database('SERVICOS.db', (err) => {
    if (err) {
        console.error(err.message);
    } else {
        console.log('Conectado ao banco de dados SQLite.');
    }
});

// Criar tabela TB_CLIENTES
db.run(
    'CREATE TABLE IF NOT EXISTS TB_CLIENTES (id INTEGER PRIMARY KEY AUTOINCREMENT, nome TEXT)',
    (err) => {
        if (err) {
            console.error('Erro ao criar tabela TB_CLIENTES:', err.message);
        } else {
            console.log('Tabela TB_CLIENTES criada com sucesso.');
        }
    }
);

// Criar tabela TB_VENDEDORES
db.run(
    'CREATE TABLE IF NOT EXISTS TB_VENDEDORES (id INTEGER PRIMARY KEY AUTOINCREMENT, nome TEXT)',
    (err) => {
        if (err) {
            console.error('Erro ao criar tabela TB_VENDEDORES:', err.message);
        } else {
            console.log('Tabela TB_VENDEDORES criada com sucesso.');
        }
    }
);

// Criar tabela TB_NOTAS_FISCAIS
db.run(
    'CREATE TABLE IF NOT EXISTS TB_NOTA_FISCAL (id INTEGER PRIMARY KEY, valor FLOAT, cliente_id INTEGER, vendedor_id INTEGER, foreign key (cliente_id) references TB_CLIENTES (id), foreign key (vendedor_id) references TB_VENDEDORES (id))',
    (err) => {
        if (err) {
            console.error('Erro ao criar tabela TB_NOTAS_FISCAIS:', err.message);
        } else {
            console.log('Tabela TB_NOTAS_FISCAIS criada com sucesso.');
        }
    }
);

// Criar tabela TB_PRODUTOS
db.run(
    'CREATE TABLE IF NOT EXISTS TB_PRODUTOS (id INTEGER PRIMARY KEY, descricao TEXT, preco_unitario FLOAT)',
    (err) => {
        if (err) {
            console.error('Erro ao criar tabela TB_PRODUTOS:', err.message);
        } else {
            console.log('Tabela TB_PRODUTOS criada com sucesso.');
        }
    }
);

// Criar tabela TB_ITENS_FISCAIS
db.run(
    'CREATE TABLE IF NOT EXISTS TB_ITEM_NOTA_FISCAL (id INTEGER PRIMARY KEY, notafiscal_id INTEGER, quantidade FLOAT, valor_item FLOAT, produto_id INTEGER, unidade INTEGER, foreign key (produto_id) references TB_PRODUTOS (id), foreign key (notafiscal_id) references TB_NOTA_FISCAL (id))',
    (err) => {
        if (err) {
            console.error('Erro ao criar tabela TB_ITENS_FISCAIS:', err.message);
        } else {
            console.log('Tabela TB_ITENS_FISCAIS criada com sucesso.');
        }
    }
);

/////////////////////////////////////////////////////////////////////////////////////////////

// Rotas para operações CRUD

// Criar um cliente
app.post('/clientes', (req, res) => {
    const { nome } = req.body;
    db.run('INSERT INTO TB_CLIENTES (nome) VALUES (?)', [nome], (err) => {
        if (err) {
            res.status(500).json({ error: err.message });
            return;
        }
        res.status(201).json({ message: 'Cliente criado com sucesso' });
    });
});

// Criar um vendedor
app.post('/vendedores', (req, res) => {
    const { nome} = req.body;
    db.run('INSERT INTO TB_VENDEDORES (nome) VALUES (?)', [nome], (err) => {
        if (err) {
            res.status(500).json({ error: err.message });
            return;
        }
        res.status(201).json({ message: 'Vendedor criado com sucesso' });
    });
});

// Criar uma nota fiscal 
app.post('/notasfiscais', (req, res) => {
    const { id ,valor, cliente_id, vendedor_id} = req.body;
    db.run('INSERT INTO TB_NOTA_FISCAL (id ,valor, cliente_id, vendedor_id) VALUES (?, ?, ?, ?)', [id ,valor, cliente_id, vendedor_id], (err) => {
        if (err) {
            res.status(500).json({ error: err.message });
            return;
        }
        res.status(201).json({ message: 'Nota Fiscal criada com sucesso' });
    });
});

// Criar um produto
app.post('/produtos', (req, res) => {
    const { id, descricao, preco_unitario} = req.body;
    db.run('INSERT INTO TB_PRODUTOS (id, descricao, preco_unitario) VALUES (?, ?, ?)', [id, descricao, preco_unitario], (err) => {
        if (err) {
            res.status(500).json({ error: err.message });
            return;
        }
        res.status(201).json({ message: 'Produto criado com sucesso' });
    });
});

// Criar um item nota fiscal
app.post('/itensnotasfiscais', (req, res) => {
    const { notafiscal_id, quantidade, valor_item, produto_id, unidade } = req.body;
    db.run('INSERT INTO TB_ITEM_NOTA_FISCAL (notafiscal_id, quantidade, valor_item, produto_id, unidade) VALUES (?, ?, ? , ?, ?)', [notafiscal_id, quantidade, valor_item, produto_id, unidade], (err) => {
        if (err) {
            res.status(500).json({ error: err.message });
            return;
        }
        res.status(201).json({ message: 'item fiscal criado com sucesso' });
    });
});

/////////////////////////////////////////////////////////////////////////////////////////////

// Obter todos os Clientes
app.get('/clientes', (req, res) => {
    db.all('SELECT * FROM TB_CLIENTES', (err, rows) => {
        if (err) {
            res.status(500).json({ error: err.message });
            return;
        }
        res.json({ clientes: rows });
    });
});

// Obter todos os Vendedores
app.get('/vendedores', (req, res) => {
    db.all('SELECT * FROM TB_VENDEDORES', (err, rows) => {
        if (err) {
            res.status(500).json({ error: err.message });
            return;
        }
        res.json({ vendedores: rows });
    });
});

// Obter todos as Notas Fiscais
app.get('/notasfiscais', (req, res) => {
    db.all('SELECT * FROM TB_NOTA_FISCAL', (err, rows) => {
        if (err) {
            res.status(500).json({ error: err.message });
            return;
        }
        res.json({ notasfiscais: rows });
    });
});

// Obter todos os produtos
app.get('/produtos', (req, res) => {
    db.all('SELECT * FROM TB_PRODUTOS', (err, rows) => {
        if (err) {
            res.status(500).json({ error: err.message });
            return;
        }
        res.json({ produtos: rows });
    });
});

// Obter todos os Itens das Notas Fiscais
app.get('/itensnotasfiscais', (req, res) => {
    db.all('SELECT * FROM TB_ITEM_NOTA_FISCAL', (err, rows) => {
        if (err) {
            res.status(500).json({ error: err.message });
            return;
        }
        res.json({ itensnotasfiscais: rows });
    });
});



/////////////////////////////////////////////////////////////////////////////////////////////


// Obter um Cliente por ID
app.get('/clientes/:id', (req, res) => {
    const { id } = req.params;
    db.get('SELECT * FROM TB_CLIENTES WHERE id = ?', [id], (err, row) => {
        if (err) {
            res.status(500).json({ error: err.message });
            return;
        }
        if (!row) {
            res.status(404).json({ message: 'Cliente não encontrado' });
            return;
        }
        res.json({ aluno: row });
    });
});

// Obter um Vendedor por ID
app.get('/vendedores/:id', (req, res) => {
    const { id } = req.params;
    db.get('SELECT * FROM TB_VENDEDORES WHERE id = ?', [id], (err, row) => {
        if (err) {
            res.status(500).json({ error: err.message });
            return;
        }
        if (!row) {
            res.status(404).json({ message: 'Vendedor não encontrado' });
            return;
        }
        res.json({ aluno: row });
    });
});

// Obter uma Nota Fiscal por ID
app.get('/notasfiscais/:id', (req, res) => {
    const { id } = req.params;
    db.get('SELECT * FROM TB_NOTA_FISCAL WHERE id = ?', [id], (err, row) => {
        if (err) {
            res.status(500).json({ error: err.message });
            return;
        }
        if (!row) {
            res.status(404).json({ message: 'Nota Fiscal não encontrado' });
            return;
        }
        res.json({ aluno: row });
    });
});

// Obter um Produto por ID
app.get('/produtos/:id', (req, res) => {
    const { id } = req.params;
    db.get('SELECT * FROM TB_PRODUTOS WHERE id = ?', [id], (err, row) => {
        if (err) {
            res.status(500).json({ error: err.message });
            return;
        }
        if (!row) {
            res.status(404).json({ message: 'Produto não encontrado' });
            return;
        }
        res.json({ aluno: row });
    });
});

// Obter um Item Nota Fiscal por ID
app.get('/itensnotasfiscais/:id', (req, res) => {
    const { id } = req.params;
    db.get('SELECT * FROM TB_ITEM_NOTA_FISCAL WHERE id = ?', [id], (err, row) => {
        if (err) {
            res.status(500).json({ error: err.message });
            return;
        }
        if (!row) {
            res.status(404).json({ message: 'Item Nota Fiscal não encontrado' });
            return;
        }
        res.json({ aluno: row });
    });
});


/////////////////////////////////////////////////////////////////////////////////////////////

// Atualizar um Cliente por ID
app.put('/clientes/:id', (req, res) => {
    const { id } = req.params;
    const { nome } = req.body;
    db.run('UPDATE TB_CLIENTES SET nome = ? WHERE id = ?', [nome, id], (err) => {
        if (err) {
            res.status(500).json({ error: err.message });
            return;
        }
        res.json({ message: 'Cliente atualizado com sucesso' });
    });
});

// Atualizar um Vendedor por ID
app.put('/vendedores/:id', (req, res) => {
    const { id } = req.params;
    const { nome } = req.body;
    db.run('UPDATE TB_VENDEDORES SET nome = ? WHERE id = ?', [nome, id], (err) => {
        if (err) {
            res.status(500).json({ error: err.message });
            return;
        }
        res.json({ message: 'Vendedor atualizado com sucesso' });
    });
});

// Atualizar uma Nota Fiscal por ID
app.put('/notasfiscais/:id', (req, res) => {
    const { id } = req.params;
    const { valor, cliente_id, vendedor_id } = req.body;
    db.run('UPDATE TB_NOTA_FISCAL SET valor = ?, cliente_id = ?, vendedor_id = ? WHERE id = ?', [valor, cliente_id, vendedor_id , id], (err) => {
        if (err) {
            res.status(500).json({ error: err.message });
            return;
        }
        res.json({ message: 'Nota Fiscal atualizado com sucesso' });
    });
});

// Atualizar um Produto por ID
app.put('/produtos/:id', (req, res) => {
    const { id } = req.params;
    const { descricao, preco_unitario } = req.body;
    db.run('UPDATE TB_PRODUTOS SET descricao = ?, preco_unitario = ? WHERE id = ?', [descricao, preco_unitario, id], (err) => {
        if (err) {
            res.status(500).json({ error: err.message });
            return;
        }
        res.json({ message: 'Produto atualizado com sucesso' });
    });
});

// Atualizar um Item Nota Fiscal por ID
app.put('/itensnotasfiscais/:id', (req, res) => {
    const { id } = req.params;
    const { quantidade, valor_item, unidade, notafiscal_id, produto_id } = req.body;
    db.run('UPDATE TB_ITEM_NOTA_FISCAL SET quantidade = ?, valor_item = ?, unidade = ?, notafiscal_id = ?, produto_id = ? WHERE id = ?', [quantidade, valor_item, unidade, notafiscal_id, produto_id, id], (err) => {
        if (err) {
            res.status(500).json({ error: err.message });
            return;
        }
        res.json({ message: 'Item Nota Fiscal atualizado com sucesso' });
    });
});

/////////////////////////////////////////////////////////////////////////////////////////////


// Excluir um Clientes por ID
app.delete('/clientes/:id', (req, res) => {
    const { id } = req.params;
    db.run('DELETE FROM TB_CLIENTES WHERE id = ?', [id], (err) => {
        if (err) {
            res.status(500).json({ error: err.message });
            return;
        }
        res.json({ message: 'Cliente excluído com sucesso' });
    });
});

// Excluir um Vendedores por ID
app.delete('/vendedores/:id', (req, res) => {
    const { id } = req.params;
    db.run('DELETE FROM TB_VENDEDORES WHERE id = ?', [id], (err) => {
        if (err) {
            res.status(500).json({ error: err.message });
            return;
        }
        res.json({ message: 'Vendedor excluído com sucesso' });
    });
});

// Excluir um Nota Fiscal por ID
app.delete('/notasfiscal/:id', (req, res) => {
    const { id } = req.params;
    db.run('DELETE FROM TB_NOTA_FISCAL WHERE id = ?', [id], (err) => {
        if (err) {
            res.status(500).json({ error: err.message });
            return;
        }
        res.json({ message: 'Nota Fiscal excluída com sucesso' });
    });
});

// Excluir um Produto por ID
app.delete('/produtos/:id', (req, res) => {
    const { id } = req.params;
    db.run('DELETE FROM TB_PRODUTOS WHERE id = ?', [id], (err) => {
        if (err) {
            res.status(500).json({ error: err.message });
            return;
        }
        res.json({ message: 'Produto excluído com sucesso' });
    });
});

// Excluir um Item Nota Fiscal por ID
app.delete('/itensnotasfiscais/:id', (req, res) => {
    const { id } = req.params;
    db.run('DELETE FROM TB_ITEM_NOTA_FISCAL WHERE id = ?', [id], (err) => {
        if (err) {
            res.status(500).json({ error: err.message });
            return;
        }
        res.json({ message: 'Item Nota Fiscal excluído com sucesso' });
    });
});

// Inicie o servidor
app.listen(port, () => {
    console.log(`Servidor está ouvindo na porta ${port}`);
});