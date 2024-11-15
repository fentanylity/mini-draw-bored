import express, { Router } from "express";
import userRouter from "./user";
import tokenRouter from "./token";

const router = Router();
router.use(express.json())
router.use(express.static(__dirname + '/../../public/pages'))
router.use('/users', userRouter)
router.use('/token', tokenRouter)

export default router