
import request from 'supertest'
import app from '../src/app.js'
import { describe, it, expect } from 'vitest'

describe('Patients API', () => {
  // Test 1: GET all patients
  it('GET /api/patients should return an array', async () => {
    const res = await request(app).get('/api/patients')

    expect(res.status).toBe(200)
    expect(Array.isArray(res.body)).toBe(true)
  })

  // Test 2: GET one patient
  it('GET /api/patients/:id should return one patient', async () => {
    const res = await request(app).get('/api/patients/2')

    expect(res.status).toBe(200)
    expect(res.body.name).toBe('John')
    expect(res.body.age).toBe(45)
  })

  // Test 3: POST a new patient
  it('POST /api/patients should add a new patient', async () => {
    const res = await request(app)
      .post('/api/patients')
      .send({ name: 'TestPatient', age: 25 })

    expect(res.status).toBe(201)
    expect(res.body).toHaveProperty('id')
    expect(res.body.name).toBe('TestPatient')
    expect(res.body.age).toBe(25)
  })

  // Test 4: POST with missing fields
  it('POST /api/patients should return 400 if fields are missing', async () => {
    const res = await request(app)
      .post('/api/patients')
      .send({ name: 'TestPatient' })

    expect(res.status).toBe(400)
    expect(res.body).toHaveProperty('error', 'Missing or invalid fields')
  })

  // Test 5: PUT update a patient
  it('PUT /api/patients/:id should update a patient', async () => {
    const res = await request(app)
      .put('/api/patients/2')
      .send({ age: 46 })

    expect(res.status).toBe(200)
    expect(res.body.age).toBe(46)
  })

  // Test 6: DELETE a patient
  it('DELETE /api/patients/:id should delete a patient', async () => {
    const created = await request(app)
      .post('/api/patients')
      .send({ name: 'DeletePatient', age: 30 })

    const id = created.body.id

    const res = await request(app).delete(`/api/patients/${id}`)

    expect(res.status).toBe(204)
  })
})
