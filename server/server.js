require("./config/config");

const express = require("express");
const cors = require("cors");

const app = express();
app.use(cors());
const appF = require("firebase/app");
require("firebase/firestore");
require("firebase/auth");
const md5 = require("md5");

const bodyParser = require("body-parser");

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }));

// parse application/json
app.use(bodyParser.json());

class Firebase {
  constructor() {
    appF.initializeApp({
      apiKey: "AIzaSyDR5D__SJXf2rxs7Q_HG-kaUHWwFrbFyWA",
      authDomain: "backindoctor.firebaseapp.com",
      databaseURL: "https://backindoctor.firebaseio.com",
      projectId: "backindoctor",
      storageBucket: "backindoctor.appspot.com",
      messagingSenderId: "188337010629",
      appId: "1:188337010629:web:2bd4050a94a2f6b75a3dac",
      measurementId: "G-DEYKXEFTEW",
    });
    this.db = appF.firestore();
    this.auth = appF.auth();
  }
}

const firebase = new Firebase();

firebase.auth
  .signInWithEmailAndPassword("paciente@gmail.com", "prueba")
  .then(() => {
    console.log("Login Correcto");
  })
  .catch((e) => {
    console.log("Login Error: ", e);
  });

app.get("/pagosRes", function (req, res) {
  res.json("get Usuario LOCAL!!!");
  console.log("Llego un GET a la URL");
  console.log("Data: ", req.url);
});

app.post("/pagos", function (req, res) {
  let body = { ...req.body };
  // let body = req.body;
  console.log("Llego un POST a la URL");
  console.log("Data: ", body);
  let valuePOST = body.value;
  const valueDec = body.value.split(".");
  console.log("Valor split: ", valueDec);

  if (valueDec[1] === "00") {
    valuePOST = valueDec[0].concat(".0");
  }

  const signature = md5(
    `5UnOZ3RtYR465rw70qqM6S3T6d~${body.merchant_id}~${body.reference_sale}~${valuePOST}~${body.currency}~${body.state_pol}`
  );
  console.log("Firma POST:", signature);

  if (signature === body.sign) {
    console.log("Firma Valida");
    firebase.auth.onAuthStateChanged(function (user) {
      if (!user) {
        // User is signed in.
        firebase.auth
          .signInWithEmailAndPassword("paciente@gmail.com", "prueba")
          .then(() => {
            console.log("Login Correcto");
          })
          .catch((e) => {
            console.log("Login Error: ", e);
          });
      }
    });
    var idSolicitud = body.reference_sale.slice(4);
    console.log("Referencia: ", idSolicitud, " = ", body.extra1);
    firebase.db
      .collection("pagos")
      .doc(body.transaction_id)
      .set({
        ...body,
        fechaRegistroPago: new Date(),
      })
      .then(() => {
        console.log("Registrado Pago");
      })
      .catch((error) => {
        console.log("Error: ", error);
      });

    switch (body.state_pol) {
      case "4":
        firebase.db
          .collection("solicitudes")
          .doc(idSolicitud)
          .update({
            estado: "Confirmada",
            novedadPago: "Pago Aceptado",
          })
          .then(() => {
            console.log("Confirmando Oferta");
            res.json("Confirmando Oferta");
          })
          .catch((error) => {
            console.log("Error: ", error);
            res.json("Error Confirmando Oferta");
          });
        break;
      case "6":
        firebase.db
          .collection("solicitudes")
          .doc(idSolicitud)
          .update({
            estado: "Reservada",
            novedadPago: "Pago Declinado",
          })
          .then(() => {
            console.log("Confirmando Oferta");
            res.json("Confirmando Oferta");
          })
          .catch((error) => {
            console.log("Error: ", error);
            res.json("Error Confirmando Oferta");
          });
        break;
      case "5":
        firebase.db
          .collection("solicitudes")
          .doc(idSolicitud)
          .update({
            estado: "Reservada",
            novedadPago: "Pago Expirado",
          })
          .then(() => {
            console.log("Confirmando Oferta");
            res.json("Confirmando Oferta");
          })
          .catch((error) => {
            console.log("Error: ", error);
            res.json("Error Confirmando Oferta");
          });
        break;

      default:
        res.json("Error Confirmando Oferta");
        break;
    }
  } else {
    console.log("Firma Invalida");
    res.json("Firma Invalida");
  }
});

app.put("/usuario/:id", function (req, res) {
  let id = req.params.id;

  res.json({
    id,
  });
});

app.delete("/usuario", function (req, res) {
  res.json("delete Usuario");
});

app.listen(process.env.PORT, () => {
  console.log("Escuchando puerto: ", process.env.PORT);
});
