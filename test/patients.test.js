import request from 'supertest'
import app from '../src/app.js'
import { describe, it, expect } from 'vitest'

describe('Patients API', () => {
  it('GET /api/patients should return an array', async () => {
    const res = await request(app).get('/api/patients')

    expect(res.status).toBe(200)
    expect(Array.isArray(res.body)).toBe(true)
  })

  // Test 2: POST a new patient
  it('POST /api/patients should add a new patient', async () => {
    const res = await request(app)
      .post('/api/patients')
      .send({ name: 'TestPatient', age: 25 })

    expect(res.status).toBe(201)
    expect(res.body).toHaveProperty('id')
    expect(res.body.name).toBe('TestPatient')
    expect(res.body.age).toBe(25)
  })

  // Test 3: POST with missing fields
  it('POST /api/patients should return 400 if fields are missing', async () => {
    const res = await request(app)
      .post('/api/patients')
      .send({ name: 'TestPatient' })

    expect(res.status).toBe(400)
    expect(res.body).toHaveProperty('error', 'Missing fields')
  })
})
