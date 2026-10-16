import { describe, it, expect } from 'vitest';
import request from 'supertest';
import { app } from '../app';

describe('FoodieHub Backend API Test Suite', () => {
  it('GET /api/health should return ok status and service information', async () => {
    const res = await request(app).get('/api/health');
    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty('status', 'ok');
    expect(res.body).toHaveProperty('service', 'FoodieHub REST API');
    expect(res.body).toHaveProperty('uptime');
    expect(res.body).toHaveProperty('timestamp');
  });

  it('GET / should return online status and health pointer', async () => {
    const res = await request(app).get('/');
    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty('name', 'FoodieHub REST API');
    expect(res.body).toHaveProperty('status', 'online');
  });

  it('GET /api/non-existent-route should return 404 with standardized error JSON', async () => {
    const res = await request(app).get('/api/non-existent-route');
    expect(res.status).toBe(404);
    expect(res.body).toHaveProperty('success', false);
    expect(res.body.message).toContain('Route not found');
  });

  it('POST /api/auth/register with invalid email and short password should fail validation with 422', async () => {
    const res = await request(app)
      .post('/api/auth/register')
      .send({
        name: 'A',
        email: 'invalid-email',
        password: '123',
      });
    expect(res.status).toBe(422);
    expect(res.body).toHaveProperty('success', false);
    expect(res.body).toHaveProperty('errors');
    expect(Array.isArray(res.body.errors)).toBe(true);
  });

  it('POST /api/orders without authentication should return 401 Unauthorized', async () => {
    const res = await request(app)
      .post('/api/orders')
      .send({
        customerName: 'Test User',
        customerPhone: '9876543210',
        deliveryAddress: '123 Food Street',
        city: 'Mumbai',
        state: 'Maharashtra',
        postalCode: '400001',
        items: [
          {
            foodId: '00000000-0000-0000-0000-000000000000',
            quantity: 2,
          },
        ],
      });
    expect(res.status).toBe(401);
    expect(res.body).toHaveProperty('success', false);
    expect(res.body.message).toContain('Authentication required');
  });

  it('GET /api/admin/dashboard without auth should return 401', async () => {
    const res = await request(app).get('/api/admin/dashboard');
    expect(res.status).toBe(401);
    expect(res.body).toHaveProperty('success', false);
  });
});
