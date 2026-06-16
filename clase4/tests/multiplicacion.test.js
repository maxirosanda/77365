import { multiplicar } from "../src/utils/multiplicar.js";
import { expect } from 'chai';

describe("Test de la funcion multiplicar",()=>{

    before(function(){
        console.log("esto se ejercuta al principio de todo")
    })

    beforeEach(function(){
        console.log("se ejecuta antes de cada prueba")
    })

    it("probar multiplicar 3 por 9", () =>{
        const result = multiplicar(3,9)
        expect(result).to.equal(27)
    })

    describe("estos test estan relacionados",()=>{
        it("probar multiplicar 3 por 9", () =>{
            const result = multiplicar(4,5)
            expect(result).to.equal(20)
        })

        it("probar multiplicar 3 por 9", () =>{
            const result = multiplicar(4,5)
            expect(result).to.equal(20)
        })
    })

    afterEach(function(){
        console.log("se ejecuta despues de cada prueba")
    })

    after(function(){
        console.log("esto se ejecuta al final de todo")
    })

})