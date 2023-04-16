import nodemailer from 'nodemailer';
import { forgotPassword, verifyEmail } from './emailMessage';
import Mail from '../src/models/Mail';
import { generateUUID, generateOTPCode } from './generator';

interface PSendMail {
  userId: string;
  code: string;
  firstName?: string;
  oldEmail?: string;
  email?: string;
  to: string;
  subject: string;
  url?: string;
}

interface IDate {
  addMinutes(): number;
}

// * options= { userId , to, subject, code }
export const sendEmail = async (options: PSendMail) => {
  const token = generateUUID();
  const resetLink = `http://localhost:3000/resetpassword/?token=${token}`;
  // const resetLink = `https://sanpedro.uat.xyphersolutionsinc.com/resetpassword/?token=${token}`
  let otpCode = '';

  const transporter = nodemailer.createTransport({
    host: process.env.EMAIL_HOST,
    auth: {
      user: process.env.EMAIL_USERNAME,
      pass: process.env.EMAIL_PASSWORD,
    },
    secure: true,
    requireTLS: true,
    port: 465,
  });

  Date.prototype.addMinutes = (min: number): Date => {
    // if(!min) return this
    let date: Date = this ?? new Date();
    date.setTime(date.getTime() + min * 60 * 1000);

    return date;
  };

  let htmlMsg: string;
  let expireTime: Date; // FP - 30min , CE - 1hr
  switch (options.code) {
    case 'FP':
      htmlMsg = forgotPassword({ resetLink });
      expireTime = new Date().addMinutes(30);
      break;
    case 'CE':
      otpCode = generateOTPCode();
      htmlMsg = verifyEmail({
        firstName: options.firstName,
        oldEmail: options.oldEmail,
        newEmail: options.email,
        otpCode,
      });
      expireTime = new Date().addMinutes(60);
      break;
    default:
      htmlMsg = forgotPassword({ resetLink });
      expireTime = new Date().addMinutes(30);
      break;
  }

  const mailOptions = {
    from: `${process.env.APP_NAME} App Team <${process.env.EMAIL_USERNAME}>`,
    to: options.to,
    subject: options.subject,
    html: htmlMsg,
  };

  return transporter
    .sendMail(mailOptions)
    .then((info) => {
      Date.prototype.addMinutes = function (min) {
        this.setTime(this.getTime() + min * 60 * 1000);
        return this;
      };
      // * addmin min per num
      const receipt = {
        token,
        userId: options.userId,
        to: options.to,
        subject: options.subject,
        code: options.code,
        expires: expireTime,
        otpCode,
      };
      Mail.create(receipt);
      return { success: true, data: info };
    })
    .catch((err) => {
      return { success: false, data: err };
    });
};

export const verifyMail = async (options: PSendMail) => {
  try {
    const transporter = nodemailer.createTransport({
      host: process.env.EMAIL_HOST,
      auth: {
        user: process.env.EMAIL_USERNAME,
        pass: process.env.EMAIL_PASSWORD,
      },
      secure: true,
      requireTLS: true,
      port: 465,
    });

    const htmlMsg = verifyEmail({
      firstName: options.firstName,
      oldEmail: options.oldEmail,
      newEmail: options.email,
      otpCode: options.url,
    });

    await transporter.sendMail({
      from: process.env.EMAIL_USERNAME,
      to: options.email,
      subject: options.subject,
      html: htmlMsg,
    });
    console.log('email sent successfully');
  } catch (error) {
    console.log('email not sent!');
    console.log(error);
    return error;
  }
};
