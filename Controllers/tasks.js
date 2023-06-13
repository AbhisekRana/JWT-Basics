const jwt = require('jsonwebtoken')



const user = async (req,res) =>{
    const {name,pass} = req.body
    if(!name || !pass){
        res.status(400).json('Give a Username and Password')
    }
    const token = jwt.sign({name},process.env.jwt_key)

    res.status(200).json({token})
}

const info = async (req,res) =>{
    const decode = req.headers.authorization
    if(!decode || !decode.startsWith('Bearer ')){
        res.status(401).json({msg : 'Not Authorized'})
    }
    const code = decode.split(' ')[1]
    console.log(code)

    try {
        const decoded = jwt.verify(code,process.env.jwt_key)
        const {name} = decoded
        res.status(200).json({username : `${name}`})
    } catch (error) {
        res.status(401).json({msg : 'Bad token'})
    }
}

module.exports = {info,user}