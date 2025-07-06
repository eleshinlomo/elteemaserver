import { Products } from "../models/productData.js"
import { updateUserStoreItems } from "./store.js"
import path from 'path'
import fs from 'fs/promises'; // Using promises for async operations
import { Stores } from "../models/storeData.js";
import { Users } from "../models/userData.js";
import { cleanImagePath, getImageFilesystemPath } from "../utils.js";


export const createProduct = async (payload) => {

  
  try {
    const {
      userId,
      addedBy,
      imageUrls,
      colors,
      productName,
      price,
      condition,
      deliveryMethod,
      quantity,
      sizes,
      category,
      description,
    } = payload;

    // Check if user exists
    const user = Users.find((u)=>u.id === Number(userId));
    console.log('USER', user, 'USERID', userId)
    if (!user) return { ok: false, error: "User not found" };

    // A check to see if product exists (with optional chaining)
    const store = user.store
    if(!store) return {ok: false, error: `Store not found for ${user.username}`}
    const items = store?.items || []
    let productExist = false

    if(items?.length > 0){
    productExist = items.some(
      (product) =>
        product?.productName?.trim().toLowerCase() ===
        productName.trim().toLowerCase()
    );

  }

  if (productExist) {
      return {
        ok: false,
        error: "A product with the same name already exists.",
      };
    }

    // New productId (with fallback if no store/items)
    const maxId = items?.length > 0
      ? Math.max(...items.map((product) => {
        if(product){
          return product.productId
        }else{
          return 0
        }
  }))
      : 0;
 

    const newProductId = maxId + 1;

    const newProduct = {
      userId,
      productId: newProductId,
      images: imageUrls,
      addedBy,
      colors: Array.isArray(colors) ? colors : [colors],
      productName,
      price: Number(price),
      condition,
      deliveryMethod,
      quantity: Number(quantity),
      sizes,
      income: 0,
      category,
      description,
      storeName: store.storeName, 
      storePhone: store.phone,
      storeCity: store.city,
      storeState: store.state,
      reviews: [],
      star: 5,
      totalVotes: 5,
      numOfItemsSold: 0,
      totalSales: 0,
      isAdded: false,
      orderStatus: "",
      productPageVisits: 0,
      createdAt: new Date().toISOString(),
    };
    
    Products.push(newProduct)
    const updatedUser = updateUserStoreItems(userId, newProduct); //Returns updated user object
    if (!updatedUser) {
      return {
        ok: false,
        error: "Unable to update user store with new Item",
      };
    }

    return {
      ok: true,
      message: "Product was added to your store",
      data: updatedUser,
    };
  } catch (error) {
    console.error("Error creating product:", error);
    return {
      ok: false,
      error: "Internal server error",
    };
  }
};



export const updateProduct = async (payload) => {
  try {
    const {
      userId,
      productId,
      addedBy,
      imageUrls,
      colors,
      productName,
      price,
      condition,
      deliveryMethod,
      quantity,
      sizes,
      category,
      description,
    } = payload;

    // Check if user exists
    const user = Users.find((u) => u.id === Number(userId));
    if (!user) return { ok: false, error: "User not found" };

    // Check if store exists
    const store = user.store;
    if (!store) return { ok: false, error: `Store not found for ${user.username}` };
    
    // Find product index in user's store items
    const productIndex = store.items?.findIndex(
      (product) => product?.productId === Number(productId)
    );

    if (productIndex === -1 || !store.items?.[productIndex]) {
      return { ok: false, error: "Product not found in store" };
    }

    // Create updated product
    const updatedProduct = {
      ...store.items[productIndex], // Keep existing properties
      colors: colors || store.items[productIndex].colors,
      productName: productName || store.items[productIndex].productName,
      price: Number(price) || store.items[productIndex].price,
      condition: condition || store.items[productIndex].condition,
      deliveryMethod: deliveryMethod || store.items[productIndex].deliveryMethod,
      quantity: Number(quantity) || store.items[productIndex].quantity,
      sizes: sizes || store.items[productIndex].sizes,
      category: category || store.items[productIndex].category,
      description: description || store.items[productIndex].description,
      updatedAt: new Date().toISOString(),
    };

    // Update the specific product in the user's store
    store.items[productIndex] = updatedProduct;

    // Update in global Products array (if needed)
    const globalProductIndex = Products.findIndex(
      (p) => p.productId === Number(productId)
    );
    if (globalProductIndex !== -1) {
      Products[globalProductIndex] = updatedProduct;
    }

    // Update user in Users array
   const updatedUser = updateUserStoreItems(userId, updatedProduct)
     if (!updatedUser) {
      return {
        ok: false,
        error: "Unable to update user store with new Item",
      };
    }

    return {
      ok: true,
      message: "Product was updated in your store",
      data: updatedUser, // Return the updated user
    };
  } catch (error) {
    console.error("Error updating product:", error);
    return {
      ok: false,
      error: "Internal server error",
    };
  }
};



// Delete product
export const deleteProduct = async (userId, productId) => {
  try {
    // Find user
    const userIndex = Users.findIndex((user) => user.id === userId);
    if (userIndex === -1) {
      return { ok: false, error: `User with ID ${userId} not found` };
    }

    // Get user's store
    const userStore = Users[userIndex].store;
    if (!userStore?.items) {
      return { ok: false, error: `Store not found for user ${userId}` };
    }

    // Find product
    const productIndex = userStore.items.findIndex((p) => p.productId === productId);
    if (productIndex === -1) {
      return { ok: false, error: `Product with ID ${productId} not found` };
    }

    const productToDelete = userStore.items[productIndex];

    // Handle image deletion
    if (productToDelete.images) {
      const imagesToDelete = Array.isArray(productToDelete.images)
        ? productToDelete.images
        : [productToDelete.images];

      await Promise.all(
        imagesToDelete.map(async (imagePath) => {
          if (!imagePath) return;

          try {
            const cleanPath = cleanImagePath(imagePath);
            const filePath = getImageFilesystemPath(cleanPath);
            
            await fs.unlink(filePath);
            console.log(`Deleted image: ${cleanPath}`);
          } catch (err) {
            // Ignore "file not found" errors
            if (err.code !== 'ENOENT') {
              console.error(`Error deleting image ${imagePath}:`, err);
            }
          }
        })
      );
    }

    // Remove product from store
    Users[userIndex].store?.items.splice(productIndex, 1);
    const updatedProducts = getAllProducts() // We need to also return updated products

    Products.splice(productIndex, 1)

    return { 
      ok: true, 
      message: 'Product deleted successfully',
      data: {updatedUser: Users[userIndex], products: updatedProducts }
    };

  } catch (err) {
    console.error('Error in deleteProduct:', err);
    return { 
      ok: false, 
      error: 'Failed to delete product',
      details: err.message 
    };
  }
};


// Get all stores
export const getAllProducts = ()=>{
 
  return {ok: true, message: Products}
 
}
