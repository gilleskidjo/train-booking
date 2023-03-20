import mongoose, { Document, models, Schema } from "mongoose";

export interface ISeat extends Document {
  tripId: string;
  seatNumber: number;
  status: "Available" | "Reserved" | "Occupied";
  createdAt: string;
}

const SeatSchema: Schema = new Schema({
  tripId: {
    type: Schema.Types.ObjectId,
    ref: models.Trip,
    required: true,
  },
  seatNumber: {
    type: Number,
    required: true
  },
  status: {
    type: String,
    required: true
  },
  createdAt: String
});

export const Seat = mongoose.model<ISeat>("Seat", SeatSchema);