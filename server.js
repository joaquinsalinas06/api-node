const http = require('http');
const url = require('url');
const db = require('./database');

const PORT = 8000;

const server = http.createServer((req, res) => {
    const parsedUrl = url.parse(req.url, true);
    const method = req.method;
    const { pathname } = parsedUrl;

    // Crear nuevo item
    if (pathname === '/items' && method === 'POST') {
        let body = '';
        req.on('data', chunk => {
            body += chunk.toString();
        });
        req.on('end', () => {
            const { name, value } = JSON.parse(body);
            db.createItem(name, value, (err) => {
                if (err) {
                    res.writeHead(500, { 'Content-Type': 'application/json' });
                    res.end(JSON.stringify({ error: 'Failed to create item' }));
                } else {
                    res.writeHead(201, { 'Content-Type': 'application/json' });
                    res.end(JSON.stringify({ message: 'Item created successfully' }));
                }
            });
        });
    }
    // Obtener todos los items
    else if (pathname === '/items' && method === 'GET') {
        db.getAllItems((err, items) => {
            if (err) {
                res.writeHead(500, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({ error: 'Failed to retrieve items' }));
            } else {
                res.writeHead(200, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify(items));
            }
        });
    }
    // Obtener item por ID
    else if (pathname.startsWith('/items/') && method === 'GET') {
        const id = pathname.split('/')[2];
        db.getItemById(id, (err, item) => {
            if (err) {
                res.writeHead(500, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({ error: 'Failed to retrieve item' }));
            } else if (!item) {
                res.writeHead(404, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({ error: 'Item not found' }));
            } else {
                res.writeHead(200, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify(item));
            }
        });
    }
    // Actualizar item
    else if (pathname.startsWith('/items/') && method === 'PUT') {
        const id = pathname.split('/')[2];
        let body = '';
        req.on('data', chunk => {
            body += chunk.toString();
        });
        req.on('end', () => {
            const { name, value } = JSON.parse(body);
            db.updateItem(id, name, value, (err) => {
                if (err) {
                    res.writeHead(500, { 'Content-Type': 'application/json' });
                    res.end(JSON.stringify({ error: 'Failed to update item' }));
                } else {
                    res.writeHead(200, { 'Content-Type': 'application/json' });
                    res.end(JSON.stringify({ message: 'Item updated successfully' }));
                }
            });
        });
    }
    // Eliminar item
    else if (pathname.startsWith('/items/') && method === 'DELETE') {
        const id = pathname.split('/')[2];
        db.deleteItem(id, (err) => {
            if (err) {
                res.writeHead(500, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({ error: 'Failed to delete item' }));
            } else {
                res.writeHead(200, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({ message: 'Item deleted successfully' }));
            }
        });
    }
    // Ruta no encontrada
    else {
        res.writeHead(404, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ error: 'Route not found' }));
    }
});

server.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
