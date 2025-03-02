"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.login = exports.register = void 0;
const structure_1 = require("../utils/structure");
const user_1 = require("../models/user");
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const dotenv_1 = __importDefault(require("dotenv"));
const validators_1 = require("../utils/validators");
dotenv_1.default.config();
const register = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { name, surname, username, password, email, birthdate, gender } = req.body;
        if (!(0, validators_1.validateFields)(res, { name, surname, username, password, email, birthdate }))
            return;
        if (!(0, validators_1.isOnlyLetters)(name, "name", res) ||
            !(0, validators_1.isOnlyLetters)(surname, "surname", res) ||
            !(0, validators_1.isGenderValid)(gender, res) ||
            !(0, validators_1.validateUserInputRegister)({ email, username, password }, res) ||
            !(0, validators_1.isBirthdateValid)(birthdate, res))
            return;
        const userExists = yield user_1.User.findOne({ $or: [{ email }, { username }] });
        if (userExists) {
            res.status(400).send(new structure_1.APIResponse(structure_1.Status.ERROR, [], "User or email already exists"));
            return;
        }
        const salt = yield bcryptjs_1.default.genSalt(10);
        const hashedPassword = yield bcryptjs_1.default.hash(password, salt);
        const newUser = new user_1.User({ name, surname, email, username, password: hashedPassword, birthdate, gender });
        yield newUser.save();
        const token = jsonwebtoken_1.default.sign({ id: newUser._id, email: newUser.email, username: newUser.username }, process.env.JWT_SECRET, { expiresIn: '24h' });
        const userResponse = { id: newUser._id, name, surname, email, username };
        res.status(201).send(new structure_1.APIResponse(structure_1.Status.SUCCESS, { token, userResponse }, "User created successfully"));
    }
    catch (err) {
        console.error("Errore nella creazione dell'utente:", err);
        res.status(500).send(new structure_1.APIResponse(structure_1.Status.ERROR, [], "Errore nella creazione di un nuovo utente"));
    }
});
exports.register = register;
const login = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b;
    try {
        const email = (_a = req.body.email) === null || _a === void 0 ? void 0 : _a.trim();
        const password = (_b = req.body.password) === null || _b === void 0 ? void 0 : _b.trim();
        if (!(0, validators_1.validateFields)(res, { email, password }))
            return;
        const user = yield user_1.User.findOne({ email });
        if (!user) {
            res.status(404).send(new structure_1.APIResponse(structure_1.Status.ERROR, [], "Email or password is incorrect"));
            return;
        }
        const isMatch = yield bcryptjs_1.default.compare(password, user.password);
        if (!isMatch) {
            res.status(400).send(new structure_1.APIResponse(structure_1.Status.ERROR, [], "Email or password is incorrect"));
            return;
        }
        const token = jsonwebtoken_1.default.sign({ id: user._id, email: user.email, username: user.username }, process.env.JWT_SECRET, { expiresIn: '1h' });
        const userResponse = { id: user._id, email: user.email };
        res.status(200).send(new structure_1.APIResponse(structure_1.Status.SUCCESS, { token, userResponse }, "User logged in successfully"));
    }
    catch (err) {
        console.error("Errore nel login:", err);
        res.status(500).send(new structure_1.APIResponse(structure_1.Status.ERROR, [], "Errore nel login"));
    }
});
exports.login = login;
