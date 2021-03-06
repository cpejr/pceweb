const express = require("express");
const firebase = require("firebase");
const auth = require("./middleware/auth");
const Device = require("../models/devices");
const Client = require("../models/clients");
const Station = require("../models/station");
const Manager = require("../models/manager");
const User = require("../models/user");

const router = express.Router();

router.get("/signup", auth.isAuthenticated, auth.isADM, function(
  req,
  res,
  next
) {
  res.render("admin/clientsRegistration", {
    title: "Cadastro de Clientes",
    layout: "layoutdashboard"
  });
});

router.get("/list", auth.isAuthenticated, auth.isADM, (req, res) => {
  Client.getAll()
    .then(clients => {
      res.render("admin/clientsList", {
        title: "Lista de Clientes",
        layout: "layoutdashboard",
        clients
      });
    })
    .catch(error => {
      res.redirect("/error");
      console.log(error);
    });
});

router.get("/edit/:id", auth.isAuthenticated, auth.isADM, (req, res) => {
  Client.getById(req.params.id).then(client => {
    res.render("admin/clientsRegistrationEdit", {
      title: "Edição de Perfil",
      layout: "layoutdashboard",
      client
    });
  });
});

router.get("/devices", auth.isAuthenticated, auth.isADM, (req, res) => {
  res.render("admin/clientsXdevicesHome", {
    title: "Clientes X  Aparelhos",
    layout: "layoutdashboard"
  });
});

router.get("/clientsXdevices", auth.isAuthenticated, auth.isADM, (req, res) => {
  res.render("admin/clientsXdevices", {
    title: "Clientes X  Aparelhos",
    layout: "layoutdashboard"
  });
});

router.post("/signup", function(req, res, next) {
  const ativa = req.body.client;
  ativa.type = "ClienteADM";
  firebase
    .auth()
    .createUserWithEmailAndPassword(ativa.email, ativa.password)
    .then(userF => {
      ativa.uid = userF.user.uid;
      var usuario = ativa;
      Client.create(ativa)
        .then(id => {
          User.create(usuario)
            .then(id => {
              //    console.log("Usuario deu bom");
            })
            .catch(error => {
              console.log(error);
              res.redirect("/error");
            });
          res.redirect("/client/list");
        })
        .catch(error => {
          console.log(error);
          switch (error.code) {
            case 11000:
              if (error.keyPattern.codClient) {
                req.flash(
                  "danger",
                  "Código do Cliente inserido já está em uso"
                );
              } else if (error.keyPattern.cnpj) {
                req.flash("danger", "CNPJ inserido já está em uso");
              }
              break;
          }
          res.redirect("/client/signup");
        });
    })
    .catch(error => {
      switch (error.code) {
        case "auth/email-already-in-use":
          req.flash("danger", "Email já está sendo utilizado");
          break;
        case "auth/weak-password":
          req.flash("danger", "A senha deve ter no mínimo 6 caracteres");
          break;
      }

      res.redirect("/client/signup");
      console.log(error);
    });
});

router.post("/delete/:id", (req, res) => {
  Client.getById(req.params.id)
    .then(client => {
      Client.delete(req.params.id)
        .then(() => {
          User.getByUid(client.uid)
            .then(user => {
              User.delete(user.id)
                .then(() => {
                  res.redirect("/client/list");
                })
                .catch(error => {
                  console.log(error);
                  res.redirect("/error");
                });
            })
            .catch(error => {
              console.log(error);
              res.redirect("/error");
            });
        })
        .catch(error => {
          console.log(error);
          res.redirect("/error");
        });
    })
    .catch(error => {
      console.log(error);
      res.redirect("/error");
    });
});

router.post("/:id", (req, res) => {
  const client = req.body.client;
  Client.update(req.params.id, client)
    .then(() => {
      res.redirect("/client/list");
    })
    .catch(error => {
      console.log(error);
      res.redirect("/error");
    });
});

module.exports = router;
