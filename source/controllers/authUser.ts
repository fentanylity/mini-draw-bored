import { connect } from '../database'
import { RequestHandler } from "express"

export const getManyUsers: RequestHandler = async (req, res) => {
  const db = await connect()
  const users = await db.all('SELECT id, name, email, role FROM users')
  
  res.json(users)
}

export const createUser: RequestHandler = async (req, res) => {
  const db = await connect()
  const { name, email, password, role } = req.body
  const result = await db.run('INSERT INTO users (name, email, password) VALUES (?, ?, ?, ?)', [name, email, password, role])
  const user = await db.get('SELECT id, name, email FROM users WHERE id = ?', [result.lastID])
  
  res.json(user)
}

export const updateUser: RequestHandler = async (req, res) => {
  const db = await connect()
  const { name, email, role} = req.body
  const { id } = req.params
  await db.run('UPDATE users SET name = ?, email = ? role = ? WHERE id = ?', [name, email, role, id])
  const user = await db.get('SELECT * FROM users WHERE id = ?', [id])
  
  res.json(user)
}

export const deleteUser: RequestHandler = async (req, res) => {
  const db = await connect()
  const { id } = req.params
  await db.run('DELETE FROM users WHERE id = ?', [id])
  
  res.json({ message: 'User deleted' })
}

export default { 
  getManyUsers, 
  createUser, 
  updateUser, 
  deleteUser 
}