import express from 'express';
import bodyParser from 'body-parser';
import { login, register } from '../service/authService';

const authController = express.Router();
authController.use(bodyParser.json());

authController.post('/register', async (req, res) => {
    await register(req, res);
});

authController.post('/login', async (req, res) => {
    await login(req, res);
});

export default authController;
