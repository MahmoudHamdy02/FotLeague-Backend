import { Request, Response } from "express";
import passport from "passport";
import { userService } from "../services/userService";

export const authStatus = (req: Request, res: Response) => {
    res.json(req.authUser);
};

export const login = (req: Request, res: Response) => {
    const { rememberMe } = req.body;
    if (rememberMe !== undefined && rememberMe) {
        req.session.cookie.maxAge = 1000 * 60 * 60 * 24 * 30; // 1 Month
        req.session.save();
    }
    res.json({message: "Signed in"});
};

export const signup = async (req: Request, res: Response) => {
    const { email, password, name, role } = req.body;
    // TODO: Send back specific errors
    try {
        const user = await userService.createUser(email, password, name, role);

        passport.authenticate("local")(req, res, () => {
            res.status(201).json(user);
        });

    } catch (error) {
        return res.status(400).json({error: "Error creating user"});
    }
};

export const logout = (req: Request, res: Response) => {
    req.logout(err => {
        res.status(200).json({message: "Logged out", error: err});
    });
};

export * as authController from "./authController";