const jwt = require("jsonwebtoken");

exports.authenticate = async (req,res,next) => {
    const token = req.header('Authorization')?.split(' ')[1];
    console.log(token);
    if(!token) return res.status(401).json({msg: 'No token, authorization denied'});

    try{
        const decoded = await jwt.verify(token,process.env.JWT_SECRET);
        req.user = decoded;
        next();
    }
    catch(error){
        res.status(400).json({msg: 'Token is not valid',error:error.message});
    }
}