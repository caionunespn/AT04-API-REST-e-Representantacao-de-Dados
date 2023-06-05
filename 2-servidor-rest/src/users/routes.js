const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { json2xml } = require("xml-js");
const router = express.Router();

const User = require("./model");
const salt = bcrypt.genSaltSync(10);

router.post("/", async (req, res) => {
    let errors=[]
    try {
        const { username, email, password } = req.body;
        const { format } = req.query;

        if (!username) {
            errors.push("Username is missing");
        }
        if (!email) {
            errors.push("Email is missing");
        }
        if (!password) {
            errors.push("Password is missing");
        }
        if (errors.length){
            res.status(400).json({"error": errors.join(",")});
            return;
        }
        
        const user = await User.findOne({
            where: {
                email,
            },
        });

        if (user) {
            return res.status(404).json({error: "There is already a user with this email address."}); 
        }

        const data = {
            username,
            email,
            password: bcrypt.hashSync(password, salt),
            createdAt: Date('now'),
            updatedAt: Date('now'),
        }
        
        const newUser = await User.create(data);
        const baseData = { id: newUser.dataValues.id, username: newUser.dataValues.username, email: newUser.dataValues.email };

        const token = jwt.sign(baseData, process.env.TOKEN_KEY);

        const returnData = {
            ...newUser.dataValues,
            token,
        };

        if (format === "xml") {
            const xml = json2xml({ user: returnData }, {compact: true, ignoreComment: true, spaces: 4});
            const finalXml = `<?xml version="1.0" encoding="UTF-8"?>\n${xml}`;
            res.setHeader('Content-Type', 'application/xml');
            return res.status(201).send(finalXml);
        } else {
            return res.status(201).json(returnData);
        }
    } catch (err) {
        res.status(404).json({error: err.message});
    }
});

router.post("/login", async (req, res) => {
  try {      
    const { email, password } = req.body;
    const { format } = req.query;
    
    if (!(email && password)) {
        res.status(400).json({
            error: "All input is required"
        });
    }

    const user = await User.findOne({
        where: {
            email,
        },
    });

    if (user && bcrypt.compareSync(password, user.password)) {
        const baseData = { id: user.id, username: user.username, email: user.email };
        const token = jwt.sign(baseData, process.env.TOKEN_KEY);
        const { password, ...userWithoutPassword } = user.dataValues;

        const returnData = {
            ...userWithoutPassword,
            token,
        };
        
        if (format === "xml") {
            const xml = json2xml({ user: returnData }, {compact: true, ignoreComment: true, spaces: 4});
            const finalXml = `<?xml version="1.0" encoding="UTF-8"?>\n${xml}`;
            res.setHeader('Content-Type', 'application/xml');
            return res.status(201).send(finalXml);
        } else {
            return res.status(201).json(returnData);
        }
    } else {
        return res.status(400).json({error: "User not found"});
    }
    } catch (err) {
        res.status(404).json({error: err.message});
    }
});

module.exports = router;