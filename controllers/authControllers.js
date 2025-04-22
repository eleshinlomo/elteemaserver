import { sendNewUserAlert } from "../htmpages/sendNewUserAlert.js";
import { sendSignInAlert } from "../htmpages/sendSignInAlert.js";
import { sendVerifyEmail } from "../htmpages/sendVerifyEmail.js";
import { Users} from "../models/data.js"
import jwt from 'jsonwebtoken';





let session = []
let codeSession = []
const HOME_URL = process.env.HOME_URL;







export const registerUser = (email, username)=>{

  if(!email || !username) {
   return {
    error: 'You must provide email and username',
    ok: false
   }
  }

  const usernameExist = Users.find((user)=>user.username.toLowerCase() === username.toLowerCase())
  if(usernameExist) {
    return {
      error: 'Username already taken',
      ok: false
     }
  }

  const emailExist = Users.find((user)=>user.email.toLowerCase() === email.toLowerCase())

  if(emailExist) {
    return {
      error: 'This email exists in our database',
      ok: false
     }
  }

  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return {
      error: 'Invalid email format',
      ok: false
    }
  }

  let count = 0
  const id = Number(count + 1)

  const newUser = {
    id: id,
    authCode: '0',
    "username": username.toLowerCase(),
    'email': email,
    "cart": [],
    "isLoggedIn": false,
    "type": "customer",
    "role": email === 'seun.olatunji2@gmail.com' ? "admin" : "customer",
    "service": "Petrolage Store",
    "createdAt": new Date(),
    name: 'yourname',
    phone: '23480000000',
    address: '1234 Lagos Mainland, Lagos, Nigeria',
    state: '',
    newsletter: true,
    
  }

  Users.push(newUser)
  const user = Users.find((u)=>u.email === email)
  if(user){
    sendNewUserAlert(user)
  }
  return {

      message: 'You are now registered',
      ok: true
  } 
}




const generateToken = (userId, email) => {
  return jwt.sign({ 
    id: userId,
    email: email
  }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN
  });
};





export const login = async (email) => {
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
  const user = Users.find((user) => user.email === email);
  
  if (!user) {
    return {
      error: 'Invalid credential',
      ok: false
    };
  }

  
  const newCode = generateToken(user.id, user.email);
  const updatedUser = {...user, authCode: newCode}
  session.push(updatedUser);

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




const verifyToken = (token) => {
  return jwt.verify(token, process.env.JWT_SECRET);
};




// Verify 2Factor Code
export const verifyTwoFactor = (code, email) => {
  try {
    
    const user = Users.find(user => user.email === email);
    if (!user) {
      return {error: 'user not found in Users', ok: false}
    }

    if(code === "0") return {error: 'code is 0', ok: false}

    const decoded = verifyToken(code);
    if (!decoded || decoded.email !== email) {
      return {error: 'code decoding failed', ok: false}
    }


  

    let userInSession = session.find((user)=> user.authCode === code)
    if(!userInSession){
      return {error: 'code not found in session', ok: false}
    }

    userInSession = {...userInSession, isLoggedIn: true}
    sendSignInAlert(userInSession)
    console.log('Successfully logged in', userInSession)
    return {
      ok: true,
      message: 'Authentication successful',
      user: {
        id: userInSession.id,
        authCode: userInSession.authCode,
        username: userInSession.username,
        email: userInSession.email,
        isLoggedIn: userInSession.isLoggedIn,
        cart: userInSession.cart,
        type: userInSession.type,
        createdAt: userInSession.createdAt,
        cookiesAccepted: userInSession.cookiesAccepted,
        name: user.name,
        phone: user.phone,
        address: user.address,
        state: user.state,
        newsletter: true,
      }
    };
  } catch (err) {
    console.error('Verification error:', err);
    return {error: err, ok: false};
  }
};

// Logout
export const logout = (email) => {
  // Find user index instead of the user object
  try{
  const userIndex = session.findIndex((user) => user.email === email);
  
  if (userIndex !== -1) {
    // Create a new array without the user
    const updatedSession = session.filter((user) => user.email !== email);
    session = updatedSession; // Replace the session
    console.log(' Successfully logged out')
    return {
      ok: true,
      message: 'User has been logged out successfully'
    };
  }

  return {
    ok: false,
    error: 'User not found in session'
  };
  }catch(err){
    return {ok: false, error: err}
  }
};







