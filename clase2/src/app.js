import express from "express"
import compression from 'express-compression'
import { faker } from '@faker-js/faker';
import { logger } from "./utils/loggers.js";

const app = express()

app.use(express.json())

app.use(compression({
    brotli:{enabled:true},
    threshold:1024,
    filter:(req,res)=>{
        const extesion = req.url.split(".").pop()
        const noCompressTypes = ["jpg","jpeg","png","gif","mp4"]
        return !noCompressTypes.includes(extesion)
    }
}))


app.get("/string-largo",(req,res)=>{
    let string = "Hola coders, soy un string muy largo"
    for(let i=0; i<10e5; i++){
        string = string + "Hola coders, soy un string muy largo"
    }
     res.status(200).json({status:"success",message:string})
})

app.get("/string",(req,res)=>{
    let string = "Hola coders, soy un string muy largo"
    logger.error(string)
    res.status(200).json({status:"success",message:string})
})

app.get("/crear-usuarios/:quantity",(req,res)=>{
    const quantity = req.params.quantity
    const users = []
    for(let i =0;i<quantity;i++){
        const user = {
            _id:faker.database.mongodbObjectId(),
            firstName:faker.person.firstName(),
            lastName:faker.person.lastName(),
            sex:faker.person.sex(),
            telephone:faker.phone.number(),
            city:faker.location.city(),
            birthdate:faker.date.birthdate()
        }
        users.push(user)
    }
    res.json({status:"success",users})

})


app.listen(8080,()=>console.log("Server in port: " + 8080))