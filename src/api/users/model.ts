import mongoose, { Document, Schema } from "mongoose";

export interface IUser extends Document {
  // id?: string;
  firstname: string;
  lastname: string;
  email: string;
  password?: string;
  createdAt: string;
}

const UserSchema: Schema = new Schema({
  // id: {
  //   type: Schema.Types.ObjectId,
  //   default() {
  //     return this._id
  //   }
  // },
  firstname: {
    type: String,
    required: true
  },
  lastname: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true,
    unique: true
  },
  password: {
    type: String,
    required: true
  },
  createdAt: String
});

export const User = mongoose.model<IUser>("User", UserSchema);