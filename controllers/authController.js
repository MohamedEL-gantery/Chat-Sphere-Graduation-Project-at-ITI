const User=require('../models/userModel')
const bcrypt=require('bcryptjs')
const AppError = require('../utils/appError');

const jwt=require('jsonwebtoken');
const asyncHandler = require('express-async-handler');

const register = asyncHandler(async (req, res, next) => {
    const { name,
          email,
          password,
        phoneNumber, 
          gender,
           role,
       followings,
         followers,
          active,
          isOnline, 
          birthDay,
           age,
            photo,
             passwordConfirm } = req.body;

    const foundUser = await User.findOne({ email }).exec();
    if (foundUser) {
        return next(new AppError('User already exists', 401));
    }

    const user = await User.create({
        name, email, password, phoneNumber, gender, role, followings, followers, active, isOnline, birthDay, age, photo, passwordConfirm
    });

    const accessToken = jwt.sign({
        user
    }, process.env.ACCESS_TOKEN_SECRET, { expiresIn: "60d" });

    const refreshToken = jwt.sign({
        user
    }, process.env.REFRESH_TOKEN_SECRET, { expiresIn: "90d" });

    res.cookie("jwt", refreshToken, {
        httpOnly: true,
        secure: true,
        sameSite: "None",
        maxAge: 90 * 24 * 60 * 60 * 1000
    });

    res.json({ accessToken, email: user.email, name: user.name });
});
const login = asyncHandler(async (req, res, next) => {
    const { email, password } = req.body;
    if (!email || !password) {
        return next(new AppError('All fields are required', 400));
    }

    const foundUser = await User.findOne({ email }).exec();
    if (!foundUser) {
        return next(new AppError('User does not exist', 401));
    }

    const match = await bcrypt.compare(password, foundUser.password);
    if (!match) {
        return next(new AppError('Wrong password', 401));
    }

        
       
        const accessToken = jwt.sign({
                user:foundUser,
                role: foundUser.role
               
               
            },process.env.ACCESS_TOKEN_SECRET,{expiresIn:"60d"})
            console.log(foundUser._id)
            const refreshToken = jwt.sign({
                UserInfo:{
                    id:foundUser._id
                }
            },process.env.REFRESH_TOKEN_SECRET,{expiresIn:"90d"})
            res.cookie("jwt",refreshToken,{
                httpOnly:true,
                secure:true,
                sameSite:"None",
                maxAge: 90*24*60*60*1000
            })
            res.json({accessToken,email:foundUser.email,role: foundUser.role})
    })

    const refresh = asyncHandler(async (req, res, next) => {
        const cookies = req.cookies;
        if (!cookies?.jwt) {
            return next(new AppError('Unauthorized', 401));
        }
        const refreshToken = cookies.jwt;
    
        jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET, async (err, decoded) => {
            if (err) return next(new AppError('Forbidden', 403));
    
            const foundUser = await User.findById(decoded.UserInfo.id).exec();
            if (!foundUser) return next(new AppError('Unauthorized', 401));
    
            const accessToken = jwt.sign({
                UserInfo: {
                    id: foundUser._id
                }
            }, process.env.ACCESS_TOKEN_SECRET, { expiresIn: "60d" });
    
            res.json({ accessToken });
        });
    });
  
         
    
    const logout = asyncHandler(async (req, res, next) => {
        const cookies = req.cookies;
        if (!cookies?.jwt) return res.sendStatus(204);
    
        res.clearCookie("jwt", {
            httpOnly: true,
            sameSite: "None",
            secure: true,
        });
    
        res.json({ msg: "Cookie cleared, logged out successfully" });
    });
    
    module.exports={
        register,
        login,
        refresh,
        logout,
       
    }