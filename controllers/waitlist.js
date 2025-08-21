import { sendNewWaitlistUserAlert } from "../htmpages/newWaitlistUser.js"
import { Waitlists } from "../models/waitlist.js"

export const getWaitlist = async (payload)=>{
   const {email} = payload

   const newWaitlist = new Waitlists({
     email: email
   })
   const savedWaitlist = await newWaitlist.save()
   if(savedWaitlist){
    const user = savedWaitlist
    sendNewWaitlistUserAlert(user)
    return {ok: true, message: "We have received your email. Thank you ."}
   }
   return {ok: false, error: 'Unable to save new waitlist'}
}