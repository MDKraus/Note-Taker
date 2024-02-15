const express = require('express');
const path = require('path');
const fs = require('fs');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.urlencoded({extended: true}));
app.use(express.json());

app.use(express.static('public'));

app.get('/', (req, res) => {
  console.log('Handling request to /');
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.get('/notes', (req, res) => {
  console.log('Handling request to /notes');
  res.sendFile(path.join(__dirname, 'public', 'notes.html'));
});

app.get('/api/notes', (req, res) => {
  console.log('Handling request to /api/notes');
  const notes = JSON.parse(fs.readFileSync(path.join(__dirname, 'public', 'db', 'db.json'), 'utf8')) || [];
  res.json(notes);
});


app.post('/api/notes', (req, res) => {
  const newNote = req.body;

  try {
    let notes = JSON.parse(fs.readFileSync(path.join(__dirname, 'public', 'db', 'db.json'), 'utf8')) || [];
    console.log('Original Notes:', notes);

    // Add the new note
    newNote.id = Date.now();
    notes.push(newNote);
    console.log('Notes after adding new note:', notes);

    // Save the updated notes back to the file
    fs.writeFileSync(path.join(__dirname, 'public', 'db', 'db.json'), JSON.stringify(notes));
    console.log('Notes after saving:', notes);

    res.json(newNote);
  } catch (error) {
    console.error('Error during POST request:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});
app.delete('/api/notes/:id', (req, res) => {
  const noteId = parseInt(req.params.id);

  try {
    let notes = JSON.parse(fs.readFileSync(path.join(__dirname, 'public', 'db', 'db.json'), 'utf8')) || [];
    console.log('Original Notes:', notes);

    // Filter out the note with the specified ID
    notes = notes.filter((note) => note.id !== noteId);
    console.log('Filtered Notes:', notes);

    // Save the updated notes back to the file
    fs.writeFileSync(path.join(__dirname, 'public', 'db', 'db.json'), JSON.stringify(notes));
    console.log('Notes after deletion:', notes);

    res.json({ success: true });
  } catch (error) {
    console.error('Error during DELETE request:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});


app.listen(PORT, '0.0.0.0', () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
