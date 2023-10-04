import request from 'supertest';
import { expect, describe, it } from 'vitest';
import app from '../../app.js';

describe('Site controller', () => {
  it('should show welcome message', async () => {
    const response = await request(app).get('/');
    expect(response.status).toBe(200);
    expect(response.body.message).toBe('Welcome to the API');
  })

})