const express = require('express');
const nodemailer = require('nodemailer');
const multer = require('multer');
const path = require('path');
require('dotenv').config();
const app = express();
const upload = multer({ storage: multer.memoryStorage() });

app.use(express.static(path.join(__dirname, 'public')));

app.post('/send-email.php', upload.single('attachment'), async (req, res) => {
  const { name, phone, email, message } = req.body;
  const attachment = req.file;
  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.GMAIL_USER,
      pass: process.env.APP_PASS,
    },
  });

  const mailOptions = {
    from: email,
    to: process.env.GMAIL_USER,
    subject: `New Message From ${name}`,
    text: `Name: ${name}\nPhone: ${phone}\nEmail: ${email}\nMessage: ${message}`,
    attachments: attachment
      ? [
          {
            filename: attachment.originalname,
            content: attachment.buffer, 
          },
        ]
      : [],
  };

  try {
    await transporter.sendMail(mailOptions);
    res.json({ message: 'Message sent to Virusi!' });
  } catch (error) {
    console.error('Error sending email:', error);
    res.status(500).json({ message: 'Failed to send message.' });
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
