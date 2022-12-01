import { model, Schema } from "mongoose";
import addressSchema, { IAddress } from "./address.schema";

export interface IUser {
  name: string;
  username: string;
  email: string;
  address: IAddress;
}

const userSchema = new Schema<IUser>({
  name: { type: String, required: true },
  username: { type: String, required: true, unique: true },
  email: { type: String, required: true, unique: true },
  address: { type: addressSchema, required: true },
});

const User = model<IUser>("User", userSchema, "user");

export default User;
