const express = require('express');
const bodyParser = require('body-parser');
const sqlite3 = require('sqlite3').verbose();

const app = express();
const port = 3000;

// Middleware para analisar o corpo das solicitações como JSON
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// Conecte-se ao banco de dados SQLite
const db = new sqlite3.Database('BOLSA.db', (err) => {
    if (err) {
        console.error(err.message);
    } else {
        console.log('Conectado ao banco de dados SQLite.');
    }
});



// Criar tabela TB_IF
db.run(
    'CREATE TABLE IF NOT EXISTS TB_IF (id INTEGER PRIMARY KEY AUTOINCREMENT, nome_if STRING, ano INTEGER, semestre INTEGER)',
    (err) => {
        if (err) {
            console.error('Erro ao criar tabela TB_IF:', err.message);
        } else {
            console.log('Tabela TB_IF criada com sucesso.');
        }
    }
);

// Criar tabela TB_CAMPUS
db.run(
    'CREATE TABLE IF NOT EXISTS TB_CAMPUS (id INTEGER PRIMARY KEY AUTOINCREMENT, nome STRING, if_id INTEGER, FOREIGN KEY (if_id) references TB_IF(id))',
    (err) => {
        if (err) {
            console.error('Erro ao criar tabela TB_CAMPUS:', err.message);
        } else {
            console.log('Tabela TB_CAMPUS criada com sucesso.');
        }
    }
);

// Criar tabela TB_CURSO
db.run(
    'CREATE TABLE IF NOT EXISTS TB_CURSO (id INTEGER PRIMARY KEY AUTOINCREMENT, nome STRING, campus_id INTEGER, foreign key (campus_id) references TB_CAMPUS (id))',
    (err) => {
        if (err) {
            console.error('Erro ao criar tabela TB_CURSO:', err.message);
        } else {
            console.log('Tabela TB_CURSO criada com sucesso.');
        }
    }
);

// Criar tabela TB_LABORATORIO
db.run(
    'CREATE TABLE IF NOT EXISTS TB_LABORATORIO (id INTEGER PRIMARY KEY AUTOINCREMENT, nome STRING, responsavel_email STRING, curso_id INTEGER,foreign key (curso_id) references TB_CURSO (id))',
    (err) => {
        if (err) {
            console.error('Erro ao criar tabela TB_LABORATORIO:', err.message);
        } else {
            console.log('Tabela TB_LABORATORIO criada com sucesso.');
        }
    }
);

// Criar tabela TB_PROJETO
db.run(
    'CREATE TABLE IF NOT EXISTS TB_PROJETO (id INTEGER PRIMARY KEY AUTOINCREMENT, nome STRING, inicio DATE, termino DATE, laboratorio_id INTEGER, professor_id INTEGER, foreign key (laboratorio_id) references TB_LABORATORIO (id), foreign key (professor_id) references TB_PROFESSOR (id))',
    (err) => {
        if (err) {
            console.error('Erro ao criar tabela TB_PROJETO:', err.message);
        } else {
            console.log('Tabela TB_PROJETO criada com sucesso.');
        }
    }
);

// Criar tabela TB_PROFESSOR
db.run(
    'CREATE TABLE IF NOT EXISTS TB_PROFESSOR (id INTEGER PRIMARY KEY AUTOINCREMENT, nome STRING, email STRING, celular STRING)',
    (err) => {
        if (err) {
            console.error('Erro ao criar tabela TB_PROFESSOR:', err.message);
        } else {
            console.log('Tabela TB_PROFESSOR criada com sucesso.');
        }
    }
);

// Criar tabela TB_FREQUENCIA
db.run(
    'CREATE TABLE IF NOT EXISTS TB_FREQUENCIA (id INTEGER PRIMARY KEY AUTOINCREMENT, date DATE, frequencia_valida E_Frequencia_Valida, projeto_id INTEGER, professor_id INTEGER, bolsista_id INTEGER, horario_planejado_id INTEGER, foreign key (projeto_id) references TB_PROJETO (id), foreign key (professor_id) references TB_PROFESSOR (id), foreign key (bolsista_id) references TB_BOLSISTA (id), foreign key (horario_planejado_id) references TB_HORARIO_PLANEJADO (id) )',
    (err) => {
        if (err) {
            console.error('Erro ao criar tabela TB_FREQUENCIA:', err.message);
        } else {
            console.log('Tabela TB_FREQUENCIA criada com sucesso.');
        }
    }
);

// Criar tabela TB_BOLSISTA
db.run(
    'CREATE TABLE IF NOT EXISTS TB_BOLSISTA (id INTEGER PRIMARY KEY AUTOINCREMENT, nome STRING, email STRING, celular STRING)',
    (err) => {
        if (err) {
            console.error('Erro ao criar tabela TB_BOLSISTA:', err.message);
        } else {
            console.log('Tabela TB_BOLSISTA criada com sucesso.');
        }
    }
);

