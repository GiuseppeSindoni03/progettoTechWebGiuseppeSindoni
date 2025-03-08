"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.isOnlyLetters = exports.isBirthdateValid = exports.validateUserInputLogin = exports.validateUserInputRegister = exports.isUserAuthor = exports.isVoteValid = exports.isGenderValid = exports.validateFields = void 0;
const structure_1 = require("./structure");
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
// ✅ Validazione specifica per `gender`
const isGenderValid = (gender, res) => {
    const validGenders = ["uomo", "donna", "altro"];
    console.log(gender);
    if (!validGenders.includes(gender)) {
        res.status(400).send(new structure_1.APIResponse(structure_1.Status.ERROR, [], "Genere deve essere uomo, donna o altro"));
        return false;
    }
    return true;
};
exports.isGenderValid = isGenderValid;
function isVoteValid(vote) {
    return vote && [1, -1].includes(vote);
}
exports.isVoteValid = isVoteValid;
function isUserAuthor(foundIdeaAuthor, userId) {
    return foundIdeaAuthor.toString() === userId;
}
exports.isUserAuthor = isUserAuthor;
const validateUserInputRegister = (data, res) => {
    const { email, username, password } = data;
    if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
        res.status(400).send(new structure_1.APIResponse(structure_1.Status.ERROR, [], "Formato non valido per l'email"));
        return false;
    }
    if (username && !/^[a-zA-Z0-9_]{3,20}$/.test(username)) {
        res.status(400).send(new structure_1.APIResponse(structure_1.Status.ERROR, [], "Username deve contenere solo lettere, numeri e underscore e deve essere lungo tra 3 e 20 caratteri"));
        return false;
    }
    if (password && password.length < 12) {
        res.status(400).send(new structure_1.APIResponse(structure_1.Status.ERROR, [], "Password deve essere almeno di 12 caratteri"));
        return false;
    }
    return true;
};
exports.validateUserInputRegister = validateUserInputRegister;
const validateUserInputLogin = (data, res) => {
    const { email, password } = data;
    if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
        res.status(400).send(new structure_1.APIResponse(structure_1.Status.ERROR, [], "Formato non valido per l'email"));
        return false;
    }
    if (password && password.length < 12) {
        res.status(400).send(new structure_1.APIResponse(structure_1.Status.ERROR, [], "Password deve essere almeno di 12 caratteri"));
        return false;
    }
    return true;
};
exports.validateUserInputLogin = validateUserInputLogin;
const isBirthdateValid = (birthdate, res) => {
    const date = new Date(birthdate);
    if (isNaN(date.getTime())) {
        res.status(400).send(new structure_1.APIResponse(structure_1.Status.ERROR, [], "Formato invalido per la data di nascita. "));
        return false;
    }
    const minBirthdate = new Date();
    minBirthdate.setFullYear(minBirthdate.getFullYear() - 13); // ✅ Età minima 13 anni
    if (date > new Date()) {
        res.status(400).send(new structure_1.APIResponse(structure_1.Status.ERROR, [], "Inserisci una data di nascita valida"));
        return false;
    }
    if (date > minBirthdate) {
        res.status(400).send(new structure_1.APIResponse(structure_1.Status.ERROR, [], "Devi avere almeno 13 anni per registrarti"));
        return false;
    }
    return true;
};
exports.isBirthdateValid = isBirthdateValid;
const isOnlyLetters = (value, fieldName, res) => {
    const regex = /^[a-zA-Z\s'-]+$/;
    if (!regex.test(value)) {
        res.status(400).send({
            status: "error",
            message: `${fieldName} deve contenere solo lettere`
        });
        return false;
    }
    return true;
};
exports.isOnlyLetters = isOnlyLetters;
