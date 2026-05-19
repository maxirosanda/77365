import winston from "winston"
import dotenv from "dotenv"

dotenv.config()

const levelAndColors = {
    levels:{
        fatal:0,
        error:1,
        warn:2,
        info:3,
    },
    colors:{
        fatal:"red",
        error:"magenta",
        warn:"yellow",
        info:"green"
    }
}

const loggerDev = winston.createLogger({
    levels:levelAndColors.levels,
    transports:[
        new winston.transports.Console({
            level:"info",
            format:winston.format.combine(
                winston.format.colorize({colors:levelAndColors.colors}),
                winston.format.simple()
            )
        })
    ]
})

const loggerProd = winston.createLogger({
    levels:levelAndColors.levels,
    transports:[
        new winston.transports.File({
            level:"warn",
            filename:"./error.log",
            format:winston.format.simple()

        })
    ]
})

console.log(process.env.NODE_ENV)

export const logger = process.env.NODE_ENV === "production" ? loggerProd : loggerDev