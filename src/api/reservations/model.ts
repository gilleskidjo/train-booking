import mongoose, { Document, models, Schema } from "mongoose";

export interface IReservation extends Document {
  userId: string;
  tripId: string;
  seatId: string;
  status: "Used" | "Cancel" | "Pending";
  createdAt: string;
}

const ReservationSchema: Schema = new Schema({
  userId: {
    type: Schema.Types.ObjectId,
    ref: models.User,
    required: true,
  },
  tripId: {
    type: Schema.Types.ObjectId,
    ref: models.Trip,
    required: true,
  },
  seatId: {
    type: Schema.Types.ObjectId,
    ref: models.Seat,
    required: true,
  },
  status: {
    type: String,
    required: true,
    default: "Pending"
  },
  createdAt: String
})

export const Reservation = mongoose.model<IReservation>("Reservation", ReservationSchema);