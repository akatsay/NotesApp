const { Router, json } = require("express")
require("dotenv").config()
const { check, validationResult } = require("express-validator")
const bcrypt = require("bcryptjs")
const User = require("../models/User")
const auth = require("../middlewares/auth.middleware")
const router = Router()


// /api/account

// /api/account/name

router.put(
    "/name",
    auth,
    [
        check("name")
            .not().isEmpty().withMessage("Input new name")
            .isAlpha().withMessage('New Name must only contain Latin alphabet letters'),
    ],
    async (req, res) => {
        try {
            const errors = validationResult(req)

            if (!errors.isEmpty()) {
                return res.status(400).json({
                errors: errors.array()[0],
                message: "Invalid name"
                })
            }
                
            const {name, userId} = req.body

            const user = await User.findById(userId)

            if(!user) {
                return res.status(500).json({ 
                    errors: {msg: "Server error, unable to find user", param: "userId"},
                    message: "Server error, unable to update name"
                })
            }

            const formatedName = name.charAt(0).toUpperCase()+ name.slice(1).toLowerCase()
            const isMatch = await formatedName === user.firstName

            if (isMatch) {
                return res.status(400).json({ 
                    errors: {msg: "New name should be different from old one", param: "name"},
                    message: "Invalid new name" })
            }

            const update = { firstName: formatedName };
            await user.updateOne(update);

            res.status(200).json({ message: "Name updated" })

        } 
        catch (e) {
            res.status(500).json({ message: "something went wrong on the server..." })
        }
    }

)

// /api/account/password

router.post(
    '/password',
    auth,
    [
        check("oldPassword")
            .not().isEmpty().withMessage("Input your old Password"),
        check("newPassword")
            .isLength({max: 30}).withMessage("New password should be less than 30 character long")
            .not().isEmpty().withMessage("Password can not be blank")
            .isStrongPassword({
                minLength: 8,
                minLowercase: 1,
                minUppercase: 1,
                minNumbers: 1,
                minSymbols: 1,
                returnScore: false,
            }).withMessage("New Password must be at least: 8 characters long and contain at least: 1 uppercase, 1 lowercase, 1 number, 1 special character")
    ],
    async (req, res) => {
        try {
            const errors = validationResult(req)

            if (!errors.isEmpty()) {
                return res.status(400).json({
                    errors: errors.array()[0],
                    message: "Incorrect password"
                })
            }

        const {oldPassword, newPassword, userId} = req.body

        const user = await User.findById(userId)

        if(!user) {
            return res.status(500).json({ 
                errors: {msg: "Server error, unable to find user", param: "userId"},
                message:  "Server error, unable to update password"
            })
        }

        const isMatch = await bcrypt.compare(oldPassword, user.password)

        if (!isMatch) {
            return res.status(400).json({ 
                errors: {msg: "Incorrect old password, try again", param: "oldPassword"},
                message: "Incorrect old password, try again" })
        }

        const isNewPasswordMatchOldPassword = await bcrypt.compare(newPassword, user.password)

        if (isNewPasswordMatchOldPassword) {
            return res.status(400).json({ 
                errors: {msg: "New password should be different from the old one", param: "oldPassword"},
                message: "Invalid new password" })
        }

        const hashedPassword = await bcrypt.hash(newPassword, 12)

        const update = { password: hashedPassword };
        await user.updateOne(update);

        res.status(200).json({ message: "Password updated" })

    } catch (e) {
        res.status(500).json({ message: " something went wrong on the server... " })
    }
})

// /api/account/delete

router.delete(
    "/delete",
    auth,
    [
        check("password")
            .not().isEmpty().withMessage("Input your old Password")
    ],
    async (req, res) => {
    
        try {

            const errors = validationResult(req)

            if (!errors.isEmpty()) {
                return res.status(400).json({
                    errors: errors.array()[0],
                    message: "Incorrect password"
                })
            }

            const {password ,userId} = req.body

            const user = await User.findById(userId)

            if(!user) {
                return res.status(500).json({ 
                    errors: {msg: "Server error, unable to find user", param: "userId"},
                    message:  "Server error, unable to delete account"
                })
            }

            const isMatch = await bcrypt.compare(password, user.password)

            if (!isMatch) {
                return res.status(400).json({ 
                    errors: {msg: "Incorrect password, try again", param: "password"},
                    message: "Incorrect password, try again" })
            }

            await User.findByIdAndDelete(userId)

            res.status(200).json({ message: "User deleted" })

        } catch (e) {
            res.status(500).json({ message: " something went wrong on the server... " })
        }
})

module.exports = router