import request from 'supertest'
import app from '../src/app.js'
import { describe, it, expect } from 'vitest'

describe('Metrics API', () => {
  it('GET /api/metrics returns 200 and an array', async () => {
    const res = await request(app).get('/api/metrics')
    expect(res.status).toBe(200)
    expect(Array.isArray(res.body)).toBe(true)
  })

  it('POST /api/metrics creates a metric and returns 201 with an id', async () => {
    const res = await request(app)
      .post('/api/metrics')
      .send({ name: 'appointments', value: 25 })
    expect(res.status).toBe(201)
    expect(res.body).toHaveProperty('id')
    expect(res.body.name).toBe('appointments')
    expect(res.body.value).toBe(25)
  })

  it('POST /api/metrics accepts a value of 0', async () => {
    const res = await request(app)
      .post('/api/metrics')
      .send({ name: 'errors', value: 0 })
    expect(res.status).toBe(201)
  })

  it('POST /api/metrics returns 400 when fields are missing', async () => {
    const res = await request(app).post('/api/metrics').send({ name: 'incomplete' })
    expect(res.status).toBe(400)
    expect(res.body).toHaveProperty('error')
  })

  it('POST /api/metrics returns 400 when the body is empty', async () => {
    const res = await request(app).post('/api/metrics')
    expect(res.status).toBe(400)
  })
})
