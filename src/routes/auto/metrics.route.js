import { Router } from 'express'

const router = Router()

const metrics = [
  { id: 1, name: 'doctors', value: 12 },
  { id: 2, name: 'patients', value: 340 }
]
let nextId = 3

const isValidName = (name) => typeof name === 'string' && name.trim() !== ''
const isValidValue = (value) => typeof value === 'number' && !Number.isNaN(value)

router.get('/api/metrics', (_req, res) => {
  res.status(200).json(metrics)
})

router.get('/api/metrics/:id', (req, res) => {
  const metric = metrics.find((m) => m.id === Number(req.params.id))
  if (!metric) return res.status(404).json({ error: 'Metric not found' })
  res.status(200).json(metric)
})

router.post('/api/metrics', (req, res) => {
  const { name, value } = req.body || {}
  if (!isValidName(name) || !isValidValue(value)) {
    return res.status(400).json({ error: 'Missing required fields: name (string) and value (number)' })
  }
  const metric = { id: nextId++, name, value }
  metrics.push(metric)
  res.status(201).json(metric)
})

router.put('/api/metrics/:id', (req, res) => {
  const index = metrics.findIndex((m) => m.id === Number(req.params.id))
  if (index === -1) return res.status(404).json({ error: 'Metric not found' })
  const { name, value } = req.body || {}
  if ((name !== undefined && !isValidName(name)) || (value !== undefined && !isValidValue(value))) {
    return res.status(400).json({ error: 'Invalid fields: name must be a non-empty string and value a number' })
  }
  metrics[index] = {
    ...metrics[index],
    ...(name !== undefined && { name }),
    ...(value !== undefined && { value })
  }
  res.status(200).json(metrics[index])
})

router.delete('/api/metrics/:id', (req, res) => {
  const index = metrics.findIndex((m) => m.id === Number(req.params.id))
  if (index === -1) return res.status(404).json({ error: 'Metric not found' })
  metrics.splice(index, 1)
  res.status(204).end()
})

export default router
