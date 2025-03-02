import { APIResponse, Status } from "../utils/structure";
import { Request, Response } from "express";
import { User } from "../models/user";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import { isBirthdateValid, isGenderValid, isOnlyLetters, validateFields, validateUserInputRegister } from "../utils/validators";



dotenv.config();

export const register = async (req: Request, res: Response) => {
    try {
      const { name, surname, username, password, email, birthdate, gender }: { name: string; surname: string; username: string; password: string; email: string; birthdate: Date; gender: string; } = req.body;
    
      if (!validateFields(res, { name, surname, username, password, email, birthdate })) return;


      if (
        !isOnlyLetters(name, "name", res) || 
        !isOnlyLetters(surname, "surname", res) ||
        !isGenderValid(gender, res) ||
        !validateUserInputRegister({ email, username, password }, res) ||
        !isBirthdateValid(birthdate, res)
      ) return;
      
      
      
      const userExists = await User.findOne({ $or: [{ email }, { username }] });
  
      if (userExists) {
           res.status(400).send(new APIResponse(Status.ERROR, [], "User or email already exists")); return
      }
  
      
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(password, salt);
  
      
      const newUser = new User({ name, surname, email, username, password: hashedPassword, birthdate, gender });
      await newUser.save();
  
      
      const token: string = jwt.sign({ id: newUser._id, email: newUser.email, username: newUser.username}, process.env.JWT_SECRET as string, { expiresIn: '24h' });
  
  
      const userResponse = { id: newUser._id, name, surname, email, username };
      res.status(201).send(new APIResponse(Status.SUCCESS, { token, userResponse }, "User created successfully"));
  
    } catch (err) {
      console.error("Errore nella creazione dell'utente:", err);
      res.status(500).send(new APIResponse(Status.ERROR, [], "Errore nella creazione di un nuovo utente"));
    }

  };
  

export const login = async (req: Request, res: Response) => {
  try {
    const email: string = req.body.email?.trim();
    const password: string = req.body.password?.trim();


    if (!validateFields(res, { email, password })) return;


    const user = await User.findOne({ email });

    if (!user) {
        res.status(404).send(new APIResponse(Status.ERROR, [], "Email or password is incorrect"));
        return
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
       res.status(400).send(new APIResponse(Status.ERROR, [], "Email or password is incorrect"));
       return
    }

    
    const token: string = jwt.sign({ id: user._id, email: user.email, username: user.username}, process.env.JWT_SECRET as string, { expiresIn: '1h' });

    
    const userResponse = { id: user._id, email: user.email };
    res.status(200).send(new APIResponse(Status.SUCCESS, { token, userResponse }, "User logged in successfully"));

  } catch (err) {
    console.error("Errore nel login:", err);
    res.status(500).send(new APIResponse(Status.ERROR, [], "Errore nel login"));
  }
};

