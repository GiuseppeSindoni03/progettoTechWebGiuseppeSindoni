import mongoose from "mongoose";
import { SearchType } from "./structure";





export function getIdeasPipeline(type: SearchType, page = 1, limit = 10): mongoose.PipelineStage[] {
  let filterCondition: any = {};
  let sortCondition: any = {};

  if (type === "controverse") {
      filterCondition = { 
          $expr: { 
              $lte: [
                  { $abs: "$voteDifference" }, 
                  { $multiply: [{ $max: ["$totalUpvotes", "$totalDownvotes"] }, 0.1] } 
              ]
          }
      };
      sortCondition = { totalVotes: -1 };
  } else if (type === "unpopular") {
      filterCondition = {
          $expr: {
              $and: [
                  { $lt: ["$voteDifference", 0] },
                  { $gt: [{ $abs: "$voteDifference" }, { $multiply: ["$totalDownvotes", 0.3] }] }
              ]
          }
      };
      sortCondition = { voteDifference: 1, totalDownvotes: -1 };
  } else if (type === "mainstream") {
      filterCondition = {
        $expr: {
          $and: [
              { $gt: ["$voteDifference", 0] },
              { $gt: [{ $abs: "$voteDifference" }, { $multiply: ["$totalUpvotes", 0.3] }] }
          ]
      }
      };
      sortCondition = { voteDifference: -1, totalUpvotes: -1 };
  } else if (type === "newest") {
      filterCondition = {};
      sortCondition = { timestamp: -1 };
  }

  return [
    // 🔹 Filtra idee dell'ultima settimana
    { $match: { timestamp: { $gte: new Date(new Date().setDate(new Date().getDate() - 7)) } } },

    // 🔹 Calcola il numero totale di voti e il bilancio dei voti
    { 
        $addFields: { 
            totalVotes: { $add: ["$upvotes", "$downvotes"] }, 
            voteDifference: { $subtract: ["$upvotes", "$downvotes"] }
        }
    },

    // 🔹 Uniamo l'autore con la sua collezione
    { 
        $lookup: {
            from: "users",
            localField: "author",
            foreignField: "_id",
            as: "authorInfo"
        }
    },
    { $unwind: "$authorInfo" },

    // 🔹 Proiettiamo solo i campi necessari
    { 
        $project: { 
            _id: 1, 
            title: 1, 
            contentMarkdown: 1, // ✅ Usa `contentMarkdown` per il testo originale
            contentHtml: 1, // ✅ Usa `contentHtml` per la versione formattata
            upvotes: 1, 
            downvotes: 1,  
            timestamp: 1,
            comments: 1,
            author: { username: "$authorInfo.username", id: "$authorInfo._id" }, 
            profileImage: "$authorInfo.profileImage"

        } 
    },

    // 🔹 Applica il filtro dinamico in base alla categoria scelta
    { $match: filterCondition },
    { $sort: sortCondition },

    // 🔹 Gestione della paginazione
    { $skip: (page - 1) * limit },
    { $limit: limit }
];
}
