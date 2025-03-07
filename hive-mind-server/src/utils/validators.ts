import { APIResponse, Status} from "./structure";
import { Response } from "express";
import mongoose from "mongoose";



export const validateFields = (res: Response, fields: Record<string, any>): boolean => {
    for (const [key, value] of Object.entries(fields)) {
        if (!value || (typeof value === "string" && value.trim() === "")) {
            res.status(400).send(new APIResponse(Status.ERROR, [], `${key} non puo' esser vuoto`));
            return false;
        }
    }
    return true;
};


// ✅ Validazione specifica per `gender`
export const isGenderValid = (gender: string, res: Response) => {
    const validGenders = ["uomo", "donna", "altro"];
    console.log(gender)
    if (!validGenders.includes(gender)) {
        res.status(400).send(new APIResponse(Status.ERROR, [], "Genere deve essere uomo, donna o altro"));
        return false;
    }
    return true;
};


export function isVoteValid(vote: any) {
    return vote && [1, -1].includes(vote);
}

export function isUserAuthor(foundIdeaAuthor: String, userId: string | undefined) {
    return foundIdeaAuthor.toString() === userId;
}


export const validateUserInputRegister = (data: { email?: string, username?: string, password?: string }, res: Response) => {
    const { email, username, password } = data;

    if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
        res.status(400).send(new APIResponse(Status.ERROR, [], "Formato non valido per l'email"));
        return false;
    }

    if (username && !/^[a-zA-Z0-9_]{3,20}$/.test(username)) {
        res.status(400).send(new APIResponse(Status.ERROR, [], "Username deve contenere solo lettere, numeri e underscore e deve essere lungo tra 3 e 20 caratteri"));
        return false;
    }

    if (password && password.length < 12) {
        res.status(400).send(new APIResponse(Status.ERROR, [], "Password deve essere almeno di 12 caratteri"));
        return false;
    }

    return true;
};

export const validateUserInputLogin = (data: { email?: string, password?: string }, res: Response) => {
    const { email, password } = data;

    if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
        res.status(400).send(new APIResponse(Status.ERROR, [], "Formato non valido per l'email"));
        return false;
    }

    if (password && password.length < 12) {
        res.status(400).send(new APIResponse(Status.ERROR, [], "Password deve essere almeno di 12 caratteri"));
        return false;
    }

    return true;

}

export const isBirthdateValid = (birthdate: string | Date, res: Response): boolean => {
    const date = new Date(birthdate);
    if (isNaN(date.getTime())) {
        res.status(400).send(new APIResponse(Status.ERROR, [], "Formato invalido per la data di nascita. "));
        return false;
    }

    const minBirthdate = new Date();
    minBirthdate.setFullYear(minBirthdate.getFullYear() - 13); // ✅ Età minima 13 anni

    if (date > new Date()) {
        res.status(400).send(new APIResponse(Status.ERROR, [], "Inserisci una data di nascita valida"));
        return false;
    }

    if (date > minBirthdate) {
        res.status(400).send(new APIResponse(Status.ERROR, [], "Devi avere almeno 13 anni per registrarti"));
        return false;
    }

    return true;
};

export const isOnlyLetters = (value: string, fieldName: string, res: Response): boolean => {
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
