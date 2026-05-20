import { sign, verify, SignOptions } from "jsonwebtoken"

export const signToken = (userId: number) => {
    return sign(
        { sub: String(userId) },
        process.env.JWT_SECRET!,
        { expiresIn: process.env.JWT_EXPIRES_IN as SignOptions['expiresIn'] }
    )
}

export const verifyToken = (token: string) => {
    const payload = verify(token, process.env.JWT_SECRET!) as {sub: string}
    return Number(payload.sub)
}