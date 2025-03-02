import { APIResponse, Status} from "./structure";
import { Response } from "express";
import mongoose from "mongoose";



export const validateFields = (res: Response, fields: Record<string, any>): boolean => {
    for (const [key, value] of Object.entries(fields)) {
        if (!value || (typeof value === "string" && value.trim() === "")) {
            res.status(400).send(new APIResponse(Status.ERROR, [], `${key} cannot be empty`));
            return false;
        }
    }
    return true;
};


// ✅ Validazione specifica per `gender`
export const isGenderValid = (gender: string, res: Response) => {
    const validGenders = ["male", "female", "other"];
    if (!validGenders.includes(gender)) {
        res.status(400).send(new APIResponse(Status.ERROR, [], "Gender must be 'male', 'female', or 'other'"));
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
        res.status(400).send(new APIResponse(Status.ERROR, [], "Invalid email format"));
        return false;
    }

    if (username && !/^[a-zA-Z0-9_]{3,20}$/.test(username)) {
        res.status(400).send(new APIResponse(Status.ERROR, [], "Username must be 3-20 characters and can only contain letters, numbers, and underscores"));
        return false;
    }

    if (password && password.length < 12) {
        res.status(400).send(new APIResponse(Status.ERROR, [], "Password must be at least 12 characters long"));
        return false;
    }

    return true;
};

export const validateUserInputLogin = (data: { email?: string, password?: string }, res: Response) => {
    const { email, password } = data;

    if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
        res.status(400).send(new APIResponse(Status.ERROR, [], "Invalid email format"));
        return false;
    }

    if (password && password.length < 12) {
        res.status(400).send(new APIResponse(Status.ERROR, [], "Password must be at least 8 characters long"));
        return false;
    }

    return true;

}

export const isBirthdateValid = (birthdate: string | Date, res: Response): boolean => {
    const date = new Date(birthdate);
    if (isNaN(date.getTime())) {
        res.status(400).send(new APIResponse(Status.ERROR, [], "Invalid birthdate format"));
        return false;
    }

    const minBirthdate = new Date();
    minBirthdate.setFullYear(minBirthdate.getFullYear() - 13); // ✅ Età minima 13 anni

    if (date > new Date()) {
        res.status(400).send(new APIResponse(Status.ERROR, [], "Birthdate cannot be in the future"));
        return false;
    }

    if (date > minBirthdate) {
        res.status(400).send(new APIResponse(Status.ERROR, [], "User must be at least 13 years old"));
        return false;
    }

    return true;
};

export const isOnlyLetters = (value: string, fieldName: string, res: Response): boolean => {
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
