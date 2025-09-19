const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const UserSchema = new mongoose.Schema({
  displayName: { type: String },
  email: { 
    type: String, 
    required: true, 
    unique: true,
    match: /.+\@.+\..+/,
  },
  idCardNumber: {
    type: String,
    required: true,
    unique: true,
  },
  password: { type: String, required: true },
  profilePic: { type: String, default: 'https://i.pravatar.cc/150' },
  group: { type: String },
  year: { type: String },
  isProfileComplete: { type: Boolean, default: false },
  role: {
    type: String,
    enum: ['user', 'admin'],
    default: 'user',
  },
  // --- New Field ---
  savedUploads: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Upload' // Creates a reference to the Upload model
  }],
}, { timestamps: true });

// Mongoose hooks and methods
UserSchema.pre('save', async function (next) {
  if (!this.isModified('password')) {
    next();
  }
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

UserSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

module.exports = mongoose.model('User', UserSchema);