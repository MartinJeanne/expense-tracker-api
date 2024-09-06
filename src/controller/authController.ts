import express from 'express';
import bodyParser from 'body-parser';
import { login, register } from '../service/authService';

const authController = express.Router();
authController.use(bodyParser.json());

authController.post('/register', async (req, res, next) => {
    register(req)
        .then(result => res.send(result))
        .catch(next);
});

authController.post('/login', async (req, res, next) => {
    await login(req)
        .then(result => res.send(result))
        .catch(next);
});

export default authController;
