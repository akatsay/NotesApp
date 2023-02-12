const { Router, json } = require("express")
require("dotenv").config()
const { check, validationResult } = require("express-validator")
const bcrypt = require("bcryptjs")
const jwt = require("jsonwebtoken")
const User = require("../models/User")
const router = Router()


// /api/auth/register

router.post(
    '/register',
    [
        check("firstName")
            .not().isEmpty().withMessage("Don't forget your name")
            .isAlpha().withMessage('Name must only contain Latin alphabet letters'),
        check("email")
            .not().isEmpty().withMessage("Don't forget your email")
            .isEmail().withMessage("invalid email"),
        check("password")
            .isLength({max: 30}).withMessage("Password should be less than 30 character long")
            .not().isEmpty().withMessage("Password can not be blank")
            .isStrongPassword({
                minLength: 8,
                minLowercase: 1,
                minUppercase: 1,
                minNumbers: 1,
                minSymbols: 1,
                returnScore: false,
            }).withMessage("Password must be at least: 8 characters long and contain at least: 1 uppercase, 1 lowercase, 1 number, 1 special character")
    ],
    async (req, res) => {
    try {
        const errors = validationResult(req)

        if (!errors.isEmpty()) {
            return res.status(400).json({
                errors: errors.array()[0],
                message: "Incorrect registration data"
            })
        }

        const {firstName, email, password} = req.body

        const candidate = await User.findOne({ email })

        if (candidate) {
            return res.status(400).json({ 
                errors: {msg: "User with this email already exists", param: "email"},
                message: "User with this email already exists" 
            })
        }
        
        const formatedName = firstName.charAt(0).toUpperCase()+ firstName.slice(1).toLowerCase()
        const hashedPassword = await bcrypt.hash(password, 12)
        const user = new User({ firstName: formatedName, email, password: hashedPassword})

        await user.save()

        res.status(201).json({ message: "User created" })

    } catch (e) {
        res.status(500).json({ message: " something went wrong on the server... " })
    }
})

// /api/auth/login

router.post(
    '/login',
    [
        check("email", "Input correct email")
            .not().isEmpty().withMessage("Don't forget your email")
            .isEmail().withMessage("invalid email"),
        check("password", "Input password")
            .not().isEmpty().withMessage("Don't forget your password")
    ],
    async (req, res) => {
    try {
        const errors = validationResult(req)

        if (!errors.isEmpty()) {
            return res.status(400).json({
                errors: errors.array()[0],
                message: "Incorrect email or password"
            })
        }

        const {email, password} = req.body

        const user = await User.findOne({ email })

        if(!user) {
            return res.status(400).json({ 
                errors: {msg: "User with this email does not exist", param: "email"},
                message: "User with this email does not exist" 
            })
        }

        const isMatch = await bcrypt.compare(password, user.password)

        if (!isMatch) {
            return res.status(400).json({ 
                errors: {msg: "Incorrect password, try again", param: "password"},
                message: "Incorrect password, try again" })
        }

        const token = jwt.sign(
            {userId: user.id, name: user.firstName, email: user.email},
            process.env.JWT_SECRET,
            {expiresIn: "15m"}
        )

        res.json({ token, userId: user.id, name: user.firstName, email: user.email, message: `logged in as ${email}` })

    } catch (e) {
        res.status(500).json({ message: "something went wrong on the server..." })
    }
})

module.exports = router