import { APIResponse, Status} from "./structure";
import { Response } from "express";
import Joi from "joi";


export const registerSchema = Joi.object({
    name: Joi.string().pattern(/^[a-zA-Z\s'-]+$/).required().messages({
      "string.pattern.base": "Il nome deve contenere solo lettere"
    }),
    surname: Joi.string().pattern(/^[a-zA-Z\s'-]+$/).required().messages({
      "string.pattern.base": "Il cognome deve contenere solo lettere"
    }),
    username: Joi.string().alphanum().min(3).max(20).required().messages({
      "string.alphanum": "L'username deve contenere solo lettere e numeri",
      "string.min": "L'username deve avere almeno 3 caratteri",
      "string.max": "L'username non può superare i 20 caratteri"
    }),
    email: Joi.string().email().required().messages({
      "string.email": "Formato email non valido"
    }),
    password: Joi.string().min(12).required().messages({
      "string.min": "La password deve avere almeno 12 caratteri"
    }),
    birthdate: Joi.date().less("now").greater("01-01-1900").required().messages({
      "date.less": "Inserisci una data di nascita valida",
      "date.greater": "La data di nascita è troppo vecchia"
    }),
    gender: Joi.string().valid("uomo", "donna", "altro").required().messages({
      "any.only": "Genere deve essere uomo, donna o altro"
    })
  });
  

  export const loginSchema = Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string().min(12).required()
  });
  

  export const voteSchema = Joi.object({
    vote: Joi.number().valid(1, -1).required()
  });
  

  export const validateInput = (schema: Joi.ObjectSchema, data: any, res: Response): boolean => {
    const { error } = schema.validate(data, { abortEarly: false });
    if (error) {
      res.status(400).send(new APIResponse(Status.ERROR, [], error.details.map(err => err.message).join(", ")));
      return false;
    }
    return true;
  };


export const validateFields = (res: Response, fields: Record<string, any>): boolean => {
    for (const [key, value] of Object.entries(fields)) {
        if (!value || (typeof value === "string" && value.trim() === "")) {
            res.status(400).send(new APIResponse(Status.ERROR, [], `${key} non puo' esser vuoto`));
            return false;
        }
    }
    return true;
};




export function isUserAuthor(foundIdeaAuthor: String, userId: string | undefined) {
    return foundIdeaAuthor.toString() === userId;
}



