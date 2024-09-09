import mongoose from 'mongoose';
import { v4 as uuidv4 } from 'uuid';
const { Schema } = mongoose;

const entrySchema = new Schema({
  entryId: {
    type: String,
    required: true,
    unique: true,
    default: () => uuidv4(),
  },
  userId:{
    type: String,
    required: true,
  },
  facilityId: {
    type: String,
    required: true,
    trim: true,
  },
  subDistrictId: {
    type: String,
    required: true,
    trim: true,
  },
  districtId: {
    type: String,
    required: true,
    trim: true,
  },
  data: {
    uid: {
      type: String,
      required: true,
    },
    firstName: {
      type: String,
      required: true,
      trim: true,
    },
    lastName: {
      type: String,
      required: false,
      trim: true,
    },
    age: {
      type: Number,
      required: true,
    },
    sex: {
      type: String,
      required: false,
    },
    startDate: {
      type: String,
      required: true,
    },
    endDate: {
      type: String,
      required: false,
    },
    status: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: false,
    },
  },
});

const Entry = mongoose.model('Entry', entrySchema);

export default Entry;
