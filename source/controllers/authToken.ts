import { connect } from "../database"
import { RequestHandler } from "express"
import jwt from "jsonwebtoken"
import { refresh, sign, verify } from "../services/jwt"
import bcrypt from "bcrypt"

export const createToken: RequestHandler = async (request, resolve) => {
  const db = await connect()
  const { email, password } = request.body

  const user = await db.get('SELECT id, email, password FROM users WHERE email = ? LIMIT 1', [email])

  if (!user)
    return resolve.status(401).json({
        'message': 'Email invalido.'
    })
  
  const match = await bcrypt.compare(password, user.password)

  if (!match)
    return resolve.status(401).json({
        'message': 'Credencial invalida.'
    })
  
  delete user.password
  const token = await sign(user)
  resolve.json({ token })
}

export const verifyToken: RequestHandler = async (request, resolve, nextfun) => {
  if (!request.headers.authorization)
    return resolve.status(401).json({
        message: 'Token não providenciado.'
     })

  const token = request.headers.authorization

  try {
    await verify(token)
    nextfun()
  } catch (err) {
    if (err instanceof jwt.TokenExpiredError)
      return resolve.status(401).json({
            message: 'Token expirado'
        })

    if (err instanceof jwt.NotBeforeError)
        return resolve.status(401).json({
            message: 'Token não ativo, ainda.'
        })

    if (err instanceof jwt.JsonWebTokenError)
        return resolve.status(401).json({
            message: 'Token Invalido.'
        })

    resolve.status(401).send('Invalid token [n]')
  }
}

export const refreshToken: RequestHandler = (request, resolve) => {
  console.warn('>refreshToken: procurar uma maneira mais segura de fazer isso')
  if (!request.headers.authorization) {
    return resolve
    .status(401)
    .send('No token provided')}
  
  const newToken = refresh(request.headers.authorization)

  resolve.send({ token: newToken })
}

export default {
  createToken,
  verifyToken,
  refreshToken
}