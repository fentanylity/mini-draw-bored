import { connect } from "../database"
import { RequestHandler, response } from "express"
import jwt, { TokenExpiredError } from "jsonwebtoken"
import { refresh, sign, verify } from "../services/jwt"
import bcrypt from "bcrypt"

export const createToken: RequestHandler = async (request, resolve) => {
  const db = await connect()
  const { email, password } = request.body

  const user = await db.get('SELECT id, email, password FROM users WHERE email = ? LIMIT 1', [email])

  if (!user) {
    return resolve.status(401).json({
      'message': 'Email invalido.'
    })
  }
  const match = await bcrypt.compare(password, user.password)

  if (!match) {
    return resolve.status(401).json({
      'message': 'Credencial invalida.'
    })
  }
  delete user.password
  const token = await sign(user)
  resolve.json({ token })
}

export const validateToken: RequestHandler = async (request, resolve) => {
  const token = request.body.token

  if(!token) {
    return resolve.status(400).json({menssage: 'Token não fornecido.'})
  }

  try {
    const decoded : any = await verify(token)
    return resolve.status(200).json({ menssage: '>validate: Token válido', user:decoded })
  } catch(err) {
    return response.status(401).json({ message: "Token inválido ou expirado." });
  }
}

export const verifyToken: RequestHandler = async (request, resolve, next) => {
  if (!request.headers.authorization) {
    return resolve.status(401).json({
      message: 'Token não providenciado.'
    })
  }
  const token = request.headers.authorization?.split(' ')[1]

  try {
    await verify(token)
    next()
  } catch (err) {
    if (err instanceof jwt.TokenExpiredError) {
      return resolve.status(401).json({
        message: 'Token expirado'
      })
    }
    if (err instanceof jwt.NotBeforeError) {
      return resolve.status(401).json({
        message: 'Token não ativo, ainda.'
      })
    }
    if (err instanceof jwt.JsonWebTokenError) {
      return resolve.status(401).json({
        message: 'Token Invalido.'
      })
    }
    resolve.status(401).send('Invalid token [n]')
  }
}

export const refreshToken: RequestHandler = (request, resolve) => {
  console.warn('>refreshToken: procurar uma maneira mais segura de fazer isso')
  if (!request.headers.authorization) {
    return resolve
      .status(401)
      .send('No token provided')
  }

  const newToken = refresh(request.headers.authorization?.split(' ')[1])

  resolve.send({ token: newToken })
}

export default {
  createToken,
  verifyToken,
  refreshToken
}