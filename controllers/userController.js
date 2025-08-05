import {  userNotificationOrderCancelledByUser } from "../htmpages/userNoticationOrderCancelledByUser.js";
import { sendUserOrderConfiramtionEmail } from "../htmpages/userOrderConfirmations.js";
import { sendNewUserAlert } from "../htmpages/sendNewUserAlert.js";
import { Products } from "../models/productData.js";
import { Stores } from "../models/storeData.js";
import { Sessions, Users } from "../models/userData.js";
import { sendStoreOrderConfiramtionEmail } from "../htmpages/storeOrderConfirmation.js";
import { storeNotificationOrderCancelledByBuyer } from "../htmpages/storeNotificationOrderCancelledByBuyer.js";




export const registerUser = async (email, username) => {
  try {
    if (!email || !username) {
      return {
        error: 'You must provide email and username',
        ok: false
      };
    }

    // Check if username exists (case-insensitive)
    const usernameExist = await Users.findOne({ 
      username: { $regex: new RegExp(`^${username}$`, 'i') } 
    });
    if (usernameExist) {
      return {
        error: 'Username already taken',
        ok: false
      };
    }

    // Check if email exists (case-insensitive)
    const emailExist = await Users.findOne({ 
      email: { $regex: new RegExp(`^${email}$`, 'i') } 
    });
    if (emailExist) {
      return {
        error: 'This email exists in our database',
        ok: false
      };
    }

    // Validate email format
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return {
        error: 'Invalid email format',
        ok: false
      };
    }

    // Create and save the new user
    const newUser = new Users({
      username: username.toLowerCase(),
      email: email.toLowerCase(),
    });

   const savedUser = await newUser.save(); // Saves to MongoDB

    // Send alert (if needed)
    await sendNewUserAlert(savedUser);

    return {
      message: 'You are now registered',
      ok: true
    };
  } catch (err) {
    console.error('Error registering user:', err);
    return {
      error: 'Server error. Please try again.',
      ok: false
    };
  }
};




