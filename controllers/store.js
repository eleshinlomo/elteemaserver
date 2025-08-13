import { Users } from "../models/userData.js"
import { Stores } from "../models/storeData.js"
import { Orders } from "../models/order.js"
import { Products } from "../models/productData.js"
import { userNoticationOrderCancelledByStore } from "../htmpages/userNotificationOrderCancelledByStore.js"
import { storeNotificationOrderCancelledByBuyer } from "../htmpages/storeNotificationOrderCancelledByBuyer.js"
import { storeNotificationOrderCancelledByStore } from "../htmpages/storeNotificationOrderCancelledByStore.js"
import { trusted } from "mongoose"


// Add Store. Store is an object
export const createStore = async (payload)=>{
    const {
        userId,
        bankAccountName,
        bankAccountNumber,
        bvn,
        tagline,
        storeName,
        logo,
        phone,
        email,
        industry,
        address,
        city,
        state,
        country
    } = payload


    const user = await Users.findOne({_id: userId})
    if(!user){
         return {ok: false, error: 'You must be signed in before creating a store.'}
    }

    if(!storeName  || !phone || !email){
       
         return {ok: false, error: 'Problem with payload'}
    }
    
    
    // A check to confirm user does not have existing store
    const existingStore = user.store
    if(existingStore){
        return {ok: false, error: 'You already have a store.'}
    }
   
    const newStore = new Stores({
        tagline: tagline.toLowerCase(),
        userId: user._id,
        storeName: storeName.trim().toLowerCase(),
        bankAccountName: bankAccountName,
        bankAccountNumber: bankAccountNumber,
        bvn: bvn,
        addedBy: user.username,
        logo: logo,
        phone: phone || 'Not available',
        email: email.toLowerCase(),
        income: 0, //Amount earned to be withdrawn into the bank
        revenue: [0, 0], // Represent last and current value of total income
        conversion: [0, 3.56], // Represent last and current Conversion rate
        industry,
        address,
        city,
        state,
        country,
        items: [],
        orders:{lastOrders: [], currentOrders: []}, //Current must be moved to last orders when updating
        avgOrder: 0
        
        
    })
    
    const savedStore = await newStore.save()
    // update user with the new store
    user.store = savedStore
    await user.save()
    return {ok: true, message: 'Store has been created', data: user}
}


// Update Store
export const updateStore = async (payload) => {
  const {
    userId,
    tagline,
    storeName,
    bankAccountName,
    bankAccountNumber,
    bvn,
    logo,
    phone,
    email,
    industry,
    address,
    city,
    state,
    country,
  } = payload;

  // Get user
  const user = await Users.findById(userId);
  if (!user) {
    return { ok: false, error: 'You must be signed in before updating a store.' };
  }

  const storeExist = user.store;
  if (!storeExist) {
    return { ok: false, error: 'No store found for user' };
  }



  // ✅ Update user.store nested object safely
  if (user.store) {
    if (tagline) user.store.tagline = tagline;
    if (storeName) user.store.storeName = storeName;
    if (bankAccountName) user.store.bankAccountName = bankAccountName;
    if (bankAccountNumber) user.store.bankAccountNumber = bankAccountNumber;
    if (bvn) user.store.bvn = bvn;
    if (logo) user.store.logo = logo;
    if (phone) user.store.phone = phone;
    if (email) user.store.email = email;
    if (industry) user.store.industry = industry;
    if (address) user.store.address = address;
    if (city) user.store.city = city;
    if (state) user.store.state = state;
    if (country) user.store.country = country;
    user.markModified('store');
    
  }

  const savedUser = await user.save();

  // ✅ Update the main store in `Stores` collection
  await Stores.updateOne(
    { _id: user.store?._id},
    {
      $set: {
        ...(tagline && { tagline }),
        ...(storeName && { storeName }),
        ...(logo && { logo }),
        ...(phone && { phone }),
        ...(email && { email }),
        ...(industry && { industry }),
        ...(address && { address }),
        ...(city && { city }),
        ...(state && { state }),
        ...(country && { country }),
      },
    }
  );

  // ✅ Update store fields in all user’s products

 const storeId = user.store._id
  await Products.updateMany(
    { storeId },
    {
      $set: {
        ...(storeName && { storeName }),
        ...(logo && { logo }),
        ...(phone && { phone }),
        ...(email && { email }),
        ...(industry && { industry }),
        ...(address && { address }),
        ...(city && { city }),
        ...(state && { state }),
        ...(country && { country }),
      },
    }
  );

  return {
    ok: true,
    message: 'Store has been updated',
    data: savedUser,
  };
};






// Get single store
export const getSingleStore = async (storeId)=>{
  if(!storeId){
    return {ok: false, error:'No store name found'}
  }
  const store = await Stores.findById(storeId)
  if(!store) return {ok: false, error:'No store found'}
    return {ok: true, message: store}
   
}


