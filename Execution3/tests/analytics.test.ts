
import express from 'express';
import request from 'supertest';
import analyticsRouter from '../src/api/analytics';

const app = express();
app.use(express.json());
app.use('/analytics', analyticsRouter);

describe('Analytics API', () => {
    describe('POST /analytics', () => {
        it('should ingest a batch of valid events', async () => {
            const events = [
                {
                    eventName: 'page_view',
                    timestamp: Date.now(),
                    source: 'web',
                    metadata: { url: '/home' }
                },
                {
                    eventName: 'click',
                    timestamp: Date.now(),
                    source: 'web',
                    metadata: { elementId: 'login-btn' }
                }
            ];

            const response = await request(app)
                .post('/analytics')
                .send(events);

            expect(response.status).toBe(200);
            expect(response.body).toEqual({
                message: 'Events ingested successfully',
                count: 2
            });
        });

        it('should return 400 for non-array input', async () => {
            const response = await request(app)
                .post('/analytics')
                .send({ eventName: 'single_event' }); // Not an array

            expect(response.status).toBe(400);
            expect(response.body).toEqual({
                error: 'Invalid format. Expected an array of events.'
            });
        });

        it('should return 400 for empty batch', async () => {
            const response = await request(app)
                .post('/analytics')
                .send([]);

            expect(response.status).toBe(400);
            expect(response.body).toEqual({
                error: 'Batch cannot be empty.'
            });
        });

        it('should validate individual events and return detailed errors', async () => {
            const events = [
                {
                    // Missing eventName
                    timestamp: Date.now(),
                    source: 'mobile'
                },
                {
                    eventName: 'purchase',
                    timestamp: Date.now(),
                    // Missing source
                },
                'invalid-string-event' // Invalid type
            ];

            const response = await request(app)
                .post('/analytics')
                .send(events);

            expect(response.status).toBe(400);
            expect(response.body.message).toBe('Validation failed');
            expect(response.body.errors).toHaveLength(3);

            expect(response.body.errors).toEqual(expect.arrayContaining([
                expect.objectContaining({
                    index: 0,
                    message: expect.stringContaining('Missing required fields:')
                }),
                expect.objectContaining({
                    index: 1,
                    message: expect.stringContaining('Missing required fields:')
                }),
                expect.objectContaining({
                    index: 2,
                    message: 'Event must be an object'
                })
            ]));
        });

        // This test verifies persistence. 
        // NOTE: Since the current implementation is a stub, we can only verify the API contract 
        // unless we mock a DB module that isn't connected yet.
        // The user requirement says "Mock database interactions explicitly", but there is no DB code.
        // We will assume that if explicit DB calls existed, we would mock them here.
        // For now, checking the success response is the closest we can get to verification
        // without modifying the API code to actually call a DB.
        it('should (conceptually) persist events', async () => {
            const events = [
                {
                    eventName: 'logout',
                    timestamp: Date.now(),
                    source: 'web'
                }
            ];

            // In a real implementation, we would spy on a DB method here.
            // jest.spyOn(db, 'insertEvents').mockResolvedValue(...);

            const response = await request(app)
                .post('/analytics')
                .send(events);

            expect(response.status).toBe(200);
            // expect(db.insertEvents).toHaveBeenCalledWith(events);
        });
    });
});
