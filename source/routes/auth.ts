import express from "express";
import { getRole } from '../middleware/authRole'

const router = express.Router();

router.get("/user", getRole);

export default router;
