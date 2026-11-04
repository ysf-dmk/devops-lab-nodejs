import { Router } from 'express'

const router = Router()

const metrics = [
  { id: 1, name: 'doctors', value: 12 },
  { id: 2, name: 'patients', value: 340 }
]

router.get('/api/metrics', (_req, res) => {
  res.status(200).json(metrics)
})

router.post('/api/metrics', (req, res) => {
  const { name, value } = req.body || {}
  if (typeof name !== 'string' || name.trim() === '' || typeof value !== 'number' || Number.isNaN(value)) {
    return res.status(400).json({ error: 'Missing required fields: name (string) and value (number)' })
  }
  const metric = { id: metrics.length + 1, name, value }
  metrics.push(metric)
  res.status(201).json(metric)
})

export default router
