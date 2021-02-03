require("./config/config");

const express = require("express");
const app = express();

const bodyParser = require("body-parser");

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }));

// parse application/json
app.use(bodyParser.json());

app.get("/pagos", function (req, res) {
  res.json("get Usuario LOCAL!!!");
  console.log("Llego un GET a la URL");
  console.log("Data: ", req);
});

app.post("/pagos", function (req, res) {
  let body = req.body;
  console.log("Llego un POST a la URL");
  console.log("Data: ", body);
  console.log("Data: ", req);

  if (body === undefined) {
    res.status(400).json({
      ok: false,
      mensaje: "El nombre es necesario",
    });
  } else {
    let data = res.json({
      persona: body,
    });
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
