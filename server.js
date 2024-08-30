const express = require('express');
const bodyParser = require('body-parser');
const db = require('./database');

const app = express();
app.use(bodyParser.json());

const PORT = process.env.PORT || 8000;

// CREATE
app.post('/items', (req, res) => {
    const { name, value } = req.body;
    db.createItem(name, value, (err) => {
        if (err) {
            res.status(500).send({ error: 'Failed to create item' });
        } else {
            res.status(201).send({ message: 'Item created successfully' });
        }
    });
});

// READ ALL
app.get('/items', (req, res) => {
    db.getAllItems((err, items) => {
        if (err) {
            res.status(500).send({ error: 'Failed to retrieve items' });
        } else {
            res.status(200).json(items);
        }
    });
});

// READ BY ID
app.get('/items/:id', (req, res) => {
    const { id } = req.params;
    db.getItemById(id, (err, item) => {
        if (err) {
            res.status(500).send({ error: 'Failed to retrieve item' });
        } else if (!item) {
            res.status(404).send({ error: 'Item not found' });
        } else {
            res.status(200).json(item);
        }
    });
});

// UPDATE
app.put('/items/:id', (req, res) => {
    const { id } = req.params;
    const { name, value } = req.body;
    db.updateItem(id, name, value, (err) => {
        if (err) {
            res.status(500).send({ error: 'Failed to update item' });
        } else {
            res.status(200).send({ message: 'Item updated successfully' });
        }
    });
});

// DELETE
app.delete('/items/:id', (req, res) => {
    const { id } = req.params;
    db.deleteItem(id, (err) => {
        if (err) {
            res.status(500).send({ error: 'Failed to delete item' });
        } else {
            res.status(200).send({ message: 'Item deleted successfully' });
        }
    });
});

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
