import express from 'express';
import {
  loginHandler,
  logoutHandler,
  refreshAccessTokenHandler,
  registerHandler,
} from '@/controllers/auth.controller';
import { validate } from '@/middleware/validate';
import { createUserSchema, loginUserSchema } from '@/schema/user.schema';
import { requireUser } from '@/middleware/requireUser';
import { deserializeUser } from '@/middleware/deserializeUser';

const router = express.Router();

// Register user route
router.post('/register', validate(createUserSchema), registerHandler);

// Login user route
router.post('/login', validate(loginUserSchema), loginHandler);

// Refresh access token route
router.get('/refresh', refreshAccessTokenHandler);

router.use(deserializeUser, requireUser);

// Logout User
router.get('/logout', logoutHandler);

export default router;
