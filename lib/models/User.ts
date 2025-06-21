import mongoose from 'mongoose';

export interface IUserProfile extends mongoose.Document {
  userId: string;
  resumeUrl?: string;
  resumeSummary?: string;
  createdAt: Date;
  updatedAt: Date;
}

const UserProfileSchema = new mongoose.Schema(
  {
    userId: {
      type: String,
      required: true,
      unique: true,
    },
    resumeUrl: {
      type: String,
    },
    resumeSummary: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model<IUserProfile>('UserProfile', UserProfileSchema);
