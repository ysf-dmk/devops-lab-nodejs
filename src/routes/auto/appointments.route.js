import { Router } from 'express'

const router = Router()

const appointments = [
  { id: 1, doctor: 'Dr. Sarah Lee', patient: 'Alice Martin', date: '2026-11-10' },
  { id: 2, doctor: 'Dr. Amir Khan', patient: 'John', date: '2026-11-12' }
]

const isFilled = (value) => typeof value === 'string' && value.trim() !== ''

// GET: récupérer tous les rendez-vous
router.get('/api/appointments', (_req, res) => {
  res.status(200).json(appointments)
})

// GET: récupérer un rendez-vous par son ID
router.get('/api/appointments/:id', (req, res) => {
  const id = Number(req.params.id)

  const appointment = appointments.find((appointment) => appointment.id === id)

  if (!appointment) {
    return res.status(404).json({ error: 'Appointment not found' })
  }

  res.status(200).json(appointment)
})

// POST: créer un rendez-vous
router.post('/api/appointments', (req, res) => {
  const { doctor, patient, date } = req.body || {}

  if (!isFilled(doctor) || !isFilled(patient) || !isFilled(date)) {
    return res.status(400).json({
      error: 'Missing required fields: doctor, patient and date'
    })
  }

  const appointment = {
    id: appointments.length + 1,
    doctor,
    patient,
    date
  }

  appointments.push(appointment)

  res.status(201).json(appointment)
})

// PUT: modifier un rendez-vous
router.put('/api/appointments/:id', (req, res) => {
  const id = Number(req.params.id)

  const index = appointments.findIndex((appointment) => appointment.id === id)

  if (index === -1) {
    return res.status(404).json({ error: 'Appointment not found' })
  }

  const { doctor, patient, date } = req.body || {}

  if (!isFilled(doctor) || !isFilled(patient) || !isFilled(date)) {
    return res.status(400).json({
      error: 'Required fields: doctor, patient and date'
    })
  }

  appointments[index] = {
    ...appointments[index],
    doctor,
    patient,
    date
  }

  res.status(200).json(appointments[index])
})

// DELETE: supprimer un rendez-vous
router.delete('/api/appointments/:id', (req, res) => {
  const id = Number(req.params.id)

  const index = appointments.findIndex((appointment) => appointment.id === id)

  if (index === -1) {
    return res.status(404).json({ error: 'Appointment not found' })
  }

  appointments.splice(index, 1)

  res.status(204).end()
})

export default router