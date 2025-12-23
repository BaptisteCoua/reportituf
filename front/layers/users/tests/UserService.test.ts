import { describe, it, expect, vi, beforeEach } from 'vitest'
import { UserService } from '../services/UserService'

const mockUser = {
  id: 1,
  email: 'john@example.com',
  password: 'password123',
  name: 'John Doe',
  role: 'customer' as const,
  avatar: 'https://i.pravatar.cc/150',
  creationAt: '2024-01-01T00:00:00.000Z',
  updatedAt: '2024-01-01T00:00:00.000Z'
}

describe('UserService', () => {
  beforeEach(() => {
    vi.resetAllMocks()
  })

  describe('getAll', () => {
    it('should fetch all users', async () => {
      const mockUsers = [mockUser]
      global.fetch = vi.fn().mockResolvedValue({
        ok: true,
        json: () => Promise.resolve(mockUsers)
      })

      const result = await UserService.getAll()

      expect(fetch).toHaveBeenCalledWith('https://api.escuelajs.co/api/v1/users')
      expect(result).toEqual(mockUsers)
    })

    it('should throw error on failed request', async () => {
      global.fetch = vi.fn().mockResolvedValue({ ok: false })

      await expect(UserService.getAll()).rejects.toThrow('Failed to fetch users')
    })
  })

  describe('getById', () => {
    it('should fetch user by id', async () => {
      global.fetch = vi.fn().mockResolvedValue({
        ok: true,
        json: () => Promise.resolve(mockUser)
      })

      const result = await UserService.getById(1)

      expect(fetch).toHaveBeenCalledWith('https://api.escuelajs.co/api/v1/users/1')
      expect(result).toEqual(mockUser)
    })
  })

  describe('create', () => {
    it('should create a new user', async () => {
      const payload = {
        name: 'Jane Doe',
        email: 'jane@example.com',
        password: 'password123',
        avatar: 'https://i.pravatar.cc/150'
      }

      global.fetch = vi.fn().mockResolvedValue({
        ok: true,
        json: () => Promise.resolve({ ...mockUser, ...payload, id: 2 })
      })

      const result = await UserService.create(payload)

      expect(fetch).toHaveBeenCalledWith(
        'https://api.escuelajs.co/api/v1/users',
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload)
        }
      )
      expect(result.name).toBe('Jane Doe')
    })
  })

  describe('update', () => {
    it('should update an existing user', async () => {
      const payload = { id: 1, name: 'John Updated' }

      global.fetch = vi.fn().mockResolvedValue({
        ok: true,
        json: () => Promise.resolve({ ...mockUser, name: 'John Updated' })
      })

      const result = await UserService.update(payload)

      expect(fetch).toHaveBeenCalledWith(
        'https://api.escuelajs.co/api/v1/users/1',
        {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ name: 'John Updated' })
        }
      )
      expect(result.name).toBe('John Updated')
    })
  })

  describe('delete', () => {
    it('should delete a user', async () => {
      global.fetch = vi.fn().mockResolvedValue({
        ok: true,
        json: () => Promise.resolve(true)
      })

      const result = await UserService.delete(1)

      expect(fetch).toHaveBeenCalledWith(
        'https://api.escuelajs.co/api/v1/users/1',
        { method: 'DELETE' }
      )
      expect(result).toBe(true)
    })
  })

  describe('checkEmail', () => {
    it('should check email availability', async () => {
      global.fetch = vi.fn().mockResolvedValue({
        ok: true,
        json: () => Promise.resolve({ isAvailable: true })
      })

      const result = await UserService.checkEmail('test@example.com')

      expect(fetch).toHaveBeenCalledWith(
        'https://api.escuelajs.co/api/v1/users/is-available',
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email: 'test@example.com' })
        }
      )
      expect(result.isAvailable).toBe(true)
    })
  })
})
