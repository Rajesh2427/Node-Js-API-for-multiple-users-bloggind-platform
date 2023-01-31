

const verifyEmail = (url) =>{
    return `
    
    <!DOCTYPE html>
    <html>
      <head>
        <title>Email Verification</title>
      </head>
      <body>
        <h1>Welcome to our website Trusted News</h1>
        <p>Thank you for signing up. In order to complete your registration, please verify your email address by clicking on the link below:</p>
        
        <a href="${url}"  style="text-decoration:none; color: black"><button style=" border-radius: 50px; padding:5px; background:orange; text-decoration: none" >Verify Email Address</buton></a>
    
    
       
      </body>
    </html>
    `
}

const resetPassword = (url, name) =>{
  return `
  <!DOCTYPE html>
<html>
  <head>
    <title>Password Reset</title>
  </head>
  <body>
    <p>Hi ${name},</p>
    <p>
      We received a request to reset the password for your account. If you did
      not make this request, please ignore this email.
    </p>
    <p>To reset your password, please click the link below:</p>
    <button
      style="
        border-radius: 10px;
        font-size: 2rem;
        background: orangered;
        color: whitesmoke;
      "
    >
      <a style="text-decoration: none; color: whitesmoke;" href="${url}"
        >Reset my password</a
      >
    </button>

    <p>
    ${url}
    </p>
    <p>
      If you are having trouble clicking the link, you can also copy and paste
      the link into your browser.
    </p>
    <p>Best,</p>
    <p>Trusted News</p>
  </body>
</html>

  `
}




module.exports ={
    verifyEmail,
    resetPassword
}