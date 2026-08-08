require('dotenv').config();
const express = require('express');
const cors = require('cors');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const authRoutes = require('./routes/auth');
const venueRoutes = require('./routes/venues');
const matchRoutes = require('./routes/matches');

const app = express();
app.use(cors());
app.use(express.json());

const UPLOAD_DIR = process.env.UPLOAD_DIR || path.join(__dirname, '..', 'uploads');
if (!fs.existsSync(UPLOAD_DIR)) fs.mkdirSync(UPLOAD_DIR, { recursive: true });

const storage = multer.diskStorage({
  destination: function (req, file, cb) { cb(null, UPLOAD_DIR); },
  filename: function (req, file, cb) { cb(null, Date.now() + '-' + file.originalname); }
});
const upload = multer({ storage });

app.use('/uploads', express.static(UPLOAD_DIR));

// Routes
app.use('/auth', authRoutes);
app.use('/venues', venueRoutes);
app.use('/matches', matchRoutes);

// upload endpoint
app.post('/upload', upload.single('file'), (req, res) => {
  res.json({ url: `/uploads/${path.basename(req.file.path)}` });
});

const port = process.env.PORT || 4000;
app.listen(port, () => console.log(`Server running on http://localhost:${port}`));
