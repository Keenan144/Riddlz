const express = require('express');
const path = require('path');
const fs = require('fs');

const app = express();
const PORT = process.env.PORT || 3000;

// Serve static files from the public directory
app.use(express.static('public'));

// API endpoint to get riddles
app.get('/api/riddles', (req, res) => {
  const riddlesPath = path.join(__dirname, 'riddles.json');
  fs.readFile(riddlesPath, 'utf8', (err, data) => {
    if (err) {
      return res.status(500).json({ error: 'Failed to load riddles' });
    }
    res.json(JSON.parse(data));
  });
});

app.listen(PORT, () => {
  console.log(`🎭 Riddlz app running on http://localhost:${PORT}`);
});
