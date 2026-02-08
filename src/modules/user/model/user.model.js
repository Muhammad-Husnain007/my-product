import mongoose from "mongoose"
const { Schema } = mongoose;

const profileSchema = new Schema({
  currency: {
    type: String,
    required: true,
    uppercase: true,
    enum: ['USD', 'PKR', 'EUR', 'GBP', 'BHD']
  },
  country: {
    type: String,
    required: true,
    trim: true
  }
}, { _id: false });


const userSchema = new Schema({
  firstName: {
    type: String,
    required: true,
    trim: true,
    minlength: 2,
    maxlength: 30
  },

  lastName: {
    type: String,
    required: true,
    trim: true,
    minlength: 2,
    maxlength: 30
  },

  profile: profileSchema, 

  role: {
    type: String,
    enum: ['user', 'provider', 'admin', 'lurker'],
    default: 'lurker'
  },

  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true,
    index: true,
    match: [/^\S+@\S+\.\S+$/, 'Invalid email format']
  },

  phone: {
    countryCode: { type: String },
    number: { type: String }
  },

  otp: {
    type: Number,
    min: 1000,
    max: 9999
  },

  rating: {
    type: Schema.Types.ObjectId,
    ref: 'Rating'
  },

  lastLogin: {
    type: Date
  },

  card: {
    type: Schema.Types.ObjectId,
    ref: 'Card'
  },

  address: {
    type: Schema.Types.ObjectId,
    ref: 'Address'
  },

  deviceInfo: {
    type: Schema.Types.ObjectId,
    ref: 'Device'
  },

  ip: {
    type: String
  },

  del: {
    type: Boolean,
    default: false
  },

  created_at: {
    type: Date,
    default: Date.now
  },

  updated_at: {
    type: Date
  },

  deleted_at: {
    type: Date
  }
}, {
  timestamps: true 
});

userSchema.pre('save', function(next) {
  this.updated_at = new Date();
  next();
});



export const UserModel = mongoose.model('User', userSchema);
