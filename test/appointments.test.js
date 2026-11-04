import request from 'supertest'
import app from '../src/app.js'
import { describe, it, expect } from 'vitest'

describe('Appointments API', () => {
  it('GET /api/appointments returns 200 and an array', async () => {
    const res = await request(app).get('/api/appointments')
    expect(res.status).toBe(200)
    expect(Array.isArray(res.body)).toBe(true)
  })

  it('POST /api/appointments creates an appointment and returns 201 with an id', async () => {
    const res = await request(app)
      .post('/api/appointments')
      .send({ doctor: 'Dr. Lee', patient: 'Alice', date: '2026-11-15' })
    expect(res.status).toBe(201)
    expect(res.body).toHaveProperty('id')
    expect(res.body.doctor).toBe('Dr. Lee')
    expect(res.body.patient).toBe('Alice')
    expect(res.body.date).toBe('2026-11-15')
  })

  it('POST /api/appointments returns 400 when a field is missing', async () => {
    const res = await request(app)
      .post('/api/appointments')
      .send({ doctor: 'Dr. Lee', patient: 'Alice' })
    expect(res.status).toBe(400)
    expect(res.body).toHaveProperty('error')
  })

  it('POST /api/appointments returns 400 when a field is blank', async () => {
    const res = await request(app)
      .post('/api/appointments')
      .send({ doctor: 'Dr. Lee', patient: '   ', date: '2026-11-15' })
    expect(res.status).toBe(400)
  })

  it('POST /api/appointments returns 400 when the body is empty', async () => {
    const res = await request(app).post('/api/appointments')
    expect(res.status).toBe(400)
  })
})
