const express = require('express');
const mysql = require('mysql');

const app = express();
const port = 3000;

// 创建MySQL连接池
const pool = mysql.createPool({
    host: 'localhost',
    user: 'root',
    password: '1234',
    database: 'osexp'
});

// 处理HTTP POST请求体中的JSON数据
app.use(express.json());

// 设置静态文件目录
app.use(express.static('public'));

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});
// 处理GET /todos 请求，返回所有待办事项
app.get('/todos', (req, res) => {
    pool.query('SELECT * FROM t_todo', (error, results) => {
        if (error) {
            console.error('Error executing query', error);
            res.status(500).json({ error: 'Error executing query' });
        } else {
            res.json(results);
        }
    });
});

// 处理POST /todos 请求，创建新的待办事项
app.post('/todos', (req, res) => {
    const { title, description, due_date } = req.body;
    pool.query('INSERT INTO t_todo (title, description, due_date) VALUES (?, ?, ?)', [title, description, due_date], (error, result) => {
        if (error) {
            console.error('Error executing query', error);
            res.status(500).json({ error: 'Error executing query' });
        } else {
            res.json({ id: result.insertId });
        }
    });
});

// 处理DELETE /todos/:id 请求，删除指定的待办事项
app.delete('/todos/:id', (req, res) => {
    const id = req.params.id;
    pool.query('DELETE FROM t_todo WHERE id = ?', [id], (error) => {
        if (error) {
            console.error('Error executing query', error);
            res.status(500).json({ error: 'Error executing query' });
        } else {
            res.sendStatus(204);
        }
    });
});

// 处理PUT /todos/:id 请求，更新指定的待办事项
app.put('/todos/:id', (req, res) => {
    const id = req.params.id;
    const { title, description, due_date, status } = req.body;
    pool.query('UPDATE t_todo SET title = ?, description = ?, due_date = ?, status = ? WHERE id = ?', [title, description, due_date, status, id], (error) => {
        if (error) {
            console.error('Error executing query', error);
            res.status(500).json({ error: 'Error executing query' });
        } else {
            res.sendStatus(204);
        }
    });
});

// 启动Express应用程序
app.listen(port, () => {
    console.log(`Server listening at http://localhost:${port}`);
});