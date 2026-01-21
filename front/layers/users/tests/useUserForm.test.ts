import { describe, it, expect, vi, beforeEach } from 'vitest'
import './setup'
import { useUserForm } from '../composables/useUserForm'
import { UserService } from '../services/UserService'

vi.mock('../services/UserService', () => ({
  UserService: {
    create: vi.fn(),
    update: vi.fn()
  }
}))

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

describe('useUserForm', () => {
  beforeEach(() => {
    vi.resetAllMocks()
  })

  describe('initial state', () => {
    it('should have empty form values', () => {
      const { form } = useUserForm()

      expect(form.value.name).toBe('')
      expect(form.value.email).toBe('')
      expect(form.value.password).toBe('')
      expect(form.value.role).toBe('customer')
    })

    it('should not be in editing mode', () => {
      const { isEditing } = useUserForm()

      expect(isEditing.value).toBe(false)
    })

    it('should have dialog closed', () => {
      const { dialog } = useUserForm()

      expect(dialog.value).toBe(false)
    })
  })

  describe('validation', () => {
    it('should fail validation with empty name', () => {
      const { form, validate, errors } = useUserForm()
      form.value.email = 'test@example.com'
      form.value.password = 'password123'

      const result = validate()

      expect(result).toBe(false)
      expect(errors.value.name).toBe('Name is required')
    })

    it('should fail validation with invalid email', () => {
      const { form, validate, errors } = useUserForm()
      form.value.name = 'John'
      form.value.email = 'invalid-email'
      form.value.password = 'password123'

      const result = validate()

      expect(result).toBe(false)
      expect(errors.value.email).toBe('Invalid email format')
    })

    it('should fail validation with short password', () => {
      const { form, validate, errors } = useUserForm()
      form.value.name = 'John'
      form.value.email = 'test@example.com'
      form.value.password = '123'

      const result = validate()

      expect(result).toBe(false)
      expect(errors.value.password).toBe('Password must be at least 6 characters')
    })

    it('should pass validation with valid data', () => {
      const { form, validate, errors } = useUserForm()
      form.value.name = 'John'
      form.value.email = 'test@example.com'
      form.value.password = 'password123'
      form.value.avatar = 'https://example.com/avatar.jpg'

      const result = validate()

      expect(result).toBe(true)
      expect(Object.keys(errors.value)).toHaveLength(0)
    })
  })

  describe('openCreate', () => {
    it('should reset form and open dialog', () => {
      const { form, dialog, openCreate } = useUserForm()
      form.value.name = 'Test'

      openCreate()

      expect(dialog.value).toBe(true)
      expect(form.value.name).toBe('')
    })
  })

  describe('openEdit', () => {
    it('should populate form with user data', () => {
      const { form, dialog, isEditing, openEdit } = useUserForm()

      openEdit(mockUser)

      expect(dialog.value).toBe(true)
      expect(isEditing.value).toBe(true)
      expect(form.value.name).toBe('John Doe')
      expect(form.value.email).toBe('john@example.com')
      expect(form.value.password).toBe('')
    })
  })

  describe('submit', () => {
    it('should create user when not editing', async () => {
      const { form, submit } = useUserForm()
      form.value.name = 'John'
      form.value.email = 'test@example.com'
      form.value.password = 'password123'
      form.value.avatar = 'https://example.com/avatar.jpg'

      vi.mocked(UserService.create).mockResolvedValue(mockUser)

      const result = await submit()

      expect(UserService.create).toHaveBeenCalled()
      expect(result).toEqual(mockUser)
    })

    it('should update user when editing', async () => {
      const { form, openEdit, submit } = useUserForm()
      openEdit(mockUser)
      form.value.name = 'John Updated'

      vi.mocked(UserService.update).mockResolvedValue({ ...mockUser, name: 'John Updated' })

      const result = await submit()

      expect(UserService.update).toHaveBeenCalledWith(
        expect.objectContaining({ id: 1, name: 'John Updated' })
      )
      expect(result?.name).toBe('John Updated')
    })

    it('should return null on validation failure', async () => {
      const { submit } = useUserForm()

      const result = await submit()

      expect(result).toBeNull()
      expect(UserService.create).not.toHaveBeenCalled()
    })
  })

  describe('close', () => {
    it('should close dialog and reset form', () => {
      const { form, dialog, openCreate, close } = useUserForm()
      openCreate()
      form.value.name = 'Test'

      close()

      expect(dialog.value).toBe(false)
      expect(form.value.name).toBe('')
    })
  })
})
