import express from 'express'

const router = express.Router()

const doctors = [
  { id: 1, name: 'Dr. Sarah Lee', specialty: 'Cardiology' },
  { id: 2, name: 'Dr. Amir Khan', specialty: 'Pediatrics' }
]

router.get('/api/doctors', (_req, res) => {
  res.status(200).json(doctors)
})

router.post('/api/doctors', (req, res) => {
  const { name, specialty } = req.body ?? {}

  if (
    typeof name !== 'string' ||
    typeof specialty !== 'string' ||
    !name.trim() ||
    !specialty.trim()
  ) {
    return res.status(400).json({
      error: 'Name and specialty are required and must be non-empty strings'
    })
  }

  const newDoctor = {
    id: doctors.length + 1,
    name: name.trim(),
    specialty: specialty.trim()
  }

  doctors.push(newDoctor)

  return res.status(201).json(newDoctor)
})

export default router
