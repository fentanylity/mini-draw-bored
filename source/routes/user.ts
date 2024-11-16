import express, { Router } from "express";
import * as user from "../middleware/authUser";
import authorizeRole from "../middleware/authRole";

const router = Router();

// Rotas com verificação de role
router.get("/", user.getManyUsers);
router.post("/", authorizeRole(1), user.createUser);
router.put("/:id", authorizeRole(1), user.updateUser);
router.delete("/:id", authorizeRole(1), user.deleteUser);

export default router;
