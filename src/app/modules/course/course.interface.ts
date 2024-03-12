import { JwtPayload } from 'jsonwebtoken'

export interface IQuestionReply {
  user: JwtPayload
  content: string
  createdAt: Date
}
export interface IQuestion {
  user: JwtPayload
  content: string
  createdAt: Date
  replies?: IQuestionReply[]
}

export interface IReview extends IQuestion {
  rating: number
  commentReplies: IQuestion[]
}

export interface ILink {
  title: string
  url: string
}

export interface IVideoThumbnail {
  public_id: string
  url: string
}

export interface ICourseData {
  title: string
  description: string
  videoUrl: string
  videoSection: string
  videoLength: number
  videoPlayer: string
  links: ILink[]
  suggestions: string[]
  questions: IQuestion[]
}

export interface IBenefit {
  title: string
}

export interface IPrerequisite {
  title: string
}

export interface ICourse {
  name: string
  description: string
  price: number
  estimatePrice?: number
  thumbnail: IVideoThumbnail
  tags: string[]
  level: string
  demoUrl: string
  benefits: IBenefit[]
  prerequisites: IPrerequisite[]
  reviews: IReview[]
  courseData: ICourseData[]
  rating: number
  purchased?: number
}
