import express, { Request, Response } from 'express';

const app = express();
const port = 3000;

app.get('/health', (req: Request, res: Response) => {
    res.json({ status: 'ok' });
});

export { app };

if (require.main === module) {
    app.listen(port, () => {
        console.log(`Server running at http://localhost:${port}`);
    });
}
