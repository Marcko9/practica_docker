//const express = require('express');
//const mongoose = require('mongoose');

import express from 'express';
import mongoose from 'mongoose';


// Constants
// const hostname = '127.0.0.1';
const hostname = 'usuarioDB';
const hostname2 = 'userapp';
const port = 8085;
const router = express.Router();
// App
const app = express();

app.use(express.json());
app.use(router);


// GET method route
/*app.get('/', function(req, res) {
    res.send('GET request to the homepage');
});*/

// POST method route
/*app.post('/', function(req, res) {
    res.send('POST request to the homepage');
});*/

// GET method route
// router.get('/secret', function(req, res, next) {
//     res.send('Never be cruel, never be cowardly. And never eat pears!');
//     console.log('This is a console.log message.');
// });

/*
Your implementation here 
*/


// // Connect to mongodb server
// const MongoClient = require('mongodb').MongoClient;
// /* Your url connection to mongodb container */
// const url = 'mongodb://127.0.0.1:27017/userDB';
const url = `mongodb://${hostname}:27017/userDB`;
try {
    await mongoose.connect(url);
    console.log('DB OK');
    console.log(url);
} catch (err) {
    console.log(err);
}

//Modelo Schema mongoDB
const userSchema = new mongoose.Schema({
    nombre: String,
    apellido: String,
    username: String
});


const User = mongoose.model('User', userSchema);

//Rutas
//Método: GET
//Descripción: Permite mostrar la colección de usuarios almacenada en la base de datos
router.get('/', (req, res) => {
    console.log('Get user');
    User.find()
        .then(user => res.json(user))
        .catch(err => res.json(res))
});

//Método: GET
//Param: id
//Descripción: Obtiene el usuario con el id recibido como parámetro
//Resultados:
//  200 - Usuario encontrado
//  404 - Usuario no encontrado
router.get('/:id', async(req, res) => {
    console.log('Get user with id');
    const id = req.params.id;

    try {
        const foundUser = await User.findById(id);

        if (!foundUser) {
            console.log('No lo encontró');
            res.status(404).json({
                status: 404,
                message: "Usuario no encontrado"
            });
            //createError(404, "Usuario no encontrado");
        } else {
            res.status(200).json({
                status: 200,
                message: "Usuario encontrado",
                foundUser
            });
        }
    } catch (err) {
        res.json({
            status: err.status,
            message: "Error: " + err.status
        });
    }
});


//Método: POST
//Param:
//Body:
// {  
//     "nombre":"nombreUsuario",
//     "apellido":"appellidoUsuario",
//     "username":"usuario" 
//   }
//Descripción: Permite almacenar en la base de datos un nuevo usuario
//Resultados:
//  201 - Usuario creado

app.post('/', (req, res) => {
    console.log('Post User');
    const body = req.body;
    try {
        const user = new User(body);
        user.save();
        console.log(body);
        res.status(201).json({
            status: 201,
            message: "Usuario creado",
            user
        });
    } catch (err) {
        res.json({
            status: err.status,
            message: "Error en el proceso, reporte con el administrador"
        });
    }
});

//Método: PUT
//Param: id
//Descripción: Permite actualizar un usuario con base al id recibido, en caso de no encontrarlo, crea un nuevo usuario
//Resultados:
//  200 - Usuario encontrado y actualizado
//  201 - Usuario creado

app.put('/:id', async(req, res) => {
    const id = req.params.id;
    const body = req.body;

    try {
        const foundUser = await User.findById(id);

        if (!foundUser) {
            console.log('No lo encontró');
            const user = new User(body);
            user.save();
            res.status(201).json({
                status: 201,
                message: "Usuario creado"
            });
        } else {
            const newDato = await User.findByIdAndUpdate(id, body, { new: true });
            res.status(200).json({
                status: 200,
                message: "Usuario encontrado y actualizado",
                foundUser
            });
        }
    } catch (err) {
        res.json({
            status: err.status,
            message: "Error en el proceso, reporte con el administrador"
        });
    }
});


//Método: DELETE
//Param: id
//Descripción: Permite eliminar un usuario con base al id recibido, en caso de no encontrarlo, se envía mensaje al usuario
//Resultados:
//  200 - Usuario encontrado y eliminado
//  204 - Usuario no encontrado
app.delete('/:id', async(req, res) => {
    const id = req.params.id;

    try {

        const foundUser = await User.findById(id);

        if (!foundUser) {
            console.log('Usuario no encontrado');
            res.status(204).json({
                status: 204,
                message: "Usuario no encontrado"
            });
        } else {
            await User.findByIdAndDelete(id);
            res.status(200).json({
                status: 200,
                message: "Usuario eliminado"
            });
        }
    } catch (err) {
        res.json({
            status: err.status,
            message: "Error en el proceso, reporte con el administrador"
        });
    }



});

// GET method route
// Retrieve all documents in collection
// ...

// GET method route
// Query by a certain field(s)
// ...

/* PUT method. Modifying the message based on certain field(s). 
If not found, create a new document in the database. (201 Created)
If found, message, date and offset is modified (200 OK) */
// ...

/* DELETE method. Modifying the message based on certain field(s).
If not found, do nothing. (204 No Content)
If found, document deleted (200 OK) */
// ...

// app.listen(port, hostname, () => {
//     console.log('Servidor OK');
// });
app.listen(port, hostname2, () => {
    console.log('Servidor OK');
});
console.log(`Running on http://${hostname2}:${port}`);