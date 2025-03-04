"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.isOnlyLetters = exports.isBirthdateValid = exports.validateUserInputLogin = exports.validateUserInputRegister = exports.isUserAuthor = exports.isVoteValid = exports.isGenderValid = exports.validateFields = void 0;
const structure_1 = require("./structure");
const validateFields = (res, fields) => {
    for (const [key, value] of Object.entries(fields)) {
        if (!value || (typeof value === "string" && value.trim() === "")) {
            res.status(400).send(new structure_1.APIResponse(structure_1.Status.ERROR, [], `${key} cannot be empty`));
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
        res.status(400).send(new structure_1.APIResponse(structure_1.Status.ERROR, [], "Invalid email format"));
        return false;
    }
    if (username && !/^[a-zA-Z0-9_]{3,20}$/.test(username)) {
        res.status(400).send(new structure_1.APIResponse(structure_1.Status.ERROR, [], "Username must be 3-20 characters and can only contain letters, numbers, and underscores"));
        return false;
    }
    if (password && password.length < 12) {
        res.status(400).send(new structure_1.APIResponse(structure_1.Status.ERROR, [], "Password must be at least 12 characters long"));
        return false;
    }
    return true;
};
exports.validateUserInputRegister = validateUserInputRegister;
const validateUserInputLogin = (data, res) => {
    const { email, password } = data;
    if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
        res.status(400).send(new structure_1.APIResponse(structure_1.Status.ERROR, [], "Invalid email format"));
        return false;
    }
    if (password && password.length < 12) {
        res.status(400).send(new structure_1.APIResponse(structure_1.Status.ERROR, [], "Password must be at least 8 characters long"));
        return false;
    }
    return true;
};
exports.validateUserInputLogin = validateUserInputLogin;
const isBirthdateValid = (birthdate, res) => {
    const date = new Date(birthdate);
    if (isNaN(date.getTime())) {
        res.status(400).send(new structure_1.APIResponse(structure_1.Status.ERROR, [], "Invalid birthdate format"));
        return false;
    }
    const minBirthdate = new Date();
    minBirthdate.setFullYear(minBirthdate.getFullYear() - 13); // ✅ Età minima 13 anni
    if (date > new Date()) {
        res.status(400).send(new structure_1.APIResponse(structure_1.Status.ERROR, [], "Birthdate cannot be in the future"));
        return false;
    }
    if (date > minBirthdate) {
        res.status(400).send(new structure_1.APIResponse(structure_1.Status.ERROR, [], "User must be at least 13 years old"));
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
            message: `${fieldName} can only contain letters, spaces, apostrophes, and hyphens`
        });
        return false;
    }
    return true;
};
exports.isOnlyLetters = isOnlyLetters;
