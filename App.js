const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const user = require('./routes/User');
const admin = require('./routes/Admin');
const Categories = require('./routes/Categories');
const Genre = require('./routes/Genre');
const Games = require('./routes/Games');
const Stripe = require('./routes/paymentRoutes');
const Cart = require('./routes/Cart');
const MyError = require('./utis/MyError');
const path = require('path');
const fs = require('fs');

const app = express();

dotenv.config();

app.use(express.json());
app.use(cors({
  origin: 'http://localhost:3000',
  credentials: true,
}));

app.get('/download/:filename', (req, res) => {
  try {
    const { filename } = req.params;
    const filePath = path.join(__dirname, 'uploads', 'Files', filename);

    res.download(filePath, (err) => {
      if (err) {
        console.error('Error downloading file:', err);
        res.status(500).json({ success: 0, message: 'Error downloading file' });
      }
    });
  } catch (error) {
    console.error('Error handling file download:', error);
    res.status(500).json({ success: 0, message: 'Error handling file download' });
  }
});

app.get('/uploads/Files', (req, res) => {
  try {
    const uploadDirectory = path.join(__dirname, 'uploads', 'Files');
    const files = fs.readdirSync(uploadDirectory);
    // console.log('All files in directory:', files)

    const fileDetails = files.map(filename => ({
      filename,
      filePath: path.join(uploadDirectory, filename)
    }));

    res.json(fileDetails);
  } catch (error) {
    console.error('Error fetching files:', error);
    res.status(500).json({ success: 0, message: 'Error fetching files' });
  }
});

app.use('/uploads/Files', express.static(path.join(__dirname, 'uploads', 'Files')));

app.use('/api/categories', Categories);
app.use('/api/genres', Genre);
app.use('/api/games', Games);
app.use('/api/user', user);
app.use('/api/admin', admin);
app.use('/api/stripe', Stripe);
app.use('/api/cart', Cart);

app.use(MyError);

const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
