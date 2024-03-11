import { z } from 'zod'

const LinkSchema = z.object({
  title: z.string(),
  url: z.string().url(),
})

const CourseDataSchema = z.object({
  title: z.string(),
  description: z.string(),
  videoUrl: z.string().url(),
  videoSection: z.string(),
  videoLength: z.number(),
  videoPlayer: z.string(),
  links: z.array(LinkSchema),
})

const BenefitSchema = z.object({
  title: z.string(),
})

const PrerequisiteSchema = z.object({
  title: z.string(),
})

export const createCourseSchema = z.object({
  name: z.string({
    required_error: 'Course name cannot be empty!',
    invalid_type_error: 'Course name must be a string!',
  }),
  description: z.string({
    required_error: 'Course description cannot be empty!',
    invalid_type_error: 'Course description must be a string!',
  }),
  price: z.number({
    required_error: 'Course price cannot be empty!',
    invalid_type_error: 'Course price must be a number!',
  }),
  thumbnail: z.object(
    {
      public_id: z.string(),
      url: z.string().url({
        message: 'Invalid URL!',
      }),
    },
    {
      required_error: 'You must provide a thumbnail!',
      invalid_type_error: 'Thumbnail must have a public_id and a url!',
    },
  ),
  tags: z.array(z.string(), {
    required_error: 'You must provide at least one tag!',
    invalid_type_error: 'Tags must be an array of strings',
  }),
  level: z.string({
    required_error: 'Course level cannot be empty!',
    invalid_type_error: 'Level must be a string',
  }),
  demoUrl: z
    .string({
      required_error: 'You must provide a demo URL!',
      invalid_type_error: 'Demo URL must be a string',
    })
    .url({
      message: 'Invalid URL!',
    }),
  benefits: z.array(BenefitSchema, {
    required_error: 'Course benefits is required',
    invalid_type_error: 'Benefits must be an array of objects',
  }),
  prerequisites: z.array(PrerequisiteSchema, {
    required_error: 'Course prerequisites is required',
    invalid_type_error: 'Prerequisites must be an array of objects',
  }),
  courseData: z.array(CourseDataSchema, {
    required_error: 'Please provide course data!',
    invalid_type_error: 'Course data must be an array of objects',
  }),
  rating: z.number({
    required_error: 'Course rating is required!',
    invalid_type_error: 'Rating must be a number',
  }),
  purchased: z
    .number({
      invalid_type_error: 'Purchased must be a number',
    })
    .optional(),
})
