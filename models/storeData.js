
import mongoose from "mongoose"


// Store
const storeSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId},
  bankAccountName: {type: String, default: ''},
  bankAccountNumber: {type: String, default: ''},
  bvn: {type: String, default: ''},
  addedBy: { type: String, default: '' },
  tagline: { type: String, default: '', lowercase: true },
  storeName: { type: String, default: '', lowercase: true, index: true },
  logo: { type: String, default: '' },
  phone: { type: String, default: '' },
  isVerified: { type: Boolean, default: false },
  email: { 
    type: String, 
    default: '',
    lowercase: true,
    validate: {
      validator: (v) => v === '' || /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v),
      message: 'Invalid email format'
    }
  },
  income: { 
    type: Number, 
    default: 0,
    min: 0 
  },
  revenue: {
    type: [Number],
    default: [0, 0],
    validate: {
      validator: (v) => v.length === 2,
      message: 'Revenue must contain exactly 2 values'
    }
  },
  conversion: {
    type: [Number],
    default: [0, 3.56],
    validate: {
      validator: (v) => v.length === 2,
      message: 'Conversion must contain exactly 2 values'
    }
  },
  industry: { type: String, default: '' },
  likes: {type: Number, default: 0},
  address: { type: String, default: '' },
  city: { type: String, default: '' },
  state: { type: String, default: '' },
  country: { type: String, default: '' },
  items: {
    type: [mongoose.Schema.Types.Mixed], // For flexible item structures
    default: []
  },
  orders: {
    lastOrders: { type: [mongoose.Schema.Types.Mixed], default: [] },
    currentOrders: { type: [mongoose.Schema.Types.Mixed], default: [] }
  },
  avgOrder: { 
    type: Number, 
    default: 0,
    min: 0 
  }
}, {
  timestamps: true // Adds createdAt and updatedAt automatically
});


export const Stores = mongoose.model('stores', storeSchema)

