export interface SeatCollection {
  _id?: string;
  tripId: string;
  seatNumber: number;
  status: "Available" | "Reserved" | "Occupied";
  createdAt: string;
}