
import { sendAbandonedCartEmail } from "../../htmpages/admin/abandonedCart.js";
import { sendCustomEmail } from "../../htmpages/admin/customEmail.js";
import { sendNewProductsAlertEmail } from "../../htmpages/admin/newProductAlert.js";
import { Users } from "../../models/userData.js";

// Mailshot
export const sendMailshot = (payload)=>{
   const {selectedUsers, messageToSend} = payload
   console.log('SELECTED USERS', payload)
   const subject = messageToSend?.subject
   const message = messageToSend?.message
   selectedUsers.forEach((user)=>{
       if(messageToSend.id === 1){
       sendCustomEmail(user, subject, message)
       }
       else if(messageToSend.id === 3){
         sendNewProductsAlertEmail(user, subject, message)
       }
       else if(messageToSend.id === 4){
         sendAbandonedCartEmail(user, subject, message)
       }

   })
   return {ok: true, message: 'Mailshot has been sent'}
}



// Update user
export const adminUpdateUser = async (payload) => {
  try {
    if (!payload) {
      return { ok: false, error: 'No payload' };
    }

    const {
      userId,
      isAdmin,
      isSuperAdmin,
      cart,
      firstname,
      lastname,
      email,
      phone,
      address,
      gender,
      city,
      state,
      country
    } = payload;

    let user = await Users.findById(userId);
    if (!user) {
      return { ok: false, error: `User with ID ${userId} not found` };
    }

    // Only update fields if they exist in the payload
    if (cart !== undefined) user.cart = cart;
    if (firstname !== undefined) user.firstname = firstname;
    if (lastname !== undefined) user.lastname = lastname;
    if (email !== undefined) user.email = email;
    if (phone !== undefined) user.phone = phone;
    if (address !== undefined) user.address = address;
    if (gender !== undefined) user.gender = gender;
    if (city !== undefined) user.city = city;
    if (state !== undefined) user.state = state;
    if (country !== undefined) user.country = country;
    if (isAdmin !== undefined && user.isAdmin) user.isAdmin = isAdmin;
    if (isSuperAdmin !== undefined && user.isSuperAdmin) user.isSuperAdmin = isSuperAdmin;

    const savedUpdatedUser = await user.save();

    return {
      ok: true,
      data: savedUpdatedUser,
      message: 'Your profile has been updated'
    };
  } catch (err) {
    console.error("Error updating user:", err);
    return { ok: false, error: "Something went wrong updating your profile" };
  }
};

// Update user cart
export const updateUserCart = async (userId, updatedCart)=>{
  const user = await Users.findOne({_id: userId})
  if(!user){
     return {ok: false, error: `No user with the ${userId} found`}
  }

  user.cart = updatedCart
  user.save()
  return {ok: true, message: 'User cart has been updated'}
}




