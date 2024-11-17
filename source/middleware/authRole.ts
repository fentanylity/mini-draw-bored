import { connect } from "../database"
import { RequestHandler } from "express"
import { verify } from "../services/jwt"


export const getRole: RequestHandler = async (req, res) => {
  const token: any = req.headers.authorization?.split(' ')[1]
  const decoded: any = await verify(token); // Decodrsifica o token
  //console.log(decoded)
  res.json({ role: decoded.role });  
}

export const authorizeRole = (requiredRole: number): RequestHandler => {
  return async (req, res, next) => {
    const token: any = req.headers.authorization?.split(' ')[1]
    if (!token) {
      return res.status(401).json({ message: "Token não fornecido." });
    }

    try {
      const decoded: any = await verify(token); // Decodrsifica o token
      //console.log(token)
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

export const redirectPath: RequestHandler = async (req, res) => {
    const userRole: any = res.locals.user

    // Defina os redirecionamentos baseados no cargo
    const roleToPathMap = {
      0: "/pages/admin.html",  // Administrador
      1: "/pages/member.html", // Membro
      2: "/pages/guest.html",  // Convidado
    };

    // Verifica se o cargo do usuário está mapeado
    const redirectPath = roleToPathMap[userRole];
    if (!redirectPath) {
      return res.status(403).json({ error: "Acesso negado" });
    }

    // Retorna o caminho ou redireciona
    res.json({ path: redirectPath });
  }

export default authorizeRole