"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.isUserAuthor = exports.validateFields = exports.validateInput = exports.voteSchema = exports.loginSchema = exports.registerSchema = void 0;
const structure_1 = require("./structure");
const joi_1 = __importDefault(require("joi"));
exports.registerSchema = joi_1.default.object({
    name: joi_1.default.string().pattern(/^[a-zA-Z\s'-]+$/).required().messages({
        "string.pattern.base": "Il nome deve contenere solo lettere"
    }),
    surname: joi_1.default.string().pattern(/^[a-zA-Z\s'-]+$/).required().messages({
        "string.pattern.base": "Il cognome deve contenere solo lettere"
    }),
    username: joi_1.default.string().alphanum().min(3).max(20).required().messages({
        "string.alphanum": "L'username deve contenere solo lettere e numeri",
        "string.min": "L'username deve avere almeno 3 caratteri",
        "string.max": "L'username non può superare i 20 caratteri"
    }),
    email: joi_1.default.string().email().required().messages({
        "string.email": "Formato email non valido"
    }),
    password: joi_1.default.string().min(12).required().messages({
        "string.min": "La password deve avere almeno 12 caratteri"
    }),
    birthdate: joi_1.default.date().less("now").greater("01-01-1900").required().messages({
        "date.less": "Inserisci una data di nascita valida",
        "date.greater": "La data di nascita è troppo vecchia"
    }),
    gender: joi_1.default.string().valid("uomo", "donna", "altro").required().messages({
        "any.only": "Genere deve essere uomo, donna o altro"
    })
});
// 📌 Schema per il login
exports.loginSchema = joi_1.default.object({
    email: joi_1.default.string().email().required(),
    password: joi_1.default.string().min(12).required()
});
// 📌 Schema per il voto
exports.voteSchema = joi_1.default.object({
    vote: joi_1.default.number().valid(1, -1).required()
});
// 📌 Funzione generica per validare qualsiasi input con Joi
const validateInput = (schema, data, res) => {
    const { error } = schema.validate(data, { abortEarly: false });
    if (error) {
        res.status(400).send(new structure_1.APIResponse(structure_1.Status.ERROR, [], error.details.map(err => err.message).join(", ")));
        return false;
    }
    return true;
};
exports.validateInput = validateInput;
const validateFields = (res, fields) => {
    for (const [key, value] of Object.entries(fields)) {
        if (!value || (typeof value === "string" && value.trim() === "")) {
            res.status(400).send(new structure_1.APIResponse(structure_1.Status.ERROR, [], `${key} non puo' esser vuoto`));
            return false;
        }
    }
    return true;
};
exports.validateFields = validateFields;
function isUserAuthor(foundIdeaAuthor, userId) {
    return foundIdeaAuthor.toString() === userId;
}
exports.isUserAuthor = isUserAuthor;
