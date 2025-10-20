import nodemailer from 'nodemailer'

export default defineEventHandler(async (event) => {
  const body = await readBody(event)
  const { email, message } = body

  if (!email || !message) {
    return { success: false, error: 'Missing email or message' }
  }

  try {
    const transporter = nodemailer.createTransport({
      host: 'smtp.gmail.com',
      port: 465,
      secure: true,
      auth: {
        user: process.env.MAIL_USER,
        pass: process.env.MAIL_PASS
      }
    })

    await transporter.sendMail({
      from: process.env.MAIL_FROM || process.env.MAIL_USER,
      to: process.env.MAIL_TO || process.env.MAIL_USER,
      replyTo: email,
      subject: `New message from ${email}`,
      text: message,
      html: `<p><strong>From:</strong> ${email}</p><p>${message}</p>`
    })

    return { success: true }
  } catch (err) {
    console.error('Mailer error:', err)
    return { success: false, error: 'Mail delivery failed' }
  }
})
