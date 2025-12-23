import { ref, computed } from 'vue'
import type { CreateUserPayload, User } from '../types'
import { UserService } from '../services/UserService'

interface UserFormState {
  name: string
  email: string
  password: string
  avatar: string
  role: 'customer' | 'admin'
}

const initialState: UserFormState = {
  name: '',
  email: '',
  password: '',
  avatar: 'https://i.pravatar.cc/150',
  role: 'customer'
}

export function useUserForm() {
  const form = ref<UserFormState>({ ...initialState })
  const isSubmitting = ref(false)
  const errors = ref<Partial<Record<keyof UserFormState, string>>>({})
  const dialog = ref(false)
  const editingUser = ref<User | null>(null)

  const isEditing = computed(() => editingUser.value !== null)

  const validate = (): boolean => {
    errors.value = {}

    if (!form.value.name.trim()) {
      errors.value.name = 'Name is required'
    }

    if (!form.value.email.trim()) {
      errors.value.email = 'Email is required'
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.value.email)) {
      errors.value.email = 'Invalid email format'
    }

    if (!isEditing.value && !form.value.password) {
      errors.value.password = 'Password is required'
    } else if (!isEditing.value && form.value.password.length < 6) {
      errors.value.password = 'Password must be at least 6 characters'
    }

    if (!form.value.avatar.trim()) {
      errors.value.avatar = 'Avatar URL is required'
    }

    return Object.keys(errors.value).length === 0
  }

  const submit = async (): Promise<User | null> => {
    if (!validate()) return null

    isSubmitting.value = true
    try {
      const payload: CreateUserPayload = {
        name: form.value.name,
        email: form.value.email,
        password: form.value.password,
        avatar: form.value.avatar,
        role: form.value.role
      }

      if (isEditing.value && editingUser.value) {
        return await UserService.update({ id: editingUser.value.id, ...payload })
      }

      return await UserService.create(payload)
    } finally {
      isSubmitting.value = false
    }
  }

  const reset = () => {
    form.value = { ...initialState }
    errors.value = {}
    editingUser.value = null
  }

  const openCreate = () => {
    reset()
    dialog.value = true
  }

  const openEdit = (user: User) => {
    editingUser.value = user
    form.value = {
      name: user.name,
      email: user.email,
      password: '',
      avatar: user.avatar,
      role: user.role
    }
    dialog.value = true
  }

  const close = () => {
    dialog.value = false
    reset()
  }

  return {
    form,
    errors,
    isSubmitting,
    isEditing,
    dialog,
    editingUser,
    validate,
    submit,
    reset,
    openCreate,
    openEdit,
    close
  }
}
