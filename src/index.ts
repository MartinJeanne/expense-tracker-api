import express from 'express';
import routes from './routes';

const app = express();
const port = 3000;

app.use('/api/expenses', routes);

app.listen(port, () => {
    console.log(`API listening on port ${port}`);
});
