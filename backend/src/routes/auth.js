const express = require('express');
const router = express.Router();
const prisma = require('../prismaClient');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const JWT_SECRET = process.env.JWT_SECRET || 'secret';

router.post('/guest', async (req, res) => {
  const email = `guest+${Date.now()}@local`;
  const user = await prisma.user.create({ data: { email, isGuest: true }});
  const token = jwt.sign({ sub: user.id }, JWT_SECRET, { expiresIn: '30d' });
  res.json({ token, user });
});

router.post('/register', async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) return res.status(400).json({ error: 'Missing fields' });
  const hash = await bcrypt.hash(password, 10);
  const user = await prisma.user.create({ data: { email, passwordHash: hash }});
  const token = jwt.sign({ sub: user.id }, JWT_SECRET);
  res.json({ token, user });
});

router.post('/login', async (req, res) => {
  const { email, password } = req.body;
  const user = await prisma.user.findUnique({ where: { email }});
  if (!user) return res.status(401).json({ error: 'Invalid' });
  const ok = await bcrypt.compare(password, user.passwordHash || '');
  if (!ok) return res.status(401).json({ error: 'Invalid' });
  const token = jwt.sign({ sub: user.id }, JWT_SECRET);
  res.json({ token, user });
});

module.exports = router;
