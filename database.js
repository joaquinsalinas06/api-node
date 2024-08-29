const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database(':memory:');

// Initialize the database
db.serialize(() => {
    db.run(`CREATE TABLE items (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL,
        value TEXT NOT NULL
    )`);
});

function createItem(name, value, callback) {
    db.run('INSERT INTO items (name, value) VALUES (?, ?)', [name, value], callback);
}

function getAllItems(callback) {
    db.all('SELECT * FROM items', callback);
}

function getItemById(id, callback) {
    db.get('SELECT * FROM items WHERE id = ?', [id], callback);
}

function updateItem(id, name, value, callback) {
    db.run('UPDATE items SET name = ?, value = ? WHERE id = ?', [name, value, id], callback);
}

function deleteItem(id, callback) {
    db.run('DELETE FROM items WHERE id = ?', [id], callback);
}

module.exports = {
    createItem,
    getAllItems,
    getItemById,
    updateItem,
    deleteItem
};
