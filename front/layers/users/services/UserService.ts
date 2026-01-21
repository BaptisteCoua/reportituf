import type { User, CreateUserPayload, UpdateUserPayload } from '../types'

const BASE_URL = 'https://api.escuelajs.co/api/v1'

export const UserService = {
  async getAll(): Promise<User[]> {
    const response = await fetch(`${BASE_URL}/users`)
    if (!response.ok) throw new Error('Failed to fetch users')
    return response.json()
  },

  async getById(id: number): Promise<User> {
    const response = await fetch(`${BASE_URL}/users/${id}`)
    if (!response.ok) throw new Error('Failed to fetch user')
    return response.json()
  },

  async create(payload: CreateUserPayload): Promise<User> {
    const response = await fetch(`${BASE_URL}/users`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    })
    if (!response.ok) throw new Error('Failed to create user')
    return response.json()
  },

  async update(payload: UpdateUserPayload): Promise<User> {
    const { id, ...data } = payload
    const response = await fetch(`${BASE_URL}/users/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    })
    if (!response.ok) throw new Error('Failed to update user')
    return response.json()
  },

  async delete(id: number): Promise<boolean> {
    const response = await fetch(`${BASE_URL}/users/${id}`, {
      method: 'DELETE'
    })
    if (!response.ok) throw new Error('Failed to delete user')
    return response.json()
  },

  async checkEmail(email: string): Promise<{ isAvailable: boolean }> {
    const response = await fetch(`${BASE_URL}/users/is-available`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email })
    })
    if (!response.ok) throw new Error('Failed to check email')
    return response.json()
  }
}
