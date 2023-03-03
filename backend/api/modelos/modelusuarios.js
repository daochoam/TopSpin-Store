var ModelUsuarios = {}
const { response } = require('express');
const mongoose = require('mongoose')
const Schema = mongoose.Schema;
//var trimStart = require('string.prototype.trimstart')
//var trimEnd = require('string.prototype.trimend')

var UsuariosSchema = new Schema({
    Rol: Number,
    Cedula: {
        type: Number,
        unique: true,
        require: true
    },
    Name: {
        type: String,
        require: true
    },
    LastName: String,
    Email: {
        type: String,
        unique: true,
        require: true
    },
    Password: String,
    Age: Number | null,
    Phone: Number | null,
    Address: String,
    Credicards: []
})

const MyModel = mongoose.model('Users', UsuariosSchema)

/**************************************************************/
/******************           CREATE         ******************/
ModelUsuarios.Save = function (post, callback) {
    MyModel.find({ Cedula: post.Cedula }, {}, (error, documentos) => {
        if (documentos.length > 0) {
            return callback({ state: false, message: `The Cedula ${post.Cedula} is already registered` })
        }
        else {
            MyModel.find({ Email: post.Email }, {}, (error, documentos) => {
                if (documentos.length > 0) {
                    return callback({ state: false, message: `The Email ${post.Email} is already registered` })
                }
                else {
                    const instancia = new MyModel
                    instancia.Rol = post.Rol,
                    instancia.Cedula = parseInt(post.Cedula),
                    instancia.Name = post.Name.trim(),
                    instancia.LastName = post.LastName.trim(),
                    instancia.Email = post.Email.trim().toLowerCase(),
                    instancia.Age = post.Age,
                    instancia.Phone = post.Phone,
                    instancia.Address = post.Address.trim(),
                    instancia.save((error, creado) => {
                    return callback({ state: true, message: `User created successfully` })
                    })
                }
            })
        }
    })
}

ModelUsuarios.Register = function (post, callback) {
    MyModel.find({ Email: post.Email.toLowerCase() }, {}, (error, documentos) => {
        if (documentos.length > 0) {
            return callback({ state: false, data: error })
        }
        MyModel.find({ Cedula: post.Cedula }, {}, (error, documentos) => {
            if (documentos.length > 0) {
                return callback({ state: false, data: error })
            }
            else {
                const instancia = new MyModel
                instancia.Cedula = parseInt(post.Cedula)
                instancia.Name = post.Name
                instancia.Email = post.Email.trim().toLowerCase()
                instancia.Password = post.Password
                instancia.Rol = 2
                instancia.save((error, creado) => {
                    return callback({ state: true, creado })
                })
            }

        })
    })
}

/**************************************************************/
/******************           READ           ******************/
ModelUsuarios.Login = function (post, callback) {
    MyModel.find({ Email: post.Email, Password: post.Password }, { Name: 1, Rol: 1 }, (error, documentos) => {
        if (error) {
            return callback({ state: false, mensaje: error })
        }
        else {
            if (documentos.length == 0) {
                return callback({ state: false, mensaje: "Datos invalidos" })
            }
            else {
                return callback({ state: true, data: documentos })
            }
        }
    })
}

/*Listar todos los Usuarios*/
ModelUsuarios.LoadAllUsers = function (post, callback) {
    MyModel.find({}, {}, (error, documentos) => {
        if (error) {
            return callback({ state: false, data: error })
        }
        else {
            return callback({ state: true, data: documentos })
        }
    })
}
/**********   Listar Usuarios por Id  **************/
ModelUsuarios.LoadById = function (post, callback) {
    MyModel.findById(post._id, {}, (error, documentos) => {
        if (error) {
            return callback({ state: false, data: error })
        } else {
            return callback({ state: true, data: documentos })
        }
    })
}

/**********  Listar Usuarios por Document  ************/
ModelUsuarios.LoadByDocument = function (post, callback) {
    MyModel.find({ Cedula: post.Cedula }, {}, (error, documentos) => {
        if (documentos.length > 0) {
            if (error) {
                return callback({ state: false, data: error })
            }
            else {
                return callback({ state: true, data: documentos })
            }
        } else {
            return callback({ state: false })
        }
    })
}

/***************************************************************/
/******************        UPDATE             ******************/
ModelUsuarios.UpdateByDocument = function (post, callback) {
    MyModel.find({ Cedula: post.Cedula }, {}, (error, documentos) => {
        if (error)
            return callback({ state: true, error })
        else {
            if (documentos.length > 0) {
                MyModel.findByIdAndUpdate(documentos[0]._id, {
                    Name: post.Name.trimStart().trimEnd(),
                    Password: post.Password.trimStart().trimEnd(),
                }, (error, usuariomodificado) => {
                    if (error) {
                        console.log(error)
                        return callback({ state: false, mensaje: error })
                    }
                    else {
                        return callback({ state: true })
                    }
                })
            }
            else {
                return callback({ state: false })
            }
        }  // return callback({cantidad:documentos.length})
    })
}

/*Actualizar Usuarios por Id*/
ModelUsuarios.UpdateById = function (post, callback) {
    console.log(post.Age)
    MyModel.findByIdAndUpdate(post._id, {
        Rol: parseInt(post.Rol),
        Cedula: parseInt(post.Cedula),
        Name: post.Name,
        LastName: post.LastName,
        Email: post.Email.toLowerCase(),
        Age: parseInt(post.Age),
        Phone: parseInt(post.Phone),
        Address: post.Address,
    }, (err, doc) => {
        if (err) {
            console.log(err)
            return callback({ state: false, mensaje: err })
        }
        else {
            return callback({ state: true })
        }
    })
}

/***************************************************************/
/******************         DELETE            ******************/
ModelUsuarios.DeleteByDocument = function (post, callback) {
    MyModel.find({ Cedula: post.Cedula }, {}, (error, documentos) => {
        if (documentos.length == 0)
            return callback({ state: false, error })
        else {
            {

                MyModel.findOneAndDelete(post.Cedula, (error, eliminado) => {
                    if (error) {
                        return callback({ state: false, data: error })
                    }
                    else {
                        return callback({ state: true })
                    }
                })
            }
        }
    })
}

ModelUsuarios.DeleteById = function (post, callback) {
    MyModel.findByIdAndDelete(post._id, (error, eliminado) => {
        if (error) {
            return callback({ state: false, data: error })
        }
        else {
            return callback({ state: true })
        }
    })
}

module.exports.usuarios = ModelUsuarios