const express = require('express');
const router = express.Router();
const prisma = require('../prismaClient');

// Create match
// body: { title, venueId, type (FIVE|SEVEN|ELEVEN), formation, scheduledAt, players: [{ userId, slotIndex, position }] }
router.post('/', async (req, res) => {
  try {
    const { title, venueId, type, formation, scheduledAt, creatorId, players = [] } = req.body;
    if (!title || !type || !scheduledAt || !creatorId) return res.status(400).json({ error: 'Missing fields' });

    const match = await prisma.match.create({
      data: {
        title,
        venueId: venueId || null,
        type,
        formation,
        scheduledAt: new Date(scheduledAt),
        creatorId,
        players: {
          create: players.map(p => ({
            userId: p.userId || null,
            position: p.position || null,
            slotIndex: p.slotIndex ?? 0
          }))
        }
      },
      include: { players: true }
    });
    res.json(match);
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: 'Server error' });
  }
});

// Get match by id
router.get('/:id', async (req, res) => {
  const match = await prisma.match.findUnique({
    where: { id: req.params.id },
    include: { players: { include: { user: true } }, venue: true, creator: true }
  });
  if (!match) return res.status(404).json({ error: 'Not found' });
  res.json(match);
});

// Update players (replace)
// body: { players: [{ userId, slotIndex, position }] }
router.patch('/:id/players', async (req, res) => {
  try {
    const { players } = req.body;
    const matchId = req.params.id;
    // Remove existing players
    await prisma.matchPlayer.deleteMany({ where: { matchId }});
    // Add new
    const created = await prisma.matchPlayer.createMany({
      data: players.map(p => ({ matchId, userId: p.userId || null, slotIndex: p.slotIndex ?? 0, position: p.position || null }))
    });
    res.json({ created });
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;
