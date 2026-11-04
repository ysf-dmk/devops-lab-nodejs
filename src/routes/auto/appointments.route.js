import { Router } from 'express'

const router = Router()

const appointments = [
  { id: 1, doctor: 'Dr. Sarah Lee', patient: 'Alice Martin', date: '2026-11-10' },
  { id: 2, doctor: 'Dr. Amir Khan', patient: 'John', date: '2026-11-12' }
]

const isFilled = (value) => typeof value === 'string' && value.trim() !== ''

router.get('/api/appointments', (_req, res) => {
  res.status(200).json(appointments)
})

router.post('/api/appointments', (req, res) => {
  const { doctor, patient, date } = req.body || {}
  if (!isFilled(doctor) || !isFilled(patient) || !isFilled(date)) {
    return res.status(400).json({ error: 'Missing required fields: doctor, patient and date' })
  }
  const appointment = { id: appointments.length + 1, doctor, patient, date }
  appointments.push(appointment)
  res.status(201).json(appointment)
})

export default router
