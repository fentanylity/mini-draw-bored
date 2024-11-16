import { Router } from "express";
import * as token from "../middleware/authToken";

const router = Router();

router.post('/', token.createToken);
router.post('/verify', token.verifyToken, (req, res) => {res.send('Token é valido.')});
router.post('/refresh', token.refreshToken);
export default router;