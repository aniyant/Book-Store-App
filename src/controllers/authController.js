const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const Customer = require('../models/sql/customer');

exports.register = async (req, res) => {
    const { name, email, password,role } = req.body;
    try {

        //validate
        if(!name || !email || !password || !role) {
            return res.status(400).send("All fields required");
        }
        //check if user already exists
        const userExist = await Customer.findOne({where:{ email }});
        if(userExist) return res.status(400).send("User already exists");

        // Hash the password
        const hashedPassword = await bcrypt.hash(password, 10);
        const customer = await Customer.create({name,email,password:hashedPassword,role});
        return res.status(201).json({ customer,message:"user registered successfully." });
    }
    catch (err) {
        return res.status(500).json({ message:"error in register",error: err.message });
    }
};

exports.login = async (req, res) => {
    const { email, password } = req.body;
    try {
        //check if user exists
        const customer = await Customer.findOne({where:{ email }});
        if(!customer) return res.status(400).send("Invalid credentials");

        //check password
        const isMatch = await bcrypt.compare(password, customer.password);
        if(!isMatch) return res.status(400).send("Invalid credentials");

        //token
        const token = await jwt.sign({name:customer.name,email:customer.email,role:customer.role}, process.env.JWT_SECRET, {expiresIn: '24h'});
        
        return res.status(200).json({token});
    }
    catch(err){
        return res.status(500).json({ message: err.message });
    }
};

