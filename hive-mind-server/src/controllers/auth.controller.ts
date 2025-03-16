import { APIResponse, Status } from "../utils/structure";
import { Request, Response } from "express";
import { User } from "../models/user";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import {registerSchema, validateInput, loginSchema} from "../utils/validators";

dotenv.config();

export const register = async (req: Request, res: Response) => {
    try {
    
      if (!validateInput(registerSchema, req.body, res)) return;

      const { name, surname, username, password, email, birthdate, gender }: { name: string; surname: string; username: string; password: string; email: string; birthdate: Date; gender: string; } = req.body;


      const userExists = await User.findOne({ $or: [{ email }, { username }] });
  
      if (userExists) {
           res.status(400).send(new APIResponse(Status.ERROR, [], "Username o email gia' utilizzati.")); return
      }
  
      
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(password, salt);
  
      
      const newUser = new User({ name, surname, email, username, password: hashedPassword, birthdate, gender });
      await newUser.save();
  
      
      const token: string = jwt.sign({ id: newUser._id, email: newUser.email, username: newUser.username}, process.env.JWT_SECRET as string, { expiresIn: '24h' });
  
  
      const userResponse = { id: newUser._id, email, username };
      res.status(201).send(new APIResponse(Status.SUCCESS, { token, userResponse }, "Utente creato con successo"));
  
    } catch (err) {
      console.error("Errore nella creazione dell'utente:", err);
      res.status(500).send(new APIResponse(Status.ERROR, [], "Errore nella creazione di un nuovo utente"));
    }

  };
  

export const login = async (req: Request, res: Response) => {
  try {

    if (!validateInput(loginSchema, req.body, res)) return;

    const {email, password} = req.body;

    const user = await User.findOne({ email });

    if (!user || await bcrypt.compare(password, user.password)) {
        res.status(404).send(new APIResponse(Status.ERROR, [], "Email o password errati"));
        return
    }

    
    const token: string = jwt.sign({ id: user._id, email: user.email, username: user.username}, process.env.JWT_SECRET as string, { expiresIn: '1h' });

    
    const userResponse = { id: user._id, email: user.email, username: user.username};
    res.status(200).send(new APIResponse(Status.SUCCESS, { token, userResponse }, "Login effettuato con successo"));

  } catch (err) {
    console.error("Errore nel login:", err);
    res.status(500).send(new APIResponse(Status.ERROR, [], "Errore nel login"));
  }
};

