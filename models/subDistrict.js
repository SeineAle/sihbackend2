import mongoose from 'mongoose';

const { Schema } = mongoose;
const subDistrictSchema = new Schema({  
    subDistrictId: {
        type: String,
        required: true,
        unique: true,
    },
    subDistrictName: {
      type: String,
      required: true,
      trim: true,
    },
    districtId: {
      type: String,
      required: true,
      trim: true,
    },
    districtName: {
      type: String,
      required: true,
      trim: true,
    }
  });
  
  const SubDistrict = mongoose.model("SubDistrict", subDistrictSchema);

  export default SubDistrict;