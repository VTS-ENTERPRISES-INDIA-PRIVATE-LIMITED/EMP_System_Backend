const mailSender = require("./Main")
require('dotenv').config();
const sendPayrollMail = (name, email, salary, date) => {
  const sendSalary = async (mailbody) => {
    try {
      const info = await mailSender.sendMail({
        from: 'surarapuvagdevi@gmail.com',
        to: email,
        subject: "🎉 You have received your salary from VTS Enterprises.Check details!",
        html: mailbody,
      });
      console.log("Mail sent", info.response);
    } catch (error) {
      console.error("Error sending mail", error);
    }
  };

  const mailbody = `
  <div>
    <div style="padding:10px;">
      <p>Dear ${name},</p>
      <p>Rs.${salary} has been credited to your A/C from VTS Enterprises on ${date}. Find your Payslip details below</p>
    </div>
    <div style="padding:10px;">
      <div style="display:flex;justify-content:space-between;align-items:center;padding:10px;border:1px solid black;">
        <div style='display:flex;justify-content:center;align-items:center;width:40%'>
          <p style="text-align:start;">D/no:123<br></br>PTK Nagar, Thiruvanmiyur<br></br>Chennai, INDIA</p>
        </div>
      </div>
    <table style="width: 100%; border-collapse: collapse;">
        <tr>
          <th colspan="2" style="text-align: end;font-weight: bold; border: 1px solid black;padding: 10px;text-align: start;">
            <strong>Payment Details</strong>
          </th>
        </tr>
        <tr>
          <td style="border: 1px solid black;padding: 10px;text-align: start;">Basic Salary</td>
          <td style="border: 1px solid black;padding: 10px;text-align: end;">&#8377; 30000</td>
        </tr>
        <tr>
          <td style="border: 1px solid black;padding: 10px;text-align: start;">HRA</td>
          <td style="border: 1px solid black;padding: 10px;text-align: end;">+ &#8377; 2000</td>
        </tr>
        <tr>
          <td style="border: 1px solid black;padding: 10px;text-align: start;">LTA</td>
          <td style="border: 1px solid black;padding: 10px;text-align: end;">+ &#8377; 500</td>
        </tr>
        <tr>
          <td style="border: 1px solid black;padding: 10px;text-align: start;">Bonus</td>
          <td style="border: 1px solid black;padding: 10px;text-align: end;">+ &#8377; 2000</td>
        </tr>
    
        <tr>
          <td style="border: 1px solid black;padding: 10px;text-align: start;">Provident Fund</td>
          <td style="border: 1px solid black;padding: 10px;text-align: end;">- &#8377; 500</td>
        </tr>
        <tr>
          <td style="border: 1px solid black;padding: 10px;text-align: start;">Transaction Type:</td>
          <td style="border: 1px solid black;padding: 10px;text-align: end;">Credit</td>
        </tr>
        <tr>
          <td style="border: 1px solid black;padding: 10px;text-align: start;">Transaction Status:</td>
          <td style="border: 1px solid black;padding: 10px;text-align: end;">✅ Success</td>
        </tr>
        <tr>
          <th style="font-weight: bold; border: 1px solid black;padding: 10px;text-align: start;">
            <strong>Total Amount</strong>
          </th>
          <th style="font-weight: bold; border: 1px solid black;padding: 10px;text-align: end;">
            <strong>${salary}</strong>
          </th>
        </tr>
      </table>
      <div style="padding:10px;margin-top:20px;">
        <p style='color:red'>if you have any queries please reach out to us at vtsenterprises@gmail.com</p>
        <p>Warm Regards,</p>
        <p>VTS Enterprises</p>
        <p></p>
        <p>vtsenterprises@gmail.com</p>
        <p><i>This is an automated message. Please do not reply to this email.</i></p>
      </div>
    </div>
  </div>
  `;

  sendSalary(mailbody);
};


module.exports = sendPayrollMail;