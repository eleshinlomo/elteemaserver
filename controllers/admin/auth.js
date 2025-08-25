
import { sendSignInAlert } from "../../htmpages/sendSignInAlert.js";
import { sendVerifyEmail } from "../../htmpages/sendVerifyEmail.js";
import { Users, Sessions } from "../../models/userData.js";
import jwt from 'jsonwebtoken';

const NODE_ENV = process.env.NODE_ENV


const HOME_URL = NODE_ENV === 'development' ? process.env.ADMIN_HOME_URL : 'https://elteema.online'





const generateToken = (userId, email) => {
  return jwt.sign({ 
    id: userId,
    email: email
  }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN
  });
};





export const adminLogin = async (email) => {
  // Step 1: Check if the email is valid
  if (!email || email.trim() === '') {
    return { error: 'Please provide your email', ok: false };
  }

  // Step 2: Validate email format
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return {
      error: 'Invalid email format',
      ok: false
    };
  }

  // Step 3: Find the user by email
  const user = await Users.findOne({email: email.toLowerCase()})
  
  if (!user) {
    return {
      error: 'Invalid credential',
      ok: false
    };
  }

  
  const newCode = generateToken(user.userId, user.email);
  user.authCode = newCode
  user.save()
  
// ✅ Create or update the session
await Sessions.findOneAndUpdate(
  { email: user.email },
  {
    $set: {
      userId: user._id,
      authCode: user.authCode
    }
  },
  { upsert: true, new: true }
);


  const verifyLink = `${HOME_URL}?code=${newCode}&email=${user.email.toLowerCase()}`;
  
  try {
   

    const senderResponse = await sendVerifyEmail(user.email, verifyLink, user.username);
    
    if (senderResponse?.ok) {
      return {
        message: `We sent a verification code to your email. \n Ensure to also check your spam to find it.`,
        ok: true
      };
    } else {
      return {
        error: 'Problem sending email',
        ok: false
      };
    }
  } catch (err) {
    console.log(err);
    return {
      error: 'Error while sending the verification email',
      ok: false
    };
  }
};




export const verifyToken = (token) => {
  try{
  return jwt.verify(token, process.env.JWT_SECRET);
  }catch(err){
    console.log('JWT verify error',err)
  }
};



// Verify 2Factor Code is used for fisrst login
export const verifyTwoFactor = async (code, email) => {
  try {
    const user = await Users.findOne({ email: email.toLowerCase() });
    if (!user) {
      return { error: 'user not found', ok: false };
    }

    if (code === "0") return { error: 'code is 0', ok: false };

    const decoded = verifyToken(code);
    if (!decoded || decoded.email !== email) {
      return { error: 'code decoding failed', ok: false };
    }

    let userInSession = await Sessions.findOne({authCode: code, email: email.toLowerCase()});
    if (!userInSession) {
      return { error: 'code not found in session', ok: false };
    }

    userInSession.isLoggedIn = true;
    userInSession.save()

    user.isLoggedIn = true;
    const savedUser = await user.save()

    
    await sendSignInAlert(savedUser);
    console.log('Successfully logged in', savedUser);

    return {
      ok: true,
      message: 'Authentication successful',
      data: savedUser
    };
  } catch (err) {
    console.error('Verification error:', err);
    return { error: err, ok: false };
  }
};


// Logout.
export const logout = async (email) => {
  try {
      if(!email)return {ok: false, error: 'missing user email'}
    // Delete the session document matching the user's email
    const result = await Sessions.deleteOne({ "email": email.toLowerCase() });

    if (result.deletedCount > 0) {
      return { ok: true, message: 'User has been logged out successfully'};
    }

    return {
      ok: false,
      error: 'User not found in session'
    };
  } catch (err) {
    console.error('Logout error:', err);
    return { ok: false, error: err.message };
  }
};



// Persist authentication
export const persistLogin = async (token, email)=>{
  try{
    if(!email.trim() || !token){
      return {"ok":false, error: 'Problem with either email or token'}
    }

    const decoded = verifyToken(token)
     if (!decoded || decoded.email !== email) {
      return {error: 'code decoding failed', ok: false}
    }

    const userInSession = await Sessions.findOne({email: email, authCode: token})
    let user;
    if(!userInSession){
      return {ok: false, error: 'User not found in session'}
    }
    user = await Users.findOne({_id: userInSession.userId})
    
    
    if(user){
      user.lastLogin = new Date()
      await user.save()
      return {ok: true, message: 'User is authenticated', data: user}
    }
    
    return {ok: false, error: 'User authentication cannot be verified'}
  }catch(err){
    console.log(err)
  }
}








