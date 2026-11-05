import request from 'supertest'
import app from '../src/app.js'
import { describe, it, expect } from 'vitest'

describe('Appointments API', () => {

  // GET: récupérer tous les rendez-vous
  it('GET /api/appointments returns 200 and an array', async () => {
    const res = await request(app).get('/api/appointments')

    expect(res.status).toBe(200)
    expect(Array.isArray(res.body)).toBe(true)
  })

  // GET: récupérer un rendez-vous par ID
  it('GET /api/appointments/:id returns 200 when appointment exists', async () => {
    const res = await request(app).get('/api/appointments/1')

    expect(res.status).toBe(200)
    expect(res.body.id).toBe(1)
    expect(res.body.doctor).toBe('Dr. Sarah Lee')
  })

  it('GET /api/appointments/:id returns 404 when appointment does not exist', async () => {
    const res = await request(app).get('/api/appointments/999')

    expect(res.status).toBe(404)
    expect(res.body).toHaveProperty('error')
  })

  // POST: créer un rendez-vous
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

  // PUT: modifier un rendez-vous
  it('PUT /api/appointments/:id updates an existing appointment', async () => {
    const res = await request(app)
      .put('/api/appointments/1')
      .send({
        doctor: 'Dr. Updated',
        patient: 'Alice Updated',
        date: '2026-12-01'
      })

    expect(res.status).toBe(200)
    expect(res.body.id).toBe(1)
    expect(res.body.doctor).toBe('Dr. Updated')
    expect(res.body.patient).toBe('Alice Updated')
    expect(res.body.date).toBe('2026-12-01')
  })

  it('PUT /api/appointments/:id returns 404 when appointment does not exist', async () => {
    const res = await request(app)
      .put('/api/appointments/999')
      .send({
        doctor: 'Dr. Lee',
        patient: 'Alice',
        date: '2026-11-15'
      })

    expect(res.status).toBe(404)
    expect(res.body).toHaveProperty('error')
  })

  it('PUT /api/appointments/:id returns 400 when a field is missing', async () => {
    const res = await request(app)
      .put('/api/appointments/1')
      .send({ doctor: 'Dr. Lee', patient: 'Alice' })

    expect(res.status).toBe(400)
  })

  // DELETE: supprimer un rendez-vous
  it('DELETE /api/appointments/:id deletes an existing appointment', async () => {
    const res = await request(app).delete('/api/appointments/2')

    expect(res.status).toBe(204)
    expect(res.text).toBe('')
  })

  it('DELETE /api/appointments/:id returns 404 when appointment does not exist', async () => {
    const res = await request(app).delete('/api/appointments/999')

    expect(res.status).toBe(404)
    expect(res.body).toHaveProperty('error')
  })
})