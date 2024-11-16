import express from "express";
import { authorizeRole } from '../middleware/authRole'

const router = express.Router();

router.get("/registrar.html", authorizeRole(1), (req, res) => {
  res.sendFile("registrar.html", { root: "../public/pages/" });
});

export default router;
