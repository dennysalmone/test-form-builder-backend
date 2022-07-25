const { Router } = require('express')
const bcrypt = require("bcryptjs")
const router = Router()
const bodyParser = require('body-parser')
const User = require('../models/User')
const {check, validationResult} = require('express-validator')
const privateKey = 'iCIQp)WK1D:RJ~v1C|Q'
const Counter = require('../models/Counter')
const jwt = require("jsonwebtoken")

router.use(bodyParser.urlencoded({ extended: true }))
router.use(bodyParser.json())

router.post(
    '/login', 
    [
        check('email', 'Incorrect email').isEmail(),
        check('password', 'Incorrect password').isLength({min: 6})
    ],
    async (req, res) => {
    try {
        const errors = validationResult(req)
        if (!errors.isEmpty()) {
            return res.status(400).json({
                errors: errors.array(),
                message: 'Incorrect login data'
            })
        }

        const user = await User.findOne({email: req.body.email})
        const isMatch = await bcrypt.compare(req.body.password, user.password)
        
        if (!isMatch || !user) {
            return res.status(400).json({message: 'Invalid password or user is not found'})
        }

        const token = jwt.sign(
            { email: req.body.email },
            privateKey,
            { expiresIn: '24h'}
        )
        res.json({token: `${token}`})
    }
    catch (e) {
        res.status(500).json({message: e.message})
    }
})

router.post(
    '/register', 
    [
        check('email', 'Incorrect email').isEmail(),
        check('password', 'Incorrect password').isLength({min: 6})
    ],
    async (req, res) => {
    try {

        const errors = validationResult(req)
        if (!errors.isEmpty()) {
            return res.status(400).json({
                errors: errors.array(),
                message: 'Incorrect data during registration'
            })
        }
        let counter = await Counter.findOne({name: 'default'})
        let candidate = await User.findOne({email: req.body.email})
        if (candidate) {
            return res.status(400).json({message: 'This user alredy exists'})
        }
        const hashedPassword = await bcrypt.hash(req.body.password, 12)
        console.log(counter)
        const user = new User({
            email: req.body.email,
            password: hashedPassword,
            userId: counter.idCounter++
        })
        await user.save()
        await Counter.updateOne({name: 'default'}, {$inc: { idCounter: 1 }} )
        return res.status(201).json({message: 'User had created'})
    }
    catch (e) {
        res.status(500).json({message: e.message})
    }
})

module.exports = router