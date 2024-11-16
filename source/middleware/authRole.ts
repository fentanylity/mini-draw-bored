import { connect } from "../database"
import { RequestHandler } from "express"
import jwt from "jsonwebtoken"
import { verify } from "../services/jwt"


export const authorizeRole = (requiredRole: number): RequestHandler => {
  return async (req, res, next) => {
    const token: any = req.headers.authorization?.split(' ')[1]
    if (!token) {
      return res.status(401).json({ message: "Token não fornecido." });
    }

    try {
      const decoded: any = await verify(token); // Decodrsifica o token
      console.log(token)
      const db = await connect();
      const user = await db.get("SELECT role FROM users WHERE id = ?", [decoded.id]);

      if (!user || user.role < requiredRole) {
        return res.status(403).json({ message: "Acesso negado." });
      }

      next(); // Usuário autorizado, prossegue
    } catch (err) {
      res.status(401).json({ message: "Token inválido ou expirado." });
    }
  };
};

export default authorizeRole