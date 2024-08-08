const mailSender = require('../EmailService/Main')

const generateotp = () => {
    const genotp = Math.floor(100000 + Math.random() * 900000)
    return genotp
}
const sendResetPasswordLinkMail = async(email) => {
    const otp = generateotp()
    const sendOtpEmail = async (mailBody) => {
        const info = await mailSender.sendMail({
            from: "vts@gmail.com",
            to: email,
            subject: "Reset your Password!!!!",
            html: mailBody,
        });
        console.log("Reset pwd mail sent", info.response);
        return true
    };
    
    const mailBody = `
<div style="width:100%;max-width:600px;margin:0 auto;padding:10px;border:1px solid #ccc;border-radius:10px;box-shadow:0 0 10px rgba(0,0,0,0.1);font-family:Arial,sans-serif;line-height:1.6;">
  <div style="text-align:center;margin-bottom:20px;">
    <img src="https://res.cloudinary.com/dvmkt80vc/image/upload/v1720537847/WhatsApp_Image_2024-07-09_at_8.34.38_PM_xtzvwx.jpg" alt="vts-banner-image" style="width:100%;height:auto;margin-bottom:4px;">
  </div>
 <div>
        <p>Dear VTS Employee,</p>
        <p>We have received your request to change your password.</p>
        <p>Please Enter the below OTP verification Code to reset your password:</p>
        <strong>OTP : ${otp}</strong>

        <p><strong>INSTRUCTIONS</strong></p>
        <ul>
        <li><strong>Length:</strong> Your password should be at least 6 characters long.</li>
        <li><strong>Complexity:</strong> Include a mix of uppercase letters, lowercase letters, numbers, and special characters (e.g., !@#$%^&*).</li>
        <li><strong>Avoid Common Patterns:</strong> Do not use easily guessable patterns or common words.</li>
        <li><strong>Unique:</strong> Use a password unique to this account.</li>
        <li><strong>Change Regularly:</strong> Consider changing your password periodically for security reasons.</li>
    </ul>

        </div>
  <div style="padding:10px;margin-top:20px;">
  <p style="margin-top:20px;" >If you did not request this change, please ignore this email.</p>
    <p>Best Regards,</p>
    <p>Admin Team,</p>
    <p><strong>VTS Enterprises India Private Limited</strong></p>
    <p style="font-size:12px;"><i>This is an automated message. Please do not reply to this email.</i></p>
  </div>
</div>


`;
try {
    let info = await sendOtpEmail(mailBody);
    if (info) return otp
    return false
} catch (error) {
    console.error("Error sending email: ", error);
    return false
}
  
};

module.exports = sendResetPasswordLinkMail;