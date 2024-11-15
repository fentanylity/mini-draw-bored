import { Router } from "express";
import * as user from "../controllers/authUser";

const router = Router();

router.get("/", user.getManyUsers);
router.post("/", user.createUser);
router.put("/:id", user.updateUser);
router.delete("/:id", user.deleteUser);

export default router;