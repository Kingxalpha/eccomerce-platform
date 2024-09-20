const sendEmail = require('../utils/sendEmail');

exports.contactSupport = async (req, res) => {
  const { subject, message } = req.body;
  try {
    await sendEmail(process.env.SUPPORT_EMAIL, `Support Request: ${subject}`, message);
    res.status(200).json({ message: 'Support request sent successfully.' });
  } catch (err) {
    res.status(500).json({ message: 'Failed to send support request.' });
  }
};

exports.getFAQs = async (req, res) => {
  // You can store FAQs in a database or a static file
  const faqs = [
    { question: 'How to reset password?', answer: 'Go to profile settings...' },
    // Add more FAQs
  ];
  res.status(200).json(faqs);
};
