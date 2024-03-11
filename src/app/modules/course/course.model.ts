import mongoose, { Schema } from 'mongoose'
import {
  IBenefit,
  IComment,
  ICourse,
  ICourseData,
  ILink,
  IPrerequisite,
  IReview,
  IVideoThumbnail,
} from './course.interface'

// Define Mongoose schema types
const { ObjectId } = Schema.Types

// Define Mongoose schema for IComment interface
const CommentSchema = new Schema<IComment>({
  user: { type: ObjectId, ref: 'User', required: true },
  content: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
})

// Define Mongoose schema for IReview interface
const ReviewSchema = new Schema<IReview>({
  rating: { type: Number, required: true },
  commentReplies: [CommentSchema],
})

// Define Mongoose schema for ILink interface
const LinkSchema = new Schema<ILink>({
  title: { type: String, required: true },
  url: { type: String, required: true },
})

// Define Mongoose schema for IVideoThumbnail interface
const VideoThumbnailSchema = new Schema<IVideoThumbnail>({
  public_id: { type: String, required: true },
  url: { type: String, required: true },
})

// Define Mongoose schema for ICourseData interface
const CourseDataSchema = new Schema<ICourseData>({
  title: { type: String, required: true },
  description: { type: String, required: true },
  videoUrl: { type: String, required: true },
  videoSection: { type: String, required: true },
  videoLength: { type: Number, required: true },
  videoPlayer: { type: String, required: true },
  links: [LinkSchema],
  suggestions: [String],
  questions: [CommentSchema],
})

// Define Mongoose schema for IBenefit interface
const BenefitSchema = new Schema<IBenefit>({
  title: { type: String, required: true },
})

// Define Mongoose schema for IPrerequisite interface
const PrerequisiteSchema = new Schema<IPrerequisite>({
  title: { type: String, required: true },
})

// Define Mongoose schema for ICourse interface
const CourseSchema = new Schema<ICourse>(
  {
    name: { type: String, required: true },
    description: { type: String, required: true },
    price: { type: Number, required: true },
    estimatePrice: { type: Number },
    thumbnail: { type: VideoThumbnailSchema, required: true },
    tags: [{ type: String, required: true }],
    level: { type: String, required: true },
    demoUrl: { type: String, required: true },
    benefits: [BenefitSchema],
    prerequisites: [PrerequisiteSchema],
    reviews: [ReviewSchema],
    courseData: [CourseDataSchema],
    rating: { type: Number, required: true },
    purchased: { type: Number },
  },
  {
    timestamps: true,
  },
)

const Course = mongoose.model<ICourse>('Course', CourseSchema)

export default Course
