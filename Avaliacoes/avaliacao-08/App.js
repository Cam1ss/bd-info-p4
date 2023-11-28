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
    'CREATE TABLE IF NOT EXISTS TB_FREQUENCIA (id INTEGER PRIMARY KEY AUTOINCREMENT, date DATE, frequencia_valida TEXT CHECK (frequencia_valida IN ("NAO", "SIM")), projeto_id INTEGER, professor_id INTEGER, bolsista_id INTEGER, horario_planejado_id INTEGER, foreign key (projeto_id) references TB_PROJETO (id), foreign key (professor_id) references TB_PROFESSOR (id), foreign key (bolsista_id) references TB_BOLSISTA (id), foreign key (horario_planejado_id) references TB_HORARIO_PLANEJADO (id) )',
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



// Criar tabela TB_E_FAIXA_HORARIA
db.run(
    'CREATE TABLE IF NOT EXISTS TB_E_FAIXA_HORARIA (id INTEGER PRIMARY KEY AUTOINCREMENT, turno TEXT CHECK (turno IN ("Manhã", "Tarde", "Noite")), faixa_horaria TEXT CHECK ( faixa_horaria IN ( "A-Primeiro_Horario", "B_Segundo_Horario", "C-Terceiro_Horario", "D_Quarto_Horario", "E_Quinto_Horario" )))',
    (err) => {
        if (err) {
            console.error('Erro ao criar tabela TB_E_FAIXA_HORARIA:', err.message);
        } else {
            console.log('Tabela TB_E_FAIXA_HORARIA criada com sucesso.');
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

// Inicie o servidor
app.listen(port, () => {
    console.log(`Servidor está ouvindo na porta ${port}`);
});
