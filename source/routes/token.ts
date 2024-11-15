import { Router } from "express";
import * as token from "../controllers/authToken";

const router = Router();

router.get('/', token.createToken);
router.get('/verifiy', token.verifyToken, (req, res) => {res.send('Token é valido.')});
router.get('/refresh', token.refreshToken);

export default router;