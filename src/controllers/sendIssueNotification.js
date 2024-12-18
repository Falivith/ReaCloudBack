const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASSWORD
  }
});

const sendIssueNotification = async (issue, resource, user) => {
  const mailOptions = {
    from: user.email,
    to: process.env.ADMIN_EMAIL,
    subject: `New Issue Report - Resource ${resource.title}`,
    html: `
      <h2>New Issue Reported</h2>
      <p><strong>Resource:</strong> ${resource.title}</p>
      <p><strong>Resource ID:</strong> ${resource.id}</p>
      <p><strong>Reported by:</strong> ${user.email}</p>
      <p><strong>Description:</strong> ${issue.description}</p>
    `
  };

  return transporter.sendMail(mailOptions);
};

module.exports = { sendIssueNotification };