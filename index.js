const express = require('express');
const bodyParser = require('body-parser');
const jwt = require('jsonwebtoken');
const cors = require("cors");

const app = express();

app.use(cors());
app.use(express.json());
app.use(bodyParser.json());

const secretKey = 'your-secret-key';

// Mock user data (replace with your authentication logic)
const users = [
    { id: 1, username: 'aseem', password: 'aseem' },
    { id: 2, username: 'sahoo', password: 'sahoo' }
];

const verifyToken = (req, res, next) => {
    const token = req.headers.authorization;
  
    if (!token) {
      return res.status(401).json({ message: 'Token not provided' });
    }
  
    jwt.verify(token, secretKey, (err, decoded) => {
      if (err) {
        return res.status(401).json({ message: 'Invalid token' });
      }
      req.user = decoded;
      next();
    });
  };

  app.get('/data', (req, res) => {

    res.json(users);
});

// Endpoint for user login and token generation
app.post('/login', (req, res) => {
    const { username, password } = req.body;

    // Replace with actual authentication logic
    const user = users.find(u => u.username === username && u.password === password);

    if (!user) {
        return res.status(401).json({ message: 'Invalid credentials' });
    }

    const token =   jwt.sign({ id: user.id, username: user.username }, secretKey, { expiresIn: '7d' });

    res.json({ token });
});

app.get('/profile', verifyToken, (req, res) => {
    const user = users.find(u => u.username === 'aseem' && u.password === 'aseem');

    if (user === null) {
        return res.json("invalid login/token for profile access");
    }
    res.json(user);
});


const PORT = 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});