// Criar tabela TB_HORARIO_PLANEJADO
db.run(
    'CREATE TABLE IF NOT EXISTS TB_HORARIO_PLANEJADO (id INTEGER PRIMARY KEY AUTOINCREMENT, bolsista_id INTEGER, ano INTEGER, semestre INTEGER, faixa_horaria_id INTEGER, dia INTEGER, foreign key (bolsista_id) references TB_BOLSISTA (id), foreign key (faixa_horaria_id) references TB_FAIXA_HORARIA (id) )',
    (err) => {
        if (err) {
            console.error('Erro ao criar tabela TB_HORARIO_PLANEJADO:', err.message);
        } else {
            console.log('Tabela TB_HORARIO_PLANEJADO criada com sucesso.');
        }
    }
);

// Criar tabela TB_FAIXA_HORARIA
db.run(
    'CREATE TABLE IF NOT EXISTS TB_FAIXA_HORARIA (id INTEGER PRIMARY KEY AUTOINCREMENT, turno E_TURNO , faixa_horario E_FAIXA_HORARIA)',
    (err) => {
        if (err) {
            console.error('Erro ao criar tabela TB_FAIXA_HORARIA:', err.message);
        } else {
            console.log('Tabela TB_FAIXA_HORARIA criada com sucesso.');
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
app.post('/CAMPUS', (req, res) => {
    const { nome } = req.body;
    db.run('INSERT INTO TB_CAMPUS (nome) VALUES (?)', [nome], (err) => {
        if (err) {
            res.status(500).json({ error: err.message });
            return;
        }
        res.status(201).json({ message: 'Vendedor criado com sucesso' });
    });
});

// Criar uma nota fiscal 
app.post('/notasfiscais', (req, res) => {
    const { id, valor, cliente_id, vendedor_id } = req.body;
    db.run('INSERT INTO TB_NOTA_FISCAL (id ,valor, cliente_id, vendedor_id) VALUES (?, ?, ?, ?)', [id, valor, cliente_id, vendedor_id], (err) => {
        if (err) {
            res.status(500).json({ error: err.message });
            return;
        }
        res.status(201).json({ message: 'Nota Fiscal criada com sucesso' });
    });
});

// Criar um produto
app.post('/LABORATORIO', (req, res) => {
    const { id, descricao, preco_unitario } = req.body;
    db.run('INSERT INTO TB_LABORATORIO (id, descricao, preco_unitario) VALUES (?, ?, ?)', [id, descricao, preco_unitario], (err) => {
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

// Obter todos os CAMPUS
app.get('/CAMPUS', (req, res) => {
    db.all('SELECT * FROM TB_CAMPUS', (err, rows) => {
        if (err) {
            res.status(500).json({ error: err.message });
            return;
        }
        res.json({ CAMPUS: rows });
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

// Obter todos os LABORATORIO
app.get('/LABORATORIO', (req, res) => {
    db.all('SELECT * FROM TB_LABORATORIO', (err, rows) => {
        if (err) {
            res.status(500).json({ error: err.message });
            return;
        }
        res.json({ LABORATORIO: rows });
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
app.get('/CAMPUS/:id', (req, res) => {
    const { id } = req.params;
    db.get('SELECT * FROM TB_CAMPUS WHERE id = ?', [id], (err, row) => {
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
app.get('/LABORATORIO/:id', (req, res) => {
    const { id } = req.params;
    db.get('SELECT * FROM TB_LABORATORIO WHERE id = ?', [id], (err, row) => {
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
app.put('/CAMPUS/:id', (req, res) => {
    const { id } = req.params;
    const { nome } = req.body;
    db.run('UPDATE TB_CAMPUS SET nome = ? WHERE id = ?', [nome, id], (err) => {
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
    db.run('UPDATE TB_NOTA_FISCAL SET valor = ?, cliente_id = ?, vendedor_id = ? WHERE id = ?', [valor, cliente_id, vendedor_id, id], (err) => {
        if (err) {
            res.status(500).json({ error: err.message });
            return;
        }
        res.json({ message: 'Nota Fiscal atualizado com sucesso' });
    });
});

// Atualizar um Produto por ID
app.put('/LABORATORIO/:id', (req, res) => {
    const { id } = req.params;
    const { descricao, preco_unitario } = req.body;
    db.run('UPDATE TB_LABORATORIO SET descricao = ?, preco_unitario = ? WHERE id = ?', [descricao, preco_unitario, id], (err) => {
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

// Excluir um CAMPUS por ID
app.delete('/CAMPUS/:id', (req, res) => {
    const { id } = req.params;
    db.run('DELETE FROM TB_CAMPUS WHERE id = ?', [id], (err) => {
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
app.delete('/LABORATORIO/:id', (req, res) => {
    const { id } = req.params;
    db.run('DELETE FROM TB_LABORATORIO WHERE id = ?', [id], (err) => {
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