// Update user
export const updateUser = async (payload) => {
  try {
    if (!payload) {
      return { ok: false, error: 'No payload' };
    }

    const {
      userId,
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


// Update user cookie
export const updateUserCookie = async (userId, isCookieAccepted)=>{
  try{
  const user = await Users.findOne({_id: userId})
  if(!user){
    return {ok: false, error: `User with the id ${userId} not found`}
  }
  user.isCookieAccepted = isCookieAccepted
  user.save()
  return {ok: true, message: 'You cookie preference has been updated', data: user}
  }catch(err){
    console.log(err)
  }
}

// Update Payment method
export const updatePaymentMethod = async (payload)=>{
  try{

    const { userId, paymentEmail, paymentMethod} = payload

     if(!userId) {
        return {ok: false, error: 'User not found'}
    }

    if(!paymentEmail || !paymentMethod) {
        return {ok: false, error: 'User did not specify payment method'}
    }

    
   const user = await Users.findOne({_id: userId})

   if(!user){
     return {ok: false, error: `User with ${userId} not found`}
   }

   user.paymentEmail = paymentEmail
   user.paymentMethod = paymentMethod
   user.save()

   return {ok: true, data: user, message: 'success'}
  }catch(err){
    console.log(err)
  }
}


// Create User Orders
export const createUserOrder = async (orders, buyerId) => {
  try {
    const buyer = await Users.findById(buyerId);
    if (!buyer) {
      return { ok: false, error: `The buyer with id ${buyerId} was not found` };
    }

    // Step 1: Group orders by storeName
    const ordersByStore = orders.reduce((acc, order) => {
      const storeName = order.storeName?.toLowerCase();
      if (storeName) {
        if (!acc[storeName]) acc[storeName] = [];
        acc[storeName].push(order);
      }
      return acc;
    }, {});

    // Step 2: Process each store's orders
    for (const [storeName, storeOrders] of Object.entries(ordersByStore)) {
      // 2a. Update seller in Stores collection
      const sellerStore = await Stores.findOne({ storeName });
      if (!sellerStore) {
        console.warn(`Seller store not found for "${storeName}"`);
        continue;
      }

      // Add new orders to currentOrders while preserving existing ones
      sellerStore.orders.currentOrders = [
        ...sellerStore.orders.currentOrders,
        ...storeOrders.map(order => ({
          ...order,
          orderStatus: order.orderStatus, // Ensure new orders have initial status
          createdAt: new Date()
        }))
      ];

      sellerStore.markModified('orders');
      await sellerStore.save();

      // 2b. Update seller store in Users collection
     const sellerInUsers = await Users.findOne({ 'store.storeName': new RegExp(`^${storeName}$`, 'i') });
      if (sellerInUsers?.store) {
        sellerInUsers.store.orders.currentOrders = [
          ...sellerInUsers.store.orders.currentOrders,
          ...storeOrders.map(order => ({
            ...order,
            orderStatus: order.orderStatus,
            createdAt: new Date()
          }))
        ];
        sellerInUsers.markModified('store.orders');
        const updatedSeller = await sellerInUsers.save();
        sendStoreOrderConfiramtionEmail(updatedSeller)
      }
       
      // 2c. Add store orders to buyer's order history
      buyer.orders.push(...storeOrders.map(order => ({
        ...order,
        orderStatus: order.orderStatus,
        createdAt: new Date()
      })));
    }

    // Step 3: Clear buyer's cart and save updates
    buyer.cart = [];
    buyer.markModified('orders');
    buyer.markModified('cart');
    const updatedBuyer = await buyer.save();
    if(updatedBuyer){
      sendUserOrderConfiramtionEmail(updatedBuyer)
    }

    return { 
      ok: true, 
      message: 'Your order has been placed', 
      data: updatedBuyer 
    };

  } catch (err) {
    console.error('Order Update Error:', err);
    return { 
      ok: false, 
      error: 'An error occurred while placing the order.',
      details: err.message 
    };
  }
};


// Delete user order
export const deleteUserOrder = async (userId, orderId, reason) => {
  try {
    const user = await Users.findOne({ _id: userId });
    if (!user) {
      return { ok: false, error: `No user with id ${userId} found` };
    }

    const userOrders = user.orders || [];
    if (userOrders.length === 0) {
      return { ok: false, error: 'You have not ordered anything' };
    }

    const orderExists = userOrders.find((order) => order._id === orderId);
    if (!orderExists) {
      return { ok: false, error: `No order with orderId ${orderId} found` };
    }


    const storeName = orderExists.storeName;

    // Remove from Stores collection
    const storeInStores = await Stores.findOne({ storeName: storeName });
    if (storeInStores) {
      const currentOrdersInStores = storeInStores.orders.currentOrders || [];
      storeInStores.orders.currentOrders = currentOrdersInStores.filter(
        (order) => order._id !== orderId
      );
      storeInStores.markModified('orders');
      await storeInStores.save();
    }

    // Remove from Users collection (the store owner's embedded store)
    const storeInUsers = await Users.findOne({ 'store.storeName': storeName });
    if (storeInUsers?.store?.orders) {
      const currentOrdersInUsers = storeInUsers.store.orders.currentOrders || [];
      storeInUsers.store.orders.currentOrders = currentOrdersInUsers.filter(
        (order) => order._id !== orderId
      );
      storeInUsers.markModified('store');
      await storeInUsers.save();
      storeNotificationOrderCancelledByBuyer(user, storeInUsers, orderExists, reason) // We inform seller
    }

    
    // Remove from buyer's orders
    user.orders = userOrders.filter((order) =>order._id !== orderId);

    user.markModified('orders');
    const updatedUser = await user.save();
    if(updatedUser){
      
      userNotificationOrderCancelledByUser(updatedUser, orderExists, reason)
    }

    return {
      ok: true,
      message: 'Your order has been deleted successfully',
      data: updatedUser,
    };
  } catch (err) {
    console.error('Error deleting order:', err);
    return { ok: false, error: 'An error occurred while deleting the order' };
  }
};



// Delete user
export const deleteUser = async (userId)=>{
  try{
  const user = await Users.findOne({_id: userId})
  if(!user){
    return {ok: false, error: `No user with id ${userId} found`}
  }
  
  const userStore = user.store
  if(userStore){
    return {ok: false, error: 'You must first delete your store'}
  }

  await Products.deleteMany({userId: userId})
  await Stores.deleteOne({userId: userId})
  await Sessions.deleteOne({userId: userId})
  await Users.findByIdAndDelete(userId)

  return {ok: true, message: 'Your account has been deleted successfully'}
}catch(err){
  console.log('Error:', err)
}
}