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
      size,
      category,
      description,
      store,
    } = payload;

    // Check if product already exists across all stores
    const productExist = Stores.some(store => 
      store.items.some(product => 
        product.productName.trim().toLowerCase() === productName.trim().toLowerCase()
      )
    );

    if (productExist) {
      return { 
        ok: false, 
        error: 'A product with the same name already exists.' 
      };
    }

    // Calculate max ID across all products in all stores
    let maxId = 0;
    Stores.forEach(store => {
      store.items.forEach(product => {
        if (product.productId > maxId) {
          maxId = product.productId;
        }
      });
    });

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
      size,
      category,
      description,
      storeName: store.name,
      storeCity: store.city,
      storeState: store.state,
      star: 5,
      totalVotes: 5,
      numOfItemsSold: 0,
      totalSales: 0,
      isAdded: false,
      orderStatus: '',
      productPageVisits: 0,
      createdAt: new Date().toISOString()
    };

    const user = updateUserStoreItems(userId, newProduct);
    if (!user) {
      return { 
        ok: false, 
        error: 'Unable to update user store with new Item' 
      };
    }

    // We update the specific store
    const storeIndex = Stores.findIndex(s => s.userId === userId);
    if (storeIndex !== -1) {
      Stores[storeIndex].items.push(newProduct);
    }

    return {
      ok: true,
      message: 'Product was added to your store',
      data: user,
    };

  } catch (error) {
    console.error('Error creating product:', error);
    return { 
      ok: false, 
      error: 'Internal server error' 
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
    const store = Users[userIndex].store;
    if (!store?.items) {
      return { ok: false, error: `Store not found for user ${userId}` };
    }

    // Find product
    const productIndex = store.items.findIndex((p) => p.productId === productId);
    if (productIndex === -1) {
      return { ok: false, error: `Product with ID ${productId} not found` };
    }

    const productToDelete = store.items[productIndex];

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
    store.items.splice(productIndex, 1);
    Users[userIndex].store = store;

    return { 
      ok: true, 
      message: 'Product deleted successfully',
      data: Users[userIndex] 
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