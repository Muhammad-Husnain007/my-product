import nodemailer from "nodemailer";

function generateOTP() {
  return Math.floor(1000 + Math.random() * 9000);
}

const transporter = nodemailer.createTransport({
  service: process.env.SEND_OTP_SERVICE,
  auth: {
    user: process.env.SENDER_EMAIL,     
    pass: process.env.GOOGLE_PASSWORD        
  }
});

async function sendOTP(userEmail) {
  const otp = generateOTP();

  const mailOptions = {
    from: process.env.SENDER_EMAIL,
    to: userEmail,
    subject: "Your OTP Code",
    html: `
      <h2>Your OTP Code</h2>
      <p>Your OTP is: <strong>${otp}</strong></p>
      <p>This OTP expires in 1 minutes.</p>
    `
  };

  await transporter.sendMail(mailOptions);  
  return otp; 
}
export default sendOTP;