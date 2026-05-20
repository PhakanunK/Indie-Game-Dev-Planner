import { Request, Response, NextFunction } from "express"
import { verifyToken } from "../utils/jwt"

declare global {
    namespace Express {
        interface Request {
            userId: number
        }
    }
}

export const authenticate = (req: Request, res: Response, next: NextFunction) => {
    const auth = req.headers.authorization
    if (!auth) {
        return res.status(401).json({message: "Unauthorized"})
    }
    const token = auth.split(" ")[1]
    try {
        const userId = verifyToken(token)
        req.userId = userId
        next()
    }catch(error){
        return res.status(401).json({message: "Unauthorized"})
    }
}