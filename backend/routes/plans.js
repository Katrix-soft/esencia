// routes/plans.js — Endpoints de planes de suscripción
const express = require('express');
const { PLANS } = require('../swagger-spec');
const router = express.Router();

// GET /plans — Lista todos los planes disponibles
router.get('/', (req, res) => {
  res.json(PLANS);
});

// GET /plans/:planId — Obtiene un plan específico por su id
router.get('/:planId', (req, res) => {
  const plan = PLANS.find(p => p.id === req.params.planId);
  if (!plan) return res.status(404).json({ error: 'Plan no encontrado' });
  res.json(plan);
});

module.exports = router;
