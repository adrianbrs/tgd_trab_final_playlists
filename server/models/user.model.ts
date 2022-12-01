import { model, Schema } from "mongoose";

export interface IUser {
    name: string;
    username: string;
    email: string;
}

const userSchema = new Schema<IUser>({
    name: { type: String, required: true },
    username: { type: String, required: true },
    email: { type: String, required: true }
});

const User = model<IUser>('User', userSchema, 'user');

export default User;