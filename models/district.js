import mongoose from 'mongoose';

const { Schema } = mongoose;
const districtSchema = new Schema({  
    districtId: {
        type: String,
        required: true,
        unique: true,
    },
    districtName: {
      type: String,
      required: true,
      trim: true,
    },
  });
  
  const District = mongoose.model("District", districtSchema);

  export default District;
