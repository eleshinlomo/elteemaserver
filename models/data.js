import mongoose from 'mongoose';

const dataSchema = new mongoose.Schema(
  {
    requests: {
      type: [
        {
          country: String,
          state: String,
          city: String,
          region: String,
          ip: String
        }
      ],
      default: []
    }
  },
  { timestamps: true }
);

export const Data = mongoose.model('Data', dataSchema);
