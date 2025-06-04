import { sendNewUserAlert } from "../htmpages/sendNewUserAlert.js";
import { Users } from "../models/userData.js";


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
  const maxId = Users.length > 0 ? Math.max(...Users.map((user)=>user.id)) : 0

  const newUser = {
    id: id,
    userId: maxId + 1,
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
    orders: [], //When items in the cart are paid for, they move to orders.
    gender: '',
    city: '',
    store: {name: '', logo: '', items: []},
    state: '',
    isNewsletter: true,
    
  }

  Users.push(newUser)
  const user = Users.find((u)=>u.email === email)
  if(user){
    sendNewUserAlert(user)
    console.log('NEW USER', user)
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

    console.log('PAYLOAD', payload)
    const {
        username,
        firstname,
        lastname,
        email,
        phone,
        address,
        gender,
        city,
        state
      } = payload
   let userIndex = Users.findIndex((user)=>user.id === id)

   if(userIndex === -1){
     return {ok: false, error: `User with ${id} not found`}
   }

   const updatedUser = {...Users[userIndex], username: username, firstname: firstname, lastname: lastname, email: email, 
    phone: phone, address: address, city: city, state: state, gender: gender}
    // Save new user to the database
    Users[userIndex] = updatedUser

   return {ok: true, data: updatedUser, message: 'success'}
  }catch(err){
    console.log(err)
  }
}