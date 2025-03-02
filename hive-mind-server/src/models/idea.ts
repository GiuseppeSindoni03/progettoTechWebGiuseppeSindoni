import mongoose from "mongoose";
import { marked } from "marked";  
import { JSDOM } from "jsdom"; 
import createDOMPurify from "dompurify";

// 🔹 Configura DOMPurify per funzionare in Node.js
const window = new JSDOM("").window;
const DOMPurify = createDOMPurify(window);

const IdeaSchema = new mongoose.Schema({
  title: { 
    type: String, 
    required: true,
    trim: true,
    maxlength: 100 
  },

  content: { 
    type: String, 
    required: true,
    trim: true,
    maxlength: 400
  }, 

  contentHtml: { 
    type: String 
  },
  
  author: { 
    type: mongoose.Schema.Types.ObjectId,
    ref: "User", 
    required: true 
  }, 
    
  timestamp: { 
    type: Date, 
    default: Date.now 
  },

  comments: [{
    _id: { 
      type: mongoose.Schema.Types.ObjectId, 
      auto: true 
    },

    author: { 
      type: mongoose.Schema.Types.ObjectId, 
      ref: "User", 
      required: true 
    },

    content: { 
      type: String, 
      required: true,
      trim: true,
      maxlength: 200 
    },

    timestamp: { 
      type: Date, 
      default: Date.now 
    } 
  }],

  upvotes: { 
    type: Number, 
    default: 0 
  },

  downvotes: { 
    type: Number, 
    default: 0 
  }
});

// 📌 Middleware per convertire Markdown in HTML prima di salvare
IdeaSchema.pre("save", async function (next) { // ✅ Reso async
  if (this.content) {
    const rawHtml = await marked(this.content); // ✅ Usa await per evitare il problema della Promise
    this.contentHtml = DOMPurify.sanitize(rawHtml); // ✅ Sanitizza HTML per evitare XSS
  }
  next();
});

export const Idea = mongoose.model("Idea", IdeaSchema);
