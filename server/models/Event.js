import mongoose from "mongoose";

const eventSchema = new mongoose.Schema({
  title: { 
    type: String, 
    required: true 
},
  date: { 
    type: Date, 
    required: true 
},
  registrationEndDate: { 
    type: Date, 
    required: true 

  },
  mode: { 
    type: String, 
    enum: ['online', 'offline', 'hybrid'], 
    required: true },
  link: { 
    type: String 

  }, // optional, if mode is online
  description: { 
    type: String },
  host: { 
    type: String, 
    required: true }, // Name of department/club/etc.
  banner: { 
    type: String 

  }, // URL or file path to image
  category: { 
    type: String 

  }, // eg. workshop, seminar
  createdBy: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User', 
    required: true 

  }, // host ID
  additionalDetails: { 
    type: String

   }
}, { timestamps: true });

export const Event = mongoose.model("Event", eventSchema);
