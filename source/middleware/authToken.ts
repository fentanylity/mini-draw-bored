import { connect } from "../database"
import { RequestHandler, response } from "express"
import jwt, { TokenExpiredError } from "jsonwebtoken"
import { refresh, sign, verify } from "../services/jwt"
import bcrypt from "bcrypt"

export const createToken: RequestHandler = async (req, res) => {
  const db = await connect()
  const { email, password } = req.body

  const user = await db.get('SELECT id, email, password, role FROM users WHERE email = ? LIMIT 1', [email])

  if (!user) {
    return res.status(401).json({
      'message': 'Email invalido.'
    })
  }
  const match = await bcrypt.compare(password, user.password)

  if (!match) {
    return res.status(401).json({
      'message': 'Credencial invalida.'
    })
  }
  delete user.password
  const token = await sign(user)
  res.json({ token })
}

export const validateToken: RequestHandler = async (req, res) => {
  const token = req.body.token

  if (!token) {
    return res.status(400).json({ menssage: 'Token não fornecido.' })
  }

  try {
    const decoded: any = await verify(token)
    return res.status(200).json({ menssage: '>validate: Token válido', user: decoded })
  } catch (err) {
    return response.status(401).json({ message: "Token inválido ou expirado." });
  }
}

export const verifyToken: RequestHandler = async (req, res, next) => {
  if (!req.headers.authorization) {
    return res.status(401).json({
      message: 'Token não providenciado.'
    })
  }
  const token = req.headers.authorization?.split(' ')[1]

  try {
    const user = await verify(token);
    next()
  } catch (err) {
    if (err instanceof jwt.TokenExpiredError) {
      return res.status(401).json({
        message: 'Token expirado'
      })
    }
    if (err instanceof jwt.NotBeforeError) {
      return res.status(401).json({
        message: 'Token não ativo, ainda.'
      })
    }
    if (err instanceof jwt.JsonWebTokenError) {
      return res.status(401).json({
        message: 'Token Invalido.'
      })
    }
    res.status(401).send('Invalid token [n]')
  }
}

export const refreshToken: RequestHandler = (req, res) => {
  console.warn('>refreshToken: procurar uma maneira mais segura de fazer isso')
  if (!req.headers.authorization) {
    return res
      .status(401)
      .send('No token provided')
  }

  const newToken = refresh(req.headers.authorization?.split(' ')[1])

  res.send({ token: newToken })
}

export default {
  createToken,
  verifyToken,
  refreshToken
}