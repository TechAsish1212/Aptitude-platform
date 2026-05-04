import { NextFunction } from 'express';
import mongoose from 'mongoose';

export interface IQuiz extends mongoose.Document {
  title: string;
  description: string;
  category: string;
  subCategory?: string;
  difficulty: 'Easy' | 'Medium' | 'Hard';
  timeLimit: number;
  totalMarks: number;
  passingMarks: number;
  questions: Array<{
    question: mongoose.Types.ObjectId;
    marks: number;
    negativeMarks: number;
  }>;
  instructions: string[];
  tags: string[];
  isPublished: boolean;
  publishedAt?: Date;
  createdBy: mongoose.Types.ObjectId;
  attempts: number;
  averageRating: number;
  createdAt: Date;
  updatedAt: Date;
}

const QuizSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Please provide quiz title'],
    trim: true,
    maxlength: [100, 'Title cannot exceed 100 characters']
  },
  description: {
    type: String,
    required: [true, 'Please provide quiz description']
  },
  category: {
    type: String,
    required: true
  },
  subCategory: String,
  difficulty: {
    type: String,
    enum: ['Easy', 'Medium', 'Hard'],
    required: true
  },
  timeLimit: {
    type: Number,
    required: [true, 'Please provide time limit in minutes'],
    min: 1,
    max: 180
  },
  totalMarks: {
    type: Number,
    default: 0
  },
  passingMarks: {
    type: Number,
    required: true,
    min: 0
  },
  questions: [{
    question: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Question',
      required: true
    },
    marks: {
      type: Number,
      default: 1
    },
    negativeMarks: {
      type: Number,
      default: 0
    }
  }],
  instructions: [String],
  tags: [String],
  isPublished: {
    type: Boolean,
    default: false
  },
  publishedAt: Date,
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  attempts: {
    type: Number,
    default: 0
  },
  averageRating: {
    type: Number,
    default: 0
  }
}, {
  timestamps: true
});

// Update totalMarks before saving
QuizSchema.pre('save', function(next:NextFunction) {
  if (this.questions) {
    this.totalMarks = this.questions.reduce((sum, q) => sum + q.marks, 0);
  }
  next();
});

export default mongoose.model<IQuiz>('Quiz', QuizSchema);