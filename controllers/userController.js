import { sendNewUserAlert } from "../htmpages/sendNewUserAlert.js";
import { Users } from "../models/data.js";


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
    'email': email.toLowerCase(),
    "cart": [],
    "isLoggedIn": false,
    "type": "customer",
    "role": 'customer',
    "service": "Petrolage Store",
    "createdAt": new Date(),
    firstname: '',
    lastname: '',
    phone: '',
    address: '',
    location: '',
    state: '',
    isNewsletter: true,
    
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


export const updateUser = (id, payload)=>{
  try{
    if(!payload) {
        return {ok: false, error: 'No payload'}
    }
    const {
        username,
        firstname,
        lastname,
        email,
        phone,
        address,
        location} = payload
   let userIndex = Users.findIndex((user)=>user.id === id)

   if(userIndex === -1){
     return {ok: false, error: `User with ${id} not found`}
   }

   const updatedUser = {...Users[userIndex], username: username, firstname: firstname, lastname: lastname, email: email, 
    phone: phone, address: address, location: location}
    // Save new user to the database
    Users[userIndex] = updatedUser

   return {ok: true, data: updatedUser, message: 'success'}
  }catch(err){
    console.log(err)
  }
}