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
        industry,
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
        income: 0, //Amount earned to be withdrawn into the bank
        revenue: [0, 0], // Represent last and current value of total income
        conversion: [0, 3.56], // Represent last and current Conversion rate
        industry,
        city,
        state,
        items: [],
        orders:{lastOrders: [], currentOrders: []}, //Current must be moved to last orders when updating
        avgOrder: 0
        
        
    }
    
    Stores.push(newStore)
    console.log('NEW STORE ADDED TO STORES', Stores)
    // update user with the new store
    Users[userIndex].store = newStore
    return {ok: true, message: 'Store has been created', data: Users[userIndex]}
}


// Update Store
export const updateStore = async (payload)=>{
    
    const {
        userId,
        tagline,
        storeName,
        logo,
        phone,
        email,
        industry,
        city,
        state
    } = payload

    console.log('STORE PAYLOAD', payload)

    const userIndex = Users.findIndex((user)=> user.id === userId)
    if(userIndex === -1){
         return {ok: false, error: 'You must be signed in before updating a store.'}
    }
    
    const storeExist = Users[userIndex].store
    if(!storeExist){
       return {ok: false, error: 'No store found for user'}
    }


    // update user with the new store
    Users[userIndex].store = {
      ...Users[userIndex].store, 
        tagline: tagline,
        storeName: storeName,
        logo: logo,
        phone: phone,
        email: email,
        industry: industry,
        city: city,
        state: state
      }
    return {ok: true, message: 'Store has been updated', data: Users[userIndex]}
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


// Get single store
export const getSingleStore = async (storeName)=>{
  if(!storeName.trim()){
    return {ok: false, error:'No store name found'}
  }



  const stores = await getAllStores()
  if(stores.length === 0) return {ok: false, error:'All stores are empty'}
   const store = stores.find((store)=>store?.storeName === storeName.trim().toLowerCase()) 

   
   if(store){
    return {ok: true, message: store}
   }
   
   return {ok: false, error: 'No store found'}
}



// Get all stores
export const getAllStores = ()=>{
  return Stores
}







// Update Store Orders
export const updateStoreOrder = (orders, buyerId) => {

  // Find buyer once (assuming same buyer for all orders)
  const buyerIndex = Users.findIndex((b) => b.id === Number(buyerId));
  if (buyerIndex === -1) {
    return { ok: false, error: 'User id must be provided' };
  }
   
  let sellerIndex;
  orders.forEach((newOrder)=>{
    const stores = getAllStores()
    sellerIndex = stores?.findIndex((s) => s?.storeName?.toLowerCase() === newOrder.storeName?.toLowerCase()
    );
    
  })

    if (sellerIndex === -1) {
      return {ok: false, error: 'Seller store not found'}
    }
  
   const updatedOrder = orders?.map((order)=>{
      
      // Update last orders
      if(Stores[sellerIndex].orders.currentOrders.length > 0){
        Stores[sellerIndex].orders.currentOrders.map((oldOrder)=>{
        Stores[sellerIndex].orders.lastOrders.push(oldOrder)
      })
    }
      // Update current orders
      Stores[sellerIndex].orders.currentOrders.push(order);

      // Update buyer orders
      Users[buyerIndex].orders.push(order);
      return Users[buyerIndex]
      
    })
   
    return {ok: true, message: updatedOrder[0]}

};