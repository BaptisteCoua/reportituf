export interface Event {
    id: number
    title: string
    description: string
    startDateTime: Date
    endDateTime: Date
    location: string
    attendees: number
}

export interface Participant {
    id: number
    name: string
    email: string
    birthDate: Date | null
    registeredAt: Date
}

export interface Availability {
    id: number
    userId: number
    startDate: Date
    endDate: Date
    reason: string
}
