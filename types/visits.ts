// DTO que enviás al backend
export interface CreateVisitDto {
    nameVisit: string
    lastNameVisit: string
    dniVisit: number
}

// DTO que recibís del backend
export interface VisitResponseDto {
    visitId: string
    nameVisit: string
    lastNameVisit: string
    dniVisit: number
    visitStatus: string
}