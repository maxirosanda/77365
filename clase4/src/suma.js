  process.on("message",(message) =>{
    let suma = 0
    for(let i = 0; i<10e9;i++ ){
        suma = suma + i
    }
    process.send({payload:suma})
    
  })