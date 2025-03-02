import mongoose from "mongoose";

const MIN_AGE = 14;
const MAX_AGE = new Date();

const UserSchema = new mongoose.Schema({
  name: { type: String, 
    required: true, 
    trim: true,
    match: /^[a-zA-Z]+$/ 
  },

  surname: { type: String, 
    required: true, 
    trim: true,
    match: /^[a-zA-Z]+$/ 
  },

  email: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    lowercase: true,
    match: /^[^\s@]+@[^\s@]+\.[^\s@]+$/ // ✅ Controlla che l'email abbia il formato corretto
  },
  username: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    match: /^[a-zA-Z0-9_]{3,20}$/ // ✅ Solo lettere, numeri e underscore (3-20 caratteri)
  },
  password: { type: String, 
    required: true, 
    minlength: 12 
  },
  
  birthdate: { type: Date, 
    required: true
  },
  gender: {
    type: String,
    required: true,
    enum: ["male", "female", "other"] // ✅ Limita i valori accettati
  },
  profileImage: { type: String, default: "images/deafult_image.png" }
});

export const User = mongoose.model("User", UserSchema);
