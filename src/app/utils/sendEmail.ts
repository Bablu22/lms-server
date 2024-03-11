import nodemailer from 'nodemailer'
import envConfig from '../config/env.config'

export const sendEmail = async (to: string, subject: string, html: string) => {
  const transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com.',
    port: 587,
    secure: envConfig.NODE_ENV === 'production',
    auth: {
      user: envConfig.SMTP_USER,
      pass: envConfig.SMTP_PASS,
    },
  })

  await transporter.sendMail({
    from: 'bablumia.dev@gmail.com',
    to,
    subject,
    html,
  })
}
