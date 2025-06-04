
import { Users } from "./models/userData.js";

export const capitalize = (text) => {
  if (text && typeof text === 'string') {
    return text.charAt(0).toUpperCase() + text.slice(1);
  }
  return text; // Return the original input if it's not a string
};

export const getStore = (username)=>{
  if(!username.trim()){
    return 'No username found'
  }
   const user = Users.find((user)=> user?.username.toLowerCase() === username.toLowerCase())
   const userStore = user.store
   if(userStore){
    return userStore
   }
   return null
}