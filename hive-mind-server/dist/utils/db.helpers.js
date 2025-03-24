"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getIdeasPipeline = void 0;
function getIdeasPipeline(type, page = 1, limit = 10) {
    let filterCondition = {};
    let sortCondition = {};
    if (type === "controverse") {
        filterCondition = {
            $expr: {
                $lte: [
                    { $abs: "$voteDifference" },
                    { $multiply: [
                            { $max: ["$upvotes", "$downvotes"] }, 0.2
                        ] }
                ]
            }
        };
        sortCondition = { totalVotes: -1 };
    }
    else if (type === "unpopular") {
        filterCondition = {
            //$expr: { $lt: ["$voteDifference", 0] }
            $expr: {
                $and: [
                    { $lt: ["$voteDifference", 0] },
                    { $gt: [
                            { $abs: "$voteDifference" },
                            { $multiply: ["$downvotes", 0.2] }
                        ] }
                ]
            }
        };
        sortCondition = { voteDifference: 1, totalDownvotes: -1 };
    }
    else if (type === "mainstream") {
        filterCondition = {
            //$expr: { $gt: ["$voteDifference", 0] }
            $expr: {
                $and: [
                    { $gt: ["$voteDifference", 0] },
                    { $gt: [{ $abs: "$voteDifference" }, { $multiply: ["$upvotes", 0.2] }] }
                ]
            }
        };
        sortCondition = { voteDifference: -1, upvotes: -1 };
    }
    else if (type === "newest") {
        filterCondition = {};
        sortCondition = { timestamp: -1 };
    }
    return [
        //  Filtra idee dell'ultima settimana
        { $match: {
                timestamp: { $gte: new Date(new Date().setDate(new Date().getDate() - 7)) }
            }
        },
        //  Calcola il numero totale di voti e il bilancio dei voti
        {
            $addFields: {
                upvotes: { $ifNull: ["$upvotes", 0] },
                downvotes: { $ifNull: ["$downvotes", 0] },
                voteDifference: { $subtract: [{ $ifNull: ["$upvotes", 0] }, { $ifNull: ["$downvotes", 0] }] }
            }
        },
        { $match: filterCondition },
        // Uniamo l'autore con la sua collezione
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
                contentHtml: 1,
                upvotes: 1,
                downvotes: 1,
                timestamp: 1,
                comments: 1,
                author: {
                    _id: "$authorInfo._id",
                    username: "$authorInfo.username",
                    profileImage: "$authorInfo.profileImage"
                }
            }
        },
        // Applica il filtro dinamico in base alla categoria scelta
        { $sort: sortCondition },
        // Gestione della paginazione
        { $skip: (page - 1) * limit },
        { $limit: limit }
    ];
}
exports.getIdeasPipeline = getIdeasPipeline;
