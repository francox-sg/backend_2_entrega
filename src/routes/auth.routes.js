import { Router } from "express";
import { userModel } from "../daos/mongodb/models/user.model.js";
import { createHash } from "../utils/hash.js";
import passport from "passport";
import { generateToken } from "../utils/jwt.js";

const router= Router();

router.post("/login", passport.authenticate("login", {session:false, failureRedirect: "/api/auth/login"}), async (req,res)=>{
    console.log("Router LOGIN");
    
    if(!req.user){
        return res.status(401).json({ error: "Usuario No Autorizado"})
    }

    //Informacion del Token
    const payload ={
        first_name: req.user.first_name,
        last_name: req.user.last_name,
        email: req.user.email,
        role: req.user.role
    }

    const token = generateToken(payload)

    res.cookie("token", token, {maxAge:100000, httpOnly:true})

    res.status(200).json({token, message:"Login Exitoso!"})
})

router.post("/register", async (req, res)=>{
    const {email, first_name, last_name, age, password, role} = req.body;

    if(!email || !first_name || !last_name || !age || !password ){
        return res.status(400).json({error: "Falta informacion"})
    }
    
    try {
        console.log("Llega al try");
        
        const newUser = {
            email,
            first_name,
            last_name,
            age,
            password: await createHash(password),
            role
        }
        console.log(newUser);
        const response = await userModel.create(newUser)

        res.status(200).json(response)
        
    } catch (error) {
        res.status(500).json({error: "Error al crear el Usuario", details: error})
    }
})


router.get('/current', passport.authenticate("jwt",{session: false}), (req, res)=>{
    console.log(req.user);
    res.status(200).json({
        message:"Bienvenido",
        user: req.user
    })
})

router.get('/logout',  (req, res)=>{
    res.clearCookie("token")
    res.status(200).json({
        message:"Sesion Cerrada",
    })
})

/* ----------------------------- Error Endpoints ---------------------------- */

router.get("/login", (req, res)=>{
    res.status(401).json({ error: "No Autorizado"})
})


export default router