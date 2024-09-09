import mongoose from 'mongoose';

const { Schema } = mongoose;

const facilitySchema = new Schema({  
    facilityId: {
        type: String,
        required: true,
        unique: true,
    },
    facilityName: {
      type: String,
      required: true,
      trim: true,
    },
    subDistrictId: {
      type: String,
      required: true,
      trim: true,
    },
    subDistrictName:{
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
  
  const Facility = mongoose.model("Facility", facilitySchema);

  export default Facility;