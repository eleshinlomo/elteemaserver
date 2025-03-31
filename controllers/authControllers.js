import { Users} from "../models/data.js"
import { sendVerificationEmail } from "./emailSender.js"



const session = []
const codeSession = []





// Login Status
const checkLoginStatus = (email)=>{
  if(!email) return null

  const user = session.find((user)=>user.email === email)
  if(user){
    console.log(`User session is valid for ${user.email}`)
    console.log(`There are ${session.length} users currently logged in`)
    console.log(user)
    return user
  }


  return null
  
}


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



  const newUser = {
    "username": username.toLowerCase(),
    'email': email,
    "cart": [],
    "isLoggedIn": false,
    "role": "user",
    "createdAt": new Date()
  }

  Users.push(newUser)
  return {

      message: 'You are now registered',
      ok: true
  } 
}







// Generate Random Numbers
function getRandomInt() {
  let min = 0
  let max = 100
  return Math.floor(Math.random() * (max - min + 1));
}




const generateTwoFactCode = (email)=>{

    const generatedCode = 1234
    const user = Users.find((user)=>user.email === email)
    if(user){
      codeSession.push(generatedCode)
      return Number(generatedCode)
     
    }
    return null
    
}

export const login =   async (email) => {
  // Step 1: Check if the email is valid
  if (!email || email.trim() === '') {
    return { error: 'Please provide your email', ok: false };
  }

  console.log(email);

  // Step 2: Validate email format
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return {
      error: 'Invalid email format',
      ok: false
    };
  }

  // Step 3: Find the user by email
  const user = Users.find((user) => user.email === email);
  console.log('User exists', user || 'No user');

  if(!user){
    // Step 9: If user is not found
  return {
    error: 'Invalid credential',
    ok: false
  };
  }

  if (user) {
    const BASE_URL = process.env.BASE_URL
console.log('BASE URL', BASE_URL)
    // Step 4: Generate the verification code and prepare the email body
    const newCode = generateTwoFactCode(email);
    const verifyLink = `${BASE_URL}/api/verifycode?code=${newCode}&email=${user.email}`;
    const emailBody = `Click on the link to login: ${verifyLink}`;

    try {
      // Step 5: Send the email and check if it was accepted
      
      const senderResponse =  await sendVerificationEmail(email, emailBody)
      console.log(senderResponse);
       if(senderResponse && senderResponse.ok){
        return {
          message: `We sent a verification code to your email. \n Ensure to also check your spam to find it.`,
          ok: true
        }
      }else{
          
        return {
          message: 'Problem sending email',
          ok: true
        }
      }
      
    } catch (err) {
      // Step 8: If there's an error sending the email
      console.log(err);
      return {
        error: 'Error while sending the verification email',
        ok: false
      };
    }
  }

  
};


// Verify 2Factor Code
export const verifyTwoFactor = (code, email)=>{
       const user = Users.find((user)=>user.email === email)
       if(user && codeSession.includes(code)){
        user.isLoggedIn = true
        session.push(user)
        return 'You are authenticated'
       }
       return null
}