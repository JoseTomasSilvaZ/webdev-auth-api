import jwt from 'jsonwebtoken'

export const generateToken = (payload) => {
    return jwt.sign(payload, 'secret', {expiresIn: '1h'})
}

export const verifyToken = (token) => {
    return jwt.verify(token, 'secret')
}