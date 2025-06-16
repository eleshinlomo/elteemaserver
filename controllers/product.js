import { Products } from "../models/productData.js"
import { updateUserStoreItems } from "./store.js"
import path from 'path'
import fs from 'fs/promises'; // Using promises for async operations
import { Stores } from "../models/storeData.js";
import { Users } from "../models/userData.js";


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
    const uploadDir = path.join(process.cwd(), 'public', 'uploads', 'products');
    
    try {
        const userIndex = Users.findIndex((user) => user.id === userId);
        if (userIndex === -1) {
            return { ok: false, error: `User with ID ${userId} not found` };
        }

        const store = Users[userIndex].store;
        if (!store || !store.items) {
            return { ok: false, error: `Store not found for user ${userId}` };
        }

        const productIndex = store.items.findIndex((p) => p.productId === productId);
        if (productIndex === -1) {
            return { ok: false, error: `Product with ID ${productId} not found` };
        }

        const productToDelete = store.items[productIndex];

        // Delete associated image files
        if (productToDelete.images) {
          
          
            const imagesToDelete = Array.isArray(productToDelete.images) 
                ? productToDelete.images 
                : [productToDelete.images];

            await Promise.all(imagesToDelete.map(async (imageFilename) => {
                if (!imageFilename) return;

                const splittedPath = imageFilename.split('/')
                console.log('SPLITTED PATH', splittedPath)
                const cleanedPath = splittedPath.slice(1)
                console.log('CLEANED PATH', cleanedPath)
                
                const filePath = path.join(uploadDir, imageFilename);
                
                try {
                    await fs.unlink(filePath);
                    console.log(`Successfully deleted image ${imageFilename}`);
                } catch (err) {
                    if (err.code !== 'ENOENT') {
                        console.log(`Error deleting image ${imageFilename}:`, err);
                    }
                }
            }));
        }

        // Remove the product from the store
        store.items.splice(productIndex, 1);
        Users[userIndex].store = store
        
        console.log('Successfully deleted Product');
        return { ok: true, message: `Successfully deleted Product`, data: Users[userIndex] };
    } catch (err) {
        console.error('Error in deleteProduct:', err);
        return { ok: false, error: `Error deleting Product` };
    }
};