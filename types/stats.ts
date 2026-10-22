// Contratos de GET /api/stats/* (ver StatsDtos.cs en el backend)

export interface AdminStats {
  totalResidents: number;
  totalSecurityStaff: number;
  activeUsers: number;
  inactiveUsers: number;
  totalLots: number;
  totalProperties: number;
  occupiedProperties: number;
  totalAmenities: number;
  upcomingReservations: number;
  reservationsToday: number;
  pendingRequests: number;
  activeOrders: number;
  permitsToday: number;
  visitorsInside: number;
}

export interface ResidentStats {
  upcomingReservations: number;
  totalReservations: number;
  activePermits: number;
  totalPermits: number;
  pendingRequests: number;
  availableAmenities: number;
  properties: number;
  lastActivityAt: string | null;
}

export interface SecurityStats {
  permitsToday: number;
  pendingPermits: number;
  visitorsInside: number;
  checkInsToday: number;
  checkOutsToday: number;
}
