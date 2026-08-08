const express = require('express');
const router = express.Router();
const prisma = require('../prismaClient');

// GET /venues?query=&type=
router.get('/', async (req, res) => {
  const { query, type } = req.query;
  const where = {};
  if (query) where.OR = [{ name: { contains: query, mode: 'insensitive' }}, { area: { contains: query, mode: 'insensitive' }}];
  if (type && ['FIVE','SEVEN','ELEVEN'].includes(type)) where.type = type;
  const venues = await prisma.venue.findMany({ where, orderBy: { createdAt: 'desc' }});
  res.json(venues);
});

// GET /venues/:id
router.get('/:id', async (req, res) => {
  const v = await prisma.venue.findUnique({ where: { id: req.params.id }});
  if (!v) return res.status(404).json({ error: 'Not found' });
  res.json(v);
});

module.exports = router;
