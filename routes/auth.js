import { Router } from 'express';
import { sql } from '../db/neon.js';
import bcrypt from 'bcryptjs'
import { generateToken, verifyToken } from '../lib/jwt.js';

export const authRouter =  Router();

authRouter.post('/auth/login', async(req, res) => {
  const {email, password} = req.body
    console.log(email, password)
  try {

    const user = await sql`select * from users where email=${email}`
    console.log(user)
    if(!user.length){
          return res.status(400).json({message:'Bad credentials'})
    }

    if(!bcrypt.compareSync(password, user[0].password)){
        return res.status(400).json({message:'Bad credentials'})
    }

    const token = generateToken({id: user[0].id, email: user[0].email, name: user[0].name})

    res.cookie('token', token, {
        httpOnly: true,
        secure: false,
        sameSite: 'Lax',
        expires: new Date(Date.now() + 1000 * 60 * 60 * 24 * 7),
    });

    return res.status(200).json({
        token,
        message: 'Success'
    })

} catch(error){
    console.log(error)
    return res.status(500).json({
        message: 'Something went wrong'
    })
}
  
});

authRouter.post('/auth/register', async(req, res) => {
    const {name, email, password, passwordConfirmation} = req.body
    const hashedPassword = bcrypt.hashSync(password, 10)

    if(password !== passwordConfirmation){
        return res.status(400).json({message: 'Passwords do not match'})
    }
    try{
        await sql` INSERT INTO users (email, name, password) VALUES (${email}, ${name}, ${hashedPassword});`;
        return res.status(200).json({message: 'Success'})

    } catch(error){
        console.log(error)
        if(error.code === '23505'){
            return res.status(400).json({message: 'Email already exists'})
        } 
        return res.status(500).json({message: 'Something went wrong'})
    }
})

authRouter.get('/auth/logout', async(req, res) => {
    res.clearCookie('token')
    return res.status(200).json({message: 'Success'})
})

authRouter.get('/auth/me', async(req, res) => {
    console.log('xd')
    const token = req.cookies.token

    if(!token){
        return res.status(401).json({message: 'Unauthorized'})
    }

    try{
        const {name, id, email} = verifyToken(token)
        return res.status(200).json({name, id, email})
    } catch(error){
        return res.status(401).json({message: 'Unauthorized'})
    }

})