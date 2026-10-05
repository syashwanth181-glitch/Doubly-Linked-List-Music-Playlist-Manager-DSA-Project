const express = require('express');
const path = require('path');
const Playlist = require('./public/playlist');

const app = express();
const playlist = new Playlist();               // one shared in-memory linked list
const OPS = ['add', 'remove', 'play', 'next', 'prev', 'reverse', 'reset'];

app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

app.get('/api/playlist', (req, res) => res.json(playlist.state()));

app.post('/api/:op', (req, res) => {
  const { op } = req.params;
  if (!OPS.includes(op)) return res.status(404).json({ error: 'Unknown operation' });
  try {
    playlist[op](req.body || {});
    res.json(playlist.state());
  } catch (e) {
    res.status(400).json({ error: e.message });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Playlist Manager running on http://localhost:${PORT}`));
