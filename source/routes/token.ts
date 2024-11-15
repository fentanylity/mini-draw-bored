import { Router } from "express";
import * as token from "../controllers/authToken";

const router = Router();

router.post('/', token.createToken);
router.post('/verifiy', token.verifyToken, (req, res) => {res.send('Token é valido.')});
router.post('/refresh', token.refreshToken);

export default router;