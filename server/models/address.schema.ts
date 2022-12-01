import { Schema } from "mongoose";

export interface IAddress {
  country: string;
  state: string;
  city: string;
  street?: string;
  post_code?: string;
}

const addressSchema = new Schema<IAddress>(
  {
    country: { type: String, required: true },
    state: { type: String, required: true },
    city: { type: String, required: true },
    street: { type: String },
    post_code: { type: String },
  },
  { _id: false }
);

export default addressSchema;
