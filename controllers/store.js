import { Users } from "../models/userData.js"
import { Stores } from "../models/storeData.js"


// Add Store. Store is an object
export const createStore = async (payload)=>{
    
    const {
        userId,
        tagline,
        storeName,
        logo,
        phone,
        email,
        city,
        state
    } = payload

    console.log('STORE PAYLOAD', payload)

    const userIndex = Users.findIndex((user)=> user.id === userId)
    if(userIndex === -1){
         return {ok: false, error: 'You must be signed in before creating a store.'}
    }

    if(!storeName  || !phone || !email){
       
         return {ok: false, error: 'Problem with payload'}
    }
    
    
    // A check to confirm user does not have existing store
    const existingStore = Users[userIndex].store
    if(existingStore){
        return {ok: false, error: 'You already have a store.'}
    }
    const maxId = Stores.length > 0 
        && Math.max(...Stores.map(store => {
            if(store){
             return store.storeId //Not unique. Only trying to find the highest number of storeId
            }else{
             return 0
            }
        })) 
        

    const newStoreId = maxId + 1
    
    const newStore = {
        userId: userId, 
        addedBy: Users[userIndex].username.toLowerCase(),
        storeId: newStoreId, 
        tagline: tagline.toLowerCase(),
        storeName: storeName.trim().toLowerCase(),
        logo: logo,
        phone: phone,
        email: email.toLowerCase(),
        revenue: [0, 0], // Represent last and current sales
        conversion: [0, 3.56], // Represent last and current sales
        city,
        state,
        items: [],
        orders:{lastOrders: [], currentOrders: []}, //Current must be moved to last orders when updating
        avgOrder: 0
        
        
    }
    
   
    // update user with the new store
    Users[userIndex].store = newStore
    return {ok: true, message: 'Store has been created', data: Users[userIndex]}
}



// Update Store Items
export const updateUserStoreItems = (userId, newItem)=>{
  try{
  if(!userId){
    return 'No username found'
  }
   const user = Users.find((user)=> user.id === Number(userId))
   if(!user) return 'No user found'
    user.store.items.push(newItem)
   return user
  }catch(err){
    console.log('Error while updating user store', err)
    return {ok:false, error: 'Unable to update user store'}
  }
}




// Get user store
export const getUserStore = (username)=>{
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



// Get all stores
export const getAllStores = ()=>{
  if(Users?.length > 0){
  Users.forEach((user)=>{
    Stores.push(user.store)
  })

  return Stores
}
return []
  
}


// Get single store
export const getSingleStore = async (storeName)=>{
  if(!storeName.trim()){
    return {ok: false, error:'Please enter store name'}
  }

  const stores = await getAllStores()
  if(stores.length === 0) return {ok: false, error:'All stores are empty'}
   const store = stores.find((store)=>store.storeName.trim().toLowerCase() === storeName.trim().toLowerCase()) 
   if(store){
    return {ok: true, message: store}
   }
   
   return {ok: false, error: 'No store found'}
}

// Store Orders
export const updateStoreOrder = (items, buyerId) => {
  console.log('ITEMS', items, 'BUYER ID', buyerId);
  
  let updatedBuyer = null;
  
  items.forEach((item) => {
    // Safely handle storeName comparison
    const seller = Users.find((s) => 
      s?.store?.storeName && item?.storeName && 
      s.store.storeName.toLowerCase() === item.storeName.toLowerCase()
    );
    
    const buyer = Users.find((b) => b.id === Number(buyerId));
    
    console.log('SELLER', seller, 'BUYER', buyer);
    
    if (seller) {
      const sellerStore = seller.store;
      sellerStore.orders.lastOrders = sellerStore.orders.currentOrders;
      sellerStore.orders.currentOrders.push(item);

      // Update buyer if found
      if (buyer) {
        buyer.orders.push(item); 
        updatedBuyer = buyer;
      }
    }
  });

  return updatedBuyer 
    ? { ok: true, message: updatedBuyer } 
    : { ok: false, error: 'Error updating store order' };
};