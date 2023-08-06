const express = require('express');
const router = express.Router();
const fetchUser = require('../middleware/fetchUser');
const User = require('../modals/User');
const nodemailer = require('nodemailer');
const Contact = require('../modals/Contact');
const config = require('../config.json')

router.post('/', fetchUser, async (req, res) => {
    let success = false
    const userId = req.user.id;
    try {
        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({success, error: "User not found" });
        }
        const email = user.email;
        const server = email.split('@')[1]
        const transporter = nodemailer.createTransport({
            host: 'smtp.' + server,
            port: 465, 
            auth: {
                user: config.email ,
                pass: config.paasword
            }
        });

        const contact = await Contact.create({
            name: req.body.name,
            message: req.body.message
        });

        const mailOptions = {
            from: "uj123243@gmail.com",
            to: email,
            subject: "Thanks for contacting us!",
            text: "Thanks for contacting us!"
        };
        success = true

        transporter.sendMail(mailOptions, function (error, info) {
            if (error) {
                console.log(error);
                res.status(500).json({ error: "Failed to send email" });
            } else {
                console.log('Email sent: ' + info.response);
                res.json({success, contact });
            }
        });
    } catch (error) {
        console.log("Error Occurred", error);
        res.status(500).json({success, error: "Internal Server error" });
    }
});

module.exports = router;