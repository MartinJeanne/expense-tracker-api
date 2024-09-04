import express from 'express';
import bodyParser from 'body-parser';
import { deleteExpenses, getExpenses, postExpenses, putExpenses } from './endpoints/expenses';

const router = express.Router();
router.use(bodyParser.json());

router.get('/', async (req, res) => {
    await getExpenses(req, res);
});

router.post('/', async (req, res) => {
    await postExpenses(req, res);
});

router.put('/:id', async (req, res) => {
    await putExpenses(req, res);
});

router.delete('/:id', async (req, res) => {
    await deleteExpenses(req, res);
});

export default router;
