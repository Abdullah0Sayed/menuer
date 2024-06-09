const asyncHandler = require("express-async-handler");
const crypto = require("crypto");
const jwt = require("jsonwebtoken")
const clientModel = require("../../../models/clients/clientsModel");
const bcrypt = require("bcrypt");
const ErrorApi = require("../../../utils/Errors/errorAPI");
const sendEmail = require("../../../utils/features/sendEmail")

const createToken = (payload) => {
    return jwt.sign({userID: payload} , process.env.SECRET_KEY , {expiresIn: process.env.EXPIRE_DATE})
}


exports.signup = asyncHandler(
    async (req , res , next) => {
          
        const newDoc = await clientModel.create(req.body);

        // create token 
        const token = createToken(newDoc._id);
        res.status(200).json({data: newDoc , token});
    }
)

exports.login = asyncHandler(
    async (req , res , next) => {
        console.log(req.body);
        let doc ;
        if(req.body.email) {
            doc = await clientModel.findOne({email: req.body.email})
        }
        else if (req.body.mobile) {
            doc = await clientModel.findOne({mobile: req.body.mobile})
        }
        

        if(!doc || !(await bcrypt.compare(req.body.password , doc.password))) {
            return next(new ErrorApi(`Incorrect Email/Mobile or Password` , 401))
        }

        // create token 
        const token = createToken(doc._id)
        res.status(200).json({data: doc , token});
    }
)

exports.authenticatedRoute = asyncHandler(
    async (req , res , next) => {
        

        // 1- check if token exists or not - if exist fetch it 
        let token ;
        if(req.headers.authorization) {
            token = req.headers.authorization.split(' ')[1];
        }
        if(!token) {
            return next(new ErrorApi(`you're not authenticated , try login` , 401))
        }

        // 2- verify token 
        const decode = jwt.verify(token , process.env.SECRET_KEY);
        console.log(decode);

        // 3- check if user exists or not 
        const loggedUser = await clientModel.findById(decode.userID);

        if(!loggedUser) {
            return next(new ErrorApi(`user doesn't belongs to system`));
        }

        // 4- check if user changed his password after token created 
        if(loggedUser.passwordChangedAt) {
            const passwordChangedAtBySeconds = parseInt(
                (loggedUser.passwordChangedAt.getTime()) / 1000
            )
            if(passwordChangedAtBySeconds > decode.iat) {
                return next(new ErrorApi(`User Recently Changed his password , try login again`))
            }
        }

        req.user = loggedUser;
        console.log(`Logged User ID : ${loggedUser._id}`);
        
        next();
    }
)


exports.allowedTo = ( ...roles ) => asyncHandler(
    async(req,res,next)=>{
        // check if user role in user model don't exist in roles allowed to access route 
        console.log(`User Role :- ${req.user.role}`);
        console.log(`Route Roles :- ${roles}`);
        if(!roles.includes(req.user.role)) {
            return next(new ErrorApi(`You're not allowed to access this route` , 403));
        }
        next();
    }
)



exports.forgetPassword = asyncHandler(
    async (req,res,next)=>{
        // 1. get email of user to send code to eamil 
        let user ; 
        if(req.body.email) {
            user = await clientModel.findOne({email: req.body.email});
        }
        else if (req.body.mobile) {
            user = await clientModel.findOne({mobile: req.body.mobile});
        }
        

        if(!user) {
            return next(new ErrorApi(`no user founded in database` , 404));
        }

        // 2. generate code and hash it and set hashed in db with expireTime and verified or not 
        const resetCode = Math.floor(100000 + Math.random() * 90000).toString();
        // hash code with crypto
        const hashedResetCode = crypto.createHash('sha256').update(resetCode).digest('hex');
        // save hashed code and expire time and verified or not into db 
        user.resetPasswordHashedCode = hashedResetCode;
        user.resetPasswordExpiration = Date.now() + 10 * 1000 * 60;
        user.resetPasswordVerification = false

        console.log(`reset Code : ${resetCode}`);
        // console.log(hashedResetCode);
        await user.save()
        // update row with new fields 
        const message = `Hello ${user.first_name}\nEnter This Reset Code: ${resetCode}\nThank You For looking forward to secure your email\nMENUER Team-${new Date().getFullYear}`
        
        
        try {
            await sendEmail({email: user.email , subject: `Forget Password - Reset Code (Valid in 10 Minutes)` , message})
        } catch (error) {
            console.log(error);
            // user.resetPasswordHashedCode = undefined;
            // user.resetPasswordExpiration = undefined;
            // user.resetPasswordVerification = undefined;

            // await user.save()
            // return next(new ErrorApi(error.message , 500))
        }
        
        // response send successfully 
        res.status(200).json({msg: `Email is sent to ${req.body.email} Successfully` , status: 'success'});
       
    }
)

exports.verifiedResetCode = asyncHandler(
    async (req,res,next)=> {
        // 1 get reset code from body request
        const resetCode = req.body.resetCode;
        // 2 hash reset code 
        const hashedInputResetCode = crypto.createHash('sha256').update(resetCode).digest('hex');
        // 3 get user based on hashedCode = hashedCode in Db 
        const user = await clientModel.findOne({
            resetPasswordHashedCode: hashedInputResetCode,
            resetPasswordExpiration: {$gt: Date.now()}
        }) ;
        if(!user) {
            
            return next(new ErrorApi(`Reset Code is Expired or Invalid`));
        }
        // 4 set resetVerified to be true 
        user.resetPasswordVerification = true ;
        // save changes into model 
        await user.save();
        res.status(200).json({
            status: 'success',
            msg: 'reset code is verified successfully'
        })


    }
)

exports.resetPassword = asyncHandler(
    async(req,res,next)=>{
        // 1. get email from body request 
        const user = await clientModel.findOne({email: req.body.email});
        if(!user) {
            return next(new ErrorApi(`no user founded in database for this email ${req.body.email}` , 404));
        }
        // 2. check is user.verifiedResetCode 
        if(!user.resetPasswordVerification) {
            return next(new ErrorApi(`Reset Code is Not Verified` , 400));
        }
        // 3. set new password 
        user.password = req.body.password;
        // 4. set all fields related with reset code with undefined
        user.resetPasswordHashedCode = undefined;
        user.resetPasswordExpiration = undefined;
        user.resetPasswordVerification = undefined;
        user.passwordChangedAt = Date.now();
        // 5. save current state in model 
        await user.save();
        // 6. generate token for this user after changed password 
        const token = createToken(user.__id);
        // 7. response
        res.status(200).json({token , msg: `Password is Changed Successfully to user ${req.body.email}`})

    }
)