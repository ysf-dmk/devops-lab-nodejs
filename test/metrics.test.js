import request from 'supertest'
import app from '../src/app.js'
import { describe, it, expect } from 'vitest'

const create = async (body = { name: 'temp', value: 1 }) => {
  const res = await request(app).post('/api/metrics').send(body)
  return res.body
}

describe('Metrics API', () => {
  it('GET /api/metrics returns 200 and an array', async () => {
    const res = await request(app).get('/api/metrics')
    expect(res.status).toBe(200)
    expect(Array.isArray(res.body)).toBe(true)
  })

  it('GET /api/metrics/:id returns the metric', async () => {
    const created = await create({ name: 'visits', value: 7 })
    const res = await request(app).get(`/api/metrics/${created.id}`)
    expect(res.status).toBe(200)
    expect(res.body).toEqual({ id: created.id, name: 'visits', value: 7 })
  })

  it('GET /api/metrics/:id returns 404 for an unknown id', async () => {
    const res = await request(app).get('/api/metrics/99999')
    expect(res.status).toBe(404)
    expect(res.body).toHaveProperty('error')
  })

  it('GET /api/metrics/:id returns 404 for a non-numeric id', async () => {
    const res = await request(app).get('/api/metrics/abc')
    expect(res.status).toBe(404)
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

  it('POST /api/metrics returns 400 when value is not a number', async () => {
    const res = await request(app).post('/api/metrics').send({ name: 'bad', value: '12' })
    expect(res.status).toBe(400)
  })

  it('PUT /api/metrics/:id updates both fields', async () => {
    const created = await create()
    const res = await request(app)
      .put(`/api/metrics/${created.id}`)
      .send({ name: 'renamed', value: 99 })
    expect(res.status).toBe(200)
    expect(res.body).toEqual({ id: created.id, name: 'renamed', value: 99 })
  })

  it('PUT /api/metrics/:id updates only the fields sent', async () => {
    const created = await create({ name: 'partial', value: 5 })
    const res = await request(app).put(`/api/metrics/${created.id}`).send({ value: 0 })
    expect(res.status).toBe(200)
    expect(res.body).toEqual({ id: created.id, name: 'partial', value: 0 })
  })

  it('PUT /api/metrics/:id returns 400 for invalid fields', async () => {
    const created = await create()
    const badName = await request(app).put(`/api/metrics/${created.id}`).send({ name: '  ' })
    const badValue = await request(app).put(`/api/metrics/${created.id}`).send({ value: 'x' })
    expect(badName.status).toBe(400)
    expect(badValue.status).toBe(400)
  })

  it('PUT /api/metrics/:id returns 404 for an unknown id', async () => {
    const res = await request(app).put('/api/metrics/99999').send({ value: 1 })
    expect(res.status).toBe(404)
  })

  it('DELETE /api/metrics/:id returns 204 and removes the metric', async () => {
    const created = await create()
    const res = await request(app).delete(`/api/metrics/${created.id}`)
    expect(res.status).toBe(204)
    const after = await request(app).get(`/api/metrics/${created.id}`)
    expect(after.status).toBe(404)
  })

  it('DELETE /api/metrics/:id returns 404 for an unknown id', async () => {
    const res = await request(app).delete('/api/metrics/99999')
    expect(res.status).toBe(404)
    expect(res.body).toHaveProperty('error')
  })

  it('ids are not reused after a delete', async () => {
    const first = await create()
    await request(app).delete(`/api/metrics/${first.id}`)
    const second = await create()
    expect(second.id).not.toBe(first.id)
  })
})
