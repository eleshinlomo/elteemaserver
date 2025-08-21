import { Waitlists } from "../models/waitlist.js"

export const getWaitlist = async (payload)=>{
   const {email, interest} = payload
   console.log(email, interest)

   const newWaitlist = new Waitlists({
     email: email
   })
   const savedWaitlist = await newWaitlist.save()
   if(savedWaitlist){
    return {ok: true, message: "We have received your email. Thank you ."}
   }
   return {ok: false, error: 'Unable to save new waitlist'}
}