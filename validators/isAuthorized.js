const jwt = require('jsonwebtoken');

isAuthorized = async ( req, res, next) =>{
    

    if(req.headers.authorization){
        let token = req.headers.authorization.split(' ')[1];
        let decode
        try{
         decode = await jwt.verify(token, process.env.JWT_SECRETKEY)
         req.userid = decode.id
         next()
        } catch(err){
            res.status(400).json({message: err.message});
        }
       
    }else{
        res.status(400).json({message: "Token Not Found"});
    }
    // if(req.cookies.jwt){
    //     let token = req.cookies.jwt;
    //     let decode
    //     try{
    //      decode = await jwt.verify(token, process.env.JWT_SECRETKEY)
    //      req.userid = decode.id
    //      next()
    //     } catch(err){
    //         res.status(400).json({message: err.message});
    //     }
       
    // }else{
    //     res.status(400).json({message: "Token Not Found"});
    // }
        
    
 
//    console.log(req.headers)
//     res.status(400).json({message: "Token Not Found"});
}



 module.exports = isAuthorized