import { timeStamp } from 'console'
import mongoose from 'mongoose'
//  Product


const productSchema = mongoose.Schema({
     productId: {type: mongoose.Schema.Types.ObjectId},
     userId: {type: mongoose.Schema.Types.ObjectId},
      imageUrls: {type: [String], default: []},
      addedBy : {type: String, default: ''},
      eta : {type: String, default: ''},
      colors: {type: [String], default: []},
      productName: {type: String, default: ''},
      price: {type: Number, default: 0, min: 0},
      condition: {type: String, default: ''},
      deliveryMethod: {type: String, default: ''},
      quantity: {type: Number, default: 0},
      unitCost: {type: Number, default: 1},
      shoeSizes: {type: [String], default: []},
      clotheSizes: {type: [String], default: []},
      income: {type: Number, default: 0, min: 0},
      category: {type: String, default: ''},
      description: {type: String, default: ''},
      storeId: {type: mongoose.Schema.Types.ObjectId},
      storeName: {type: String, default: ''},
      storePhone: {type: String, default: ''},
      storeCity: {type: String, default: ''},
      storeState: {type: String, default: ''},
      reviews: {type: [String], default: []},
      star: {type: Number, default: 5, min: 1},
      totalVotes: {type: Number, default: 5, min: 0},
      numOfItemsSold: {type: Number, default: 0},
      totalSales: {type: Number, default: 0},
      isAdded: {type: Boolean, default: false},
      orderStatus: {type: String, default: ''},
      productPageVisits: {type: Number, default: 0},
    
},
{ timestamps: true}
)

export const Products = mongoose.model('products', productSchema)