const nodemailer = require('nodemailer');
const {verifyEmail, resetPassword} = require('./emailTemplates')
const htmlToText = require('html-to-text');

module.exports = class Email {
  constructor(user, url) {
    this.to = user.email;
    this.name = user.name
    this.url = url;
    this.from = `Trusted News <${process.env.GMAIL_EMAIL}>`;
  }

  newTransport() {

    return nodemailer.createTransport({
      service: 'gmail',
      host: 'smtp.gmail.com',
      seure: false,
      auth: {
        user: process.env.GMAIL_EMAIL,
        pass: process.env.GMAIL_PASSWORD
      }
    });
  }

  // Send the actual email
  async send(template, subject) {
    // 1) Render HTML based on a pug template
    // const html = pug.renderFile(`${__dirname}/../views/email/${template}.pug`, {
    //   firstName: this.firstName,
    //   url: this.url,
    //   subject
    // });
    
    // const html = `<h1>This is a testing email from trustednews html</h1>`

    // 2) Define email options
    const mailOptions = {
      from: this.from,
      to: this.to,
      subject,
      html : template
      
    };

    // 3) Create a transport and send email
    await this.newTransport().sendMail(mailOptions);
  }

  async sendWelcome() {
    await this.send('welcome', 'Welcome to the Trusted News');
  }
  
  async sendVerifyEmail(){
    const verify =  verifyEmail(this.url)
    await this.send(verify, 'Email verification mail from Trustednews')
  }

  async sendPasswordReset () {
    
   const reset = resetPassword(this.url, this.name)
    await this.send(
      reset,
      'Password reset link valid 10 minutes from Trustednews'
    );

    
  }
};