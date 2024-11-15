import { open, Database } from 'sqlite'
import sqlite3 from 'sqlite3'
import bcrypt from 'bcrypt'
import data from '../auth/innitials-users.json'

let instance: Database | null = null

export async function connect() {
  if (instance) return instance

  const db = await open({
     filename: 'database.sqlite',
     driver: sqlite3.Database
   })
  
  await db.exec(`
    CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT,
      email TEXT NOT NULL UNIQUE,
      password TEXT,
      role INTEGER
    )
  `)

  // ignorar
  const password = await bcrypt.hash(data.password, 10)

  await db.exec(`
    INSERT OR REPLACE INTO users (id, name, email, password) 
    VALUES (1, '${data.name}', '${data.email}', '${password}, ${data.role}')
  `)

  instance = db
  return db
}