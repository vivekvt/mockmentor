import mongoose from 'mongoose';

export interface IInterview extends mongoose.Document {
  userId: string;
  jobTitle: string;
  jobDescription?: string;
  userSummary: string;
  jobSummary: string;
  status: 'scheduled' | 'in-progress' | 'completed';
  startDateTime?: Date;
  createdAt: Date;
  updatedAt: Date;
}

const InterviewSchema = new mongoose.Schema(
  {
    userId: {
      type: String,
      required: true,
    },
    jobTitle: {
      type: String,
      required: true,
    },
    jobDescription: {
      type: String,
    },
    userSummary: {
      type: String,
      required: true,
    },
    jobSummary: {
      type: String,
      required: true,
    },
    status: {
      type: String,
      enum: ['scheduled', 'in-progress', 'completed'],
      default: 'scheduled',
    },
    startDateTime: {
      type: Date,
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model<IInterview>('Interview', InterviewSchema);
