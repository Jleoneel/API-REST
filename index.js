const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const mysql = require('mysql2');

app.use(bodyParser.json({ type: 'application/json' }));

app.use(function (req, res, next) {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');
    res.setHeader('Access-Control-Allow-Credentials', true);
    next();
});

const connection = mysql.createConnection({
    host: 'localhost', 
    user: 'root',
    password: '2003',
    database: 'db_curso_app'
}); 

connection.connect(function (err) {
    if (err) {
        console.error('error connecting: ' + err.stack);
        return;
    }
    console.log('connected as id ' + connection.threadId);
});

app.get('/', function (req, res) {
    res.send('Hello World')
});

// MÉTODO PARA INSERTAR DATOS DESDE POSTMAN.
app.post("/insert1", function (req, res) {
    connection.query(`INSERT INTO db_curso_app.persona
    (cedula, nombres, apellidos, fecha_nacimiento,telefono,direccion) 
    VALUES(?,?,?,?,?,?);
    `, [req.body.cedula, req.body.nombres, req.body.apellidos, req.body.fecha_nacimiento, req.body.telefono, req.body.direccion], 
    function (error, results, fields) {
        if (error) throw error;
        res.json({
            personainfo: results
        });
    });
});

//MÉTODO PARA ACTUALIZAR DATOS
app.post("/update1", function (req, res) {
    connection.query(`UPDATE db_curso_app.persona SET 
    cedula=?, nombres=?, apellidos=?, fecha_nacimiento=?, telefono=?, direccion=? 
    WHERE idpersona=?;
    `, [req.body.cedula, req.body.nombres, req.body.apellidos, req.body.fecha_nacimiento, req.body.telefono, req.body.direccion, req.body.idpersona], 
    function (error, results, fields) {
        if (error) throw error;
        res.json({
            message: "Record updated successfully",
            affectedRows: results.affectedRows
        });
    });
});

//MÉTODO SELECT
app.post("/select1", function(req, res ){
    connection.query('select * from db_curso_app.persona', function (error, results) {
        if (error) throw error;
        res.json({persona:results});

    })
});

/* MÉTODO SELECT CON CONDICIÓN
app.post("/selectxid", function(req, res ){
    const {idpersona}=req.body;
    connection.query('select * from db_curso_app.persona WHERE idpersona= 2',[idpersona], function (error, results) {
        if (error) throw error;
        res.json({idpersonas:results});

    })
});
*/
//MÉTODO DELETE 
app.post("/delete1", function(req,res) {
    const {idpersona} = req.body;
    connection.query('DELETE FROM db_curso_app.persona WHERE idpersona= 2',[idpersona], function(error, results) {
        if (error) throw error;
        if (results.affectedRows > 0){
            res.json({mensaje: 'Usuario eliminado correctamente'});
        } else {
            res.status(404).json({error: 'persona no encontrada'});
        }
    });
});

app.listen(3000);
console.log("Servidor iniciado en el puerto: " + 3000);