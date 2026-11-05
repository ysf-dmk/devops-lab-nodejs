import express from 'express'

const router = express.Router()

const doctors = [
  { id: 1, name: 'Dr. Sarah Lee', specialty: 'Cardiology' },
  { id: 2, name: 'Dr. Amir Khan', specialty: 'Pediatrics' }
]

let nextDoctorId = 3

// List all doctors
router.get('/api/doctors', (_req, res) => {
  return res.status(200).json(doctors)
})

// Retrieve one doctor
router.get('/api/doctors/:id', (req, res) => {
  const id = Number(req.params.id)

  if (!Number.isSafeInteger(id) || id <= 0) {
    return res.status(400).json({ error: 'Invalid doctor ID' })
  }

  const doctor = doctors.find(doctor => doctor.id === id)

  if (!doctor) {
    return res.status(404).json({ error: 'Doctor not found' })
  }

  return res.status(200).json(doctor)
})

// Create a doctor
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
    id: nextDoctorId++,
    name: name.trim(),
    specialty: specialty.trim()
  }

  doctors.push(newDoctor)

  return res.status(201).json(newDoctor)
})

// Update a doctor
router.put('/api/doctors/:id', (req, res) => {
  const id = Number(req.params.id)

  if (!Number.isSafeInteger(id) || id <= 0) {
    return res.status(400).json({ error: 'Invalid doctor ID' })
  }

  const doctor = doctors.find(doctor => doctor.id === id)

  if (!doctor) {
    return res.status(404).json({ error: 'Doctor not found' })
  }

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

  doctor.name = name.trim()
  doctor.specialty = specialty.trim()

  return res.status(200).json(doctor)
})

// Delete a doctor
router.delete('/api/doctors/:id', (req, res) => {
  const id = Number(req.params.id)

  if (!Number.isSafeInteger(id) || id <= 0) {
    return res.status(400).json({ error: 'Invalid doctor ID' })
  }

  const index = doctors.findIndex(doctor => doctor.id === id)

  if (index === -1) {
    return res.status(404).json({ error: 'Doctor not found' })
  }

  doctors.splice(index, 1)

  return res.status(204).end()
})

export default router
