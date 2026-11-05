import { Router } from 'express'

const router = Router()

let patients = [
  { id: 1, name: 'Alice', age: 30 },
  { id: 2, name: 'John', age: 45 }
]

// GET all patients
router.get('/api/patients', (_req, res) => {
  res.status(200).json(patients)
})

// GET patient by ID
router.get('/api/patients/:id', (req, res) => {
  const id = Number(req.params.id)
  const patient = patients.find(p => p.id === id)

  if (!patient) {
    return res.status(404).json({ error: 'Patient not found' })
  }

  res.status(200).json(patient)
})

// POST - Create a patient
router.post('/api/patients', (req, res) => {
  const { name, age } = req.body

  if (!name || age === undefined || !Number.isFinite(Number(age))) {
    return res.status(400).json({ error: 'Missing or invalid fields' })
  }

  const newPatient = {
    id: patients.length
      ? Math.max(...patients.map(p => p.id)) + 1
      : 1,
    name,
    age: Number(age)
  }

  patients.push(newPatient)

  res.status(201).json(newPatient)
})

// PUT - Update a patient
router.put('/api/patients/:id', (req, res) => {
  const id = Number(req.params.id)
  const index = patients.findIndex(p => p.id === id)

  if (index === -1) {
    return res.status(404).json({ error: 'Patient not found' })
  }

  patients[index] = {
    ...patients[index],
    ...req.body,
    id
  }

  res.status(200).json(patients[index])
})

// DELETE - Delete a patient
router.delete('/api/patients/:id', (req, res) => {
  const id = Number(req.params.id)

  const before = patients.length
  patients = patients.filter(p => p.id !== id)

  if (patients.length === before) {
    return res.status(404).json({ error: 'Patient not found' })
  }

  res.status(204).end()
})

export default router
