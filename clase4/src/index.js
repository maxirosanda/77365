import express from "express"
import cluster from "cluster"
import child_process from "child_process"
import os from "os"

import dotenv from "dotenv"

dotenv.config()
const app = express()
app.use(express.json())

app.get("/operacion-compleja",(req,res)=>{
    const children = child_process.fork("./src/suma.js")
    children.send("")
    children.on("message",(data)=>{
        res.json({status:"success",payload:data.payload})
    })
    
})

app.get("/",(req,res)=>{
    
    res.json({status:"success"})
})



if(cluster.isPrimary){

    const cpus = os.cpus().length
    console.log("Proceso primario con id: " + process.pid )

    for(let i = 0; i < cpus;i++){
        cluster.fork()
    }

    cluster.on("exit",(worker,code)=>{
        console.log("error en proceso con id:" + worker.pid + "codigo de error: " + code )
        cluster.fork()
    })

} else {

    app.listen(process.env.PORT,() => console.log("server in port:" + process.env.PORT + " id del proceso: " + process.pid))

}


