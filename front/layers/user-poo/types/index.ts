export interface User {
  id: number
  firstName: string
  lastName: string
  email: string
  phone: string
  username: string
  age: number
  gender: string
  image: string
  birthDate: string
  company: {
    name: string
    department: string
    title: string
  }
}

export interface UsersResponse {
  users: User[]
  total: number
  skip: number
  limit: number
}

export interface UserFilters {
  gender?: string
}
