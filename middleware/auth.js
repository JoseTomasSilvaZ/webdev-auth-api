

export const authMiddleware = (req, res, next) => {

    const token = req.cookies.token

    if(!token){
        return res.status(401).json({message: 'Unauthorized'})
    }

    try {
        const user = verifyToken(token)
        req.user = user
        next()
    } catch(error){
        return res.status(401).json({message: 'Unauthorized'})
    }
}