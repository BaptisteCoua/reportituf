export interface User {
  id: number
  email: string
  password: string
  name: string
  role: 'customer' | 'admin'
  avatar: string
  creationAt: string
  updatedAt: string
}

export interface UserFilters {
  search: string
  role: 'customer' | 'admin' | null
}

export interface CreateUserPayload {
  name: string
  email: string
  password: string
  avatar: string
  role?: 'customer' | 'admin'
}

export interface UpdateUserPayload extends Partial<CreateUserPayload> {
  id: number
}
