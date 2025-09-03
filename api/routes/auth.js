import express from 'express';
import {register, login, registerAdmin, sendEmail, resetPassword} from '../controllers/auth.controller.js';

const router = express.Router();

//register
router.post('/register', register)

//login
router.post('/login', login);

//register as Admin
router.post('/register-admin', registerAdmin)

//reset password route by using the email
router.post('/send-email', sendEmail)

//reset password
router.post('/reset-password', resetPassword)


export default router;