import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  name: { 
    type: String, 
    required: true 
},
  usn: { 
    type: String, 
    required: function () { return this.role === 'student'; } 
},
  email: { 
    type: String, 
    required: true, 
    unique: true 
},
  password: { 
    type: String, 
    required: true 
},
  role: { 
    type: String, 
    enum: ['student', 'host'], 
    required: true 
},
}, { timestamps: true });

export const User = mongoose.model("User", userSchema);
