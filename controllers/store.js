import { Users } from "../models/userData.js"
import { Stores } from "../models/storeData.js"
import { Products } from "../models/productData.js"


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
    { userId},
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
  await Products.updateMany(
    { userId },
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
export const getSingleStore = async (storeName)=>{
  if(!storeName.trim()){
    return {ok: false, error:'No store name found'}
  }
  const store = await Stores.findOne({storeName: storeName.toLowerCase()})
  if(!store) return {ok: false, error:'No store found'}
    return {ok: true, message: store}
   
}



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



// Update Store Orders
export const updateStoreOrder = async (orders, buyerId) => {
  try {
    const buyer = await Users.findOne({ _id: buyerId });
    if (!buyer) {
      return { ok: false, error: `The buyer with id ${buyerId} was not found` };
    }

    const allStores = await Stores.find(); // Get all stores once

    for (const newOrder of orders) {
      // 1. Find the seller in Stores
      const seller = allStores.find(
        (s) => s?.storeName?.toLowerCase() === newOrder.storeName?.toLowerCase()
      );

      if (!seller) {
        console.warn('SELLER NOT FOUND for', newOrder.storeName);
        continue;
      }

      // 2. Update the seller's main store (in Stores collection)
      const confirmedSellerStore = await Stores.findOne({ _id: seller._id });
      if (!confirmedSellerStore) continue;

      if (confirmedSellerStore.orders.currentOrders.length > 0) {
        confirmedSellerStore.orders.lastOrders.push(...confirmedSellerStore.orders.currentOrders);
        confirmedSellerStore.orders.currentOrders = [];
      }

      confirmedSellerStore.orders.currentOrders.push(newOrder);
      confirmedSellerStore.markModified('orders');
      await confirmedSellerStore.save();

      // 3. Update the seller’s store *inside the Users collection*
      const sellerUser = await Users.findOne({
        'store.storeName': newOrder.storeName,
      });

      if (!sellerUser || !sellerUser.store) {
        console.warn(`Store ${newOrder.storeName} not found in any user`);
        continue;
      }

      if (sellerUser.store.orders.currentOrders.length > 0) {
        sellerUser.store.orders.lastOrders.push(...sellerUser.store.orders.currentOrders);
        sellerUser.store.orders.currentOrders = [];
      }

      sellerUser.store.orders.currentOrders.push(newOrder);
      sellerUser.markModified('store');
      await sellerUser.save();

      // 4. Add order to buyer’s orders
      buyer.orders.push(newOrder);
    }

    // Final buyer update
    buyer.markModified('orders');
    buyer.cart = [];
    buyer.markModified('cart');
    const updatedBuyer = await buyer.save();

    return { ok: true, message: 'Your order has been placed', data: updatedBuyer };

  } catch (err) {
    console.error('Order Update Error:', err);
    return { ok: false, error: 'An error occurred while placing the order.' };
  }
};




// Delete store
export const deleteStore = async (userId)=>{
  try{
  const userStore = await Stores.findOne({userId: userId})
  if(!userStore){
    return {ok: false, error: `No store with user id ${userId} found`}
  }
  
  
  await Products.deleteMany({storeId: userStore._id})
  await Users.updateOne(
    {_id: userId},
    {$unset: {store: ""}}
  )
  await Stores.deleteOne({_id: userStore._id})
  const updatedUser = await Users.findOne({_id: userId})
  
  return {ok: true, message: 'Your store has been deleted successfully', data: updatedUser}
}catch(err){
  console.log('Error:', err)
}
}