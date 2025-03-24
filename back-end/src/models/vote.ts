import mongoose from "mongoose";

const VoteSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, 
    ref: "User", 
    required: true 
  },

  idea: { type: mongoose.Schema.Types.ObjectId, 
    ref: "Idea", 
    required: true 
  },

  valore: { type: Number, 
    enum: [1, -1], 
    required: true 
  }
});

export const Vote = mongoose.model("Vote", VoteSchema);
