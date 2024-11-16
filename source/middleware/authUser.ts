import { connect } from '../database'
import { RequestHandler } from "express"
import bcrypt from 'bcrypt'

export const getManyUsers: RequestHandler = async (request, resolve) => {
  const db = await connect()
  const users = await db.all('SELECT id, name, email, role FROM users')
  
  resolve.json(users)
}

export const createUser: RequestHandler = async (request, resolve) => {
  const db = await connect()
  const { name, email, password, role } = request.body
  try {
    const hashed = await bcrypt.hash(password, 10)
    const result = await db.run('INSERT INTO users (name, email, password, role) VALUES (?, ?, ?, ?)', [name, email, hashed, role])
    const user = await db.get('SELECT id, name, email FROM users WHERE id = ?', [result.lastID])
    
    resolve.json(user)
  } catch(error) {
    console.error("Erro ao criar usuário:", error);
    resolve.status(500).json({ message: "Erro ao criar usuário." });
  }
}

export const updateUser: RequestHandler = async (request, resolve) => {
  const db = await connect()
  const { name, email, role } = request.body
  const { id } = request.params
  await db.run('UPDATE users SET name = ?, email = ? role = ? WHERE id = ?', [name, email, role, id])
  const user = await db.get('SELECT * FROM users WHERE id = ?', [id])

  resolve.json(user)
}

export const deleteUser: RequestHandler = async (request, resolve) => {
  const db = await connect()
  const { id } = request.params
  await db.run('DELETE FROM users WHERE id = ?', [id])

  resolve.json({ message: 'User deleted' })
}

export default {
  getManyUsers,
  createUser,
  updateUser,
  deleteUser
}