// Update order payment status
export const updateStoreOrderPaymentStatus = async (payload) => {
  const { orderId, status } = payload;
  const order = await Orders.findById(orderId);
  if (!order) {
    return { ok: false, error: `No order with id ${orderId} found` };
  }

  order.paymentStatus = status;
  await order.save();

  const { buyerId, storeId } = order;

  // Update order in store
  const store = await Stores.findOneAndUpdate(
    { _id: storeId.toString(), 'orders.currentOrders._id': order._id },
    { $set: { 'orders.currentOrders.$': order } },
    { new: true }
  );

  if (!store) {
    return { ok: false, error: `No store with id ${storeId} found` };
  }

  // Update order in seller's account
  const updatedSeller = await Users.findOneAndUpdate(
    { _id: store.userId.toString(), 'store.orders.currentOrders._id': order._id },
    { $set: { 'store.orders.currentOrders.$': order } },
    { new: true }
  );

  // Update order in buyer's account
  await Users.findOneAndUpdate(
    { _id: buyerId.toString(), 'orders._id': order._id },
    { $set: { 'orders.$': order } },
    { new: true }
  );

  return { ok: true, message: 'Order status updated successfully', data: updatedSeller };
};


// Update order status
export const updateStoreOrderStatus = async (payload) => {
  const { orderId, orderStatusValue } = payload;
  console.log('PAYLOAD', payload)
  const order = await Orders.findById(orderId);
  if (!order) {
    return { ok: false, error: `No order with id ${orderId} found` };
  }

  order.orderStatus = orderStatusValue;
  await order.save();

  const { buyerId, storeId } = order;

  // Update order in store
  const store = await Stores.findOneAndUpdate(
    { _id: storeId.toString(), 'orders.currentOrders._id': order._id },
    { $set: { 'orders.currentOrders.$': order } },
    { new: true }
  );

  if (!store) {
    return { ok: false, error: `No store with id ${storeId} found` };
  }

  // Update order in seller's account
  const updatedSeller = await Users.findOneAndUpdate(
    { _id: store.userId.toString(), 'store.orders.currentOrders._id': order._id },
    { $set: { 'store.orders.currentOrders.$': order } },
    { new: true }
  );

  // Update order in buyer's account
  await Users.findOneAndUpdate(
    { _id: buyerId.toString(), 'orders._id': order._id },
    { $set: { 'orders.$': order } },
    { new: true }
  );

  return { ok: true, message: 'Order status updated successfully', data: updatedSeller };
};


// Delete user order
export const deleteStoreOrder = async (storeName, orderId, buyerId, reason) => {
  try {
    const store = await Stores.findOne({ storeName: storeName });
    if (!store) {
      return { ok: false, error: `No store with storename ${storeName} not found` };
    }

    const storeOrders = store.orders.currentOrders || [];
    if (storeOrders.length === 0) {
      return { ok: false, error: 'No orders found in your store' };
    }
  
    const orderExists = storeOrders.find((order) => order._id.equals(orderId));
    if (!orderExists) {
      return { ok: false, error: `No order with orderId ${orderId} found in your store` };
    }

    // Remove from buyer's orders
    const buyer = await Users.findOne({_id: buyerId})
   
    if(!buyer){
      return {ok: false, error: `No buyer with ${buyerId} found`}
    }
     
     console.log('BUYER TO DELETE ORDER', buyer)
    buyer.orders = buyer.orders.filter((order) => !order._id.equals(orderId));
    buyer.markModified('orders');
    await buyer.save();

   

    // Remove from Stores collection
      const currentOrdersInStores = store.orders.currentOrders || [];
      store.orders.currentOrders = currentOrdersInStores.filter(
        (order) => !order._id.equals(orderId)
      );
      store.markModified('orders');
      await store.save();
    

    // Find the store owner and remove from their store orders
    const storeInUsers = await Users.findOne({ 'store.storeName': storeName });
    if(!storeInUsers){
      return {ok: false, error: `Your store was not found in Users`}
    }
  
      const currentOrdersInUsers = storeInUsers.store.orders.currentOrders || [];
      storeInUsers.store.orders.currentOrders = currentOrdersInUsers.filter(
        (order) => !order._id.equals(orderId)
      );
      storeInUsers.markModified('store');
      const updatedUser = await storeInUsers.save();
      userNoticationOrderCancelledByStore(buyer, orderExists, reason)
      storeNotificationOrderCancelledByStore(updatedUser, storeInUsers, orderExists, reason)
    

    return {
      ok: true,
      message: 'Your store order has been deleted successfully',
      data: updatedUser,
    };
  } catch (err) {
    console.error('Error deleting order:', err);
    return { ok: false, error: 'An error occurred while deleting the order' };
  }
};




// Get all stores
export const getAllStores = async () => {
  try {
    const stores = await Stores.find(); // Fetch all store documents
    return stores;
  } catch (error) {
    console.error('Error fetching stores:', error);
    return {ok: false, error: 'Could not fetch stores'};
  }
};




// Delete store
export const deleteStore = async (userId)=>{
  try{
  
  const user = await Users.findOne({_id: userId})
  if(!user){
    return {ok: false, error: `No user with id ${userId} found`}
  }

  const currentOrders = user.store.orders.currentOrders

  if(currentOrders?.length > 0){
    return {ok: false, error: 'You cannot delete a store with pending orders'}
  }

  const storeItems = user.store.items
  if(storeItems?.length > 0){
    return {ok: false, error: 'Please delete all your store items before deleting your store'}
  }


  await Products.deleteMany({storeId: user.store._id})
  await Users.updateOne(
    {_id: userId},
    {$unset: {store: ""}}
  )
  await Stores.deleteOne({_id: user.store._id})

  const updatedUser = await Users.findOne({_id: userId})
  
  
  return {ok: true, message: 'Your store has been deleted successfully', data: updatedUser}
}catch(err){
  console.log('Error:', err)
}
}