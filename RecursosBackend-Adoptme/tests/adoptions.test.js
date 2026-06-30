import supertest from 'supertest';
import { expect } from 'chai';

const requester = supertest('http://localhost:8080');
const user = {
    id:"",
    email:"",
    password:""
}

const pet = {
    id:""
}

const adoption = {
    id:""
}

describe("",()=>{
    describe('Test de endpoint /api/sessions/register', () => {

        it('El endpoint POST /api/sessions/register debe crear un usuario correctamente', async () => {
            const userMock = {
                first_name: 'Juan',
                last_name: 'Perez',
                email: `juan.perez.${Date.now()}@test.com`, // email único para evitar conflictos
                password: '123456'
            };

            user.email = userMock.email 
            user.password = userMock.password

            const { statusCode, body } = await requester
                .post('/api/sessions/register')
                .send(userMock);

            
            user.id = body.payload
            expect(body).to.have.property('status',"success");
        });

        it('No debe permitir registrar un usuario sin campos obligatorios', async () => {
            const userMock = {
                first_name: 'Juan',
                // faltan last_name, email y password
            };

            const { statusCode, body } = await requester
                .post('/api/sessions/register')
                .send(userMock);

        expect(body).to.have.property('status',"error");
        });

            it('No debe permitir registrar un usuario con un email que ya existe', async () => {
            const userMock = {
                first_name: 'Juan',
                last_name: 'Perez',
                email: user.email, // mismo email usado en el primer test
                password: '123456'
            };
    
            const { statusCode, body } = await requester
                .post('/api/sessions/register')
                .send(userMock);
    
            expect(body).to.have.property('status',"error");
        });

    });

    describe('Test de endpoint /api/sessions/login', () => {
 
        it('El endpoint POST /api/sessions/login debe loguear correctamente con un usuario existente', async () => {
            const loginMock = {
                email: user.email,
                password: user.password
            };
    
            const { statusCode, body } = await requester
                .post('/api/sessions/login')
                .send(loginMock);
    
            expect(body).to.have.property('status', "success");
        });
    
        it('No debe permitir loguear un usuario que no existe', async () => {
            const loginMock = {
                email: `no.existe.${Date.now()}@test.com`,
                password: '123456'
            };
    
            const { statusCode, body } = await requester
                .post('/api/sessions/login')
                .send(loginMock);
    
            expect(body).to.have.property('status', "error");
        });
    
        it('No debe permitir loguear un usuario con password incorrecta', async () => {
            const loginMock = {
                email: user.email,
                password: 'passwordIncorrecta'
            };
    
            const { statusCode, body } = await requester
                .post('/api/sessions/login')
                .send(loginMock);
    
            expect(body).to.have.property('status', "error");
        });
    })

    describe('Test de endpoint /api/pets', () => {
 
        it('El endpoint POST /api/pets debe crear una mascota correctamente', async () => {
            const petMock = {
                name: 'Firulais',
                specie: 'perro',
                birthDate: '2020-05-10'
            };
    
            const { statusCode, body } = await requester
                .post('/api/pets')
                .send(petMock);
            pet.id = body.payload._id
    
            expect(body).to.have.property('status', "success");
        });
    
        it('No debe permitir crear una mascota sin campos obligatorios', async () => {
            const petMock = {
                name: 'Firulais',
                // faltan specie y birthDate
            };
    
            const { statusCode, body } = await requester
                .post('/api/pets')
                .send(petMock);
    
            expect(body).to.have.property('status', "error");
        });
    
    });

    describe('Test de endpoint /api/adoptions', () => {
 
        it('El endpoint POST /api/adoptions/:uid/:pid debe generar una adopción correctamente', async () => {
            const { statusCode, body } = await requester
                .post(`/api/adoptions/${user.id}/${pet.id}`)
                .send();
            
            adoption.id = body.payload
 
            expect(body).to.have.property('status', "success");
        });
 
        it('No debe permitir adoptar con un id de usuario inexistente', async () => {
            const fakeUserId = '64b7f9c2e1a4f5a1b8c9d0e1';
 
            const { statusCode, body } = await requester
                .post(`/api/adoptions/${fakeUserId}/${pet.id}`)
                .send();
 
            expect(body).to.have.property('status', "error");
        });
 
        it('No debe permitir adoptar con un id de mascota inexistente', async () => {
            const fakePetId = '64b7f9c2e1a4f5a1b8c9d0e2';
 
            const { statusCode, body } = await requester
                .post(`/api/adoptions/${user.id}/${fakePetId}`)
                .send();
 
            expect(body).to.have.property('status', "error");
        });
 
        it('No debe permitir adoptar la misma mascota dos veces', async () => {
            const { statusCode, body } = await requester
                .post(`/api/adoptions/${user.id}/${pet.id}`)
                .send();
 
            expect(body).to.have.property('status', "error");
        });

        it('El endpoint GET /api/adoptions/:aid debe traer la adopción correctamente', async () => {
            const { statusCode, body } = await requester
                .get(`/api/adoptions/${adoption.id}`)
                .send();
 
            expect(body).to.have.property('status', "success");
        });
 
        it('El endpoint GET /api/adoptions/:aid debe devolver error si la adopción no existe', async () => {
            const fakeAdoptionId = '64b7f9c2e1a4f5a1b8c9d0e3';
 
            const { statusCode, body } = await requester
                .get(`/api/adoptions/${fakeAdoptionId}`)
                .send();
 
            expect(body).to.have.property('status', "error");
        });
 
        it('El endpoint GET /api/adoptions debe traer todas las adopciones', async () => {
            const { statusCode, body } = await requester
                .get('/api/adoptions')
                .send();
 
            expect(body).to.have.property('status', "success");
            expect(body.payload).to.be.an('array');
        });
 
    });

})
