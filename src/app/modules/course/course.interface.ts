import { TUser } from '../user/user.interface'

export interface IComment {
  user: TUser
  content: string
  createdAt: Date
}

export interface IReview extends IComment {
  rating: number
  commentReplies: IComment[]
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
  questions: IComment[]
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
