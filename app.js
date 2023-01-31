const express = require('express');
const mongoose = require('mongoose');
const morgan = require('morgan');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const cors = require('cors');
require('dotenv').config( )

const AppError = require('./utilites/appError');
const globalErrorHandler = require('./controllers/errorController');
const isAuthorized = require('./validators/isAuthorized')

// import Routers
const userRouter = require('./routes/userRouter')
const postRouter = require('./routes/postRouter')
const commentRouter = require('./routes/commentRouter')

//app
const app = express();


//middleware
app.use(morgan('dev'))
app.use(bodyParser.json());
app.use(cookieParser())

//cors
if(process.env.NODE_ENV === 'development'){
    app.use(cors({origin: process.env.CLIENT_URL}))
}

app.get('/api' , (req, res) => {
  
  res.json({
      
      message: "you have access"
  })
  })

// app.use(isAuthorized)
app.get('/api/v1/' , (req, res) => {

res.json({
   domain: req.url,
    UserId: req.userid,
    message: "you have access"
})
})

app.use('/api/v1/users', userRouter)
app.use('/api/v1/comments', commentRouter)
app.use('/api/v1/posts', postRouter)



app.all('*', (req, res, next) => {
    next(new AppError(`Can't find ${req.originalUrl} on this server!`, 404));
  });
  
  app.use((err, req, res, next)=>{
  
    res.status(err.statusCode).json({
        status: err.status,
        message: err.message
    })
  });


module.exports = app;