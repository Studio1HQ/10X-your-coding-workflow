import { Router, Request, Response } from 'express';

const router = Router();

interface AnalyticsEvent {
    eventName: string;
    timestamp: number | string;
    source: string;
    metadata?: Record<string, any>;
}

interface ValidationError {
    index: number;
    message: string;
}

router.post('/', (req: Request, res: Response) => {
    const events = req.body;

    if (!Array.isArray(events)) {
        return res.status(400).json({
            error: 'Invalid format. Expected an array of events.'
        });
    }

    if (events.length === 0) {
        return res.status(400).json({
            error: 'Batch cannot be empty.'
        });
    }

    const validationErrors: ValidationError[] = [];

    events.forEach((event: any, index: number) => {
        if (typeof event !== 'object' || event === null) {
            validationErrors.push({
                index,
                message: 'Event must be an object'
            });
            return;
        }

        const missingFields: string[] = [];
        if (!event.eventName) missingFields.push('eventName');
        if (!event.timestamp) missingFields.push('timestamp');
        if (!event.source) missingFields.push('source');

        if (missingFields.length > 0) {
            validationErrors.push({
                index,
                message: `Missing required fields: ${missingFields.join(', ')}`
            });
        }
    });

    if (validationErrors.length > 0) {
        return res.status(400).json({
            message: 'Validation failed',
            errors: validationErrors
        });
    }

    // Process valid events (stub)
    // console.log(`Ingesting ${events.length} events`);

    return res.status(200).json({
        message: 'Events ingested successfully',
        count: events.length
    });
});

export default router;
