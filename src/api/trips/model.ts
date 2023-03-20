import mongoose, { Document, Schema } from "mongoose";

export interface ITrip extends Document {
  label: string;
  departureStation: string;
  arrivalStation: string;
  departureTime: string;
  arrivalTime: string;
  price: number;
  createdAt: string;
}

const TripSchema: Schema = new Schema({
  label: {
    type: String,
    required: true
  },
  departureStation: {
    type: String,
    required: true
  },
  arrivalStation: {
    type: String,
    required: true
  },
  departureTime: {
    type: String,
    required: true
  },
  arrivalTime: {
    type: String,
    required: true
  },
  price: {
    type: Number,
    required: true
  },
  createdAt: String
});

export const Trip = mongoose.model<ITrip>("Trip", TripSchema);