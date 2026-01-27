import mongoose from 'mongoose';

export interface IUser {
  username: string;
  email: string;
  password: string;
  refreshTokens?: string[];
}

const userSchema = new mongoose.Schema<IUser>({
  username: {
    type: String,
    required: true,
    unique: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  refreshTokens: {
    type: [String],
    default: [],
  },
});

const UserModel = mongoose.model<IUser>('User', userSchema);

export default UserModel;
