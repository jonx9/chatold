/**
 * name:UserC
 * description: controller for module of Users.
 * Author: Cristian Camilo Castrillon.
 * Date: 2020-11-06
 */

const UserDAL = require("../DAL/User/User");
const UserService = new UserDAL();


exports.getUsers = (req, res, next) => {
  res.render('common/Not_found', {
    pageTitle: 'Get Users',
    path: '/admin/add-product',
    editing: false,
    hasError: false,
    errorMessage: null,
    validationErrors: []
  });
};

// export a new user.
exports.PostCreate = (req, res, next) => {
  UserService.Create();
};


// export a new user.
exports.Create = (req, res, next) => {
  console.log("res render")
  res.render('User/Create', {
    pageTitle: 'Creacion de usuarios',
    path: '/admin/add-product',
    editing: false,
    hasError: false,
    errorMessage: null,
    validationErrors: [],
    oldInput: {
      email: '',
      password: ''
    },
  });
};