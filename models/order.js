
import { timeStamp } from 'console'
import mongoose from 'mongoose'



const orderSchema = mongoose.Schema({
     productId: {type: mongoose.Schema.Types.ObjectId},
     buyerId : {type: String, default: ''},
      imageUrls: {type: [String], default: []},
      addedBy : {type: String, default: ''},
      buyerName: {type: String, default: ''},
      buyerEmail: {type: String, default: ''},
      buyerPhone : {type: String, default: ''},
      buyerAddress : {type: String, default: ''},
      eta : {type: String, default: ''},
      colors: {type: [String], default: []},
      productName: {type: String, default: ''},
      price: {type: Number, default: 0, min: 0},
      deliveryFee : {type: String, default: ''},
      paymentMethod: {type: String, default: ''},
      paymentStatus : {type: String, default: 'unpaid'},
      condition: {type: String, default: ''},
      deliveryMethod: {type: String, default: ''},
      quantity: {type: Number, default: 0},
      unitCost: {type: Number, default: 1},
      selectedSize: {type: String, default: ''},
      selectedColor: {type: String, default: ''},
      category: {type: String, default: ''},
      description: {type: String, default: ''},
      storeId: {type: mongoose.Schema.Types.ObjectId},
      storeName: {type: String, default: ''},
      storePhone: {type: String, default: ''},
      storeAddress: {type: String, default: ''},
      storeCity: {type: String, default: ''},
      storeState: {type: String, default: ''},
      reviews: {type: [String], default: []},
      return: {type: String, default: ''},
      star: {type: Number, default: 5, min: 1},
      totalVotes: {type: Number, default: 5, min: 0},
      isAdded: {type: Boolean, default: false},
      orderStatus: {type: String, default: 'pending'},
      
},
{ timestamps: true}
)

export const Orders = mongoose.model('orders', orderSchema)