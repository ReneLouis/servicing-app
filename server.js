const express = require("express");
const path = require("path");
const fs = require("fs");

// module to post data from form and process it:
const bodyParser = require("body-parser");

/* MODULE TO CHECK AND VALIDATE DATA ENTERED ON FORM */
const { check, validationResult } = require("express-validator");

// const fuelTopUp = require("./HondaCBF/js/assets/fuelTopUp.json");
const fuelUpdate = require("./assets/js/fuelUpdate");
const newVehicle = require("./assets/js/newVehicle");

const app = express();
const port = process.env.PORT || 1971;

app.use(bodyParser.urlencoded({ extended: true }));

/*  === SETUP FUNCTION TO CREATE / UPDATE DATA FRON JSON === */
let data = fs.readFileSync("./assets/json/fuelTopUp.json");
let myObj = JSON.parse(data);
let vehicleIndx = -1;
const loadVehicles = function (vehicle) {
  return new Promise((resolve, reject) => {
    data = fs.readFileSync("./assets/json/fuelTopUp.json");
    myObj = JSON.parse(data);
    vehicleIndx = myObj.vehicles.findIndex((e) => e.shortName === vehicle);
    console.log(`R E S O L V E D ! | vehicleIndx = ${vehicleIndx}`);
    resolve();
  });
};

/* SETUP EJS TEMPLATE */
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "./views"));

/*  * STATIC FILES MIDDLEWARE: allows server to see statics files such as imaes for sites.
   BELOW MIDDLEWARE FEED ALL IN ROOT FOLDER "./" TO THE SERVER: */
app.use(express.static(path.join(__dirname, "static")));

/*  * STATIC FILES MIDDLEWARE: allows server to see statics files such as imaes for sites.
 * BELOW MIDDLEWARE FEED ALL IN ROOT FOLDER "./" TO THE SERVER: */
// app.use(express.static(path.join(__dirname, "./HondaCBF/index.html")));

/*  W E L C O M E   P A G E */
app.get("/", (req, res) => {
  res.render("layout", {
    pageTitle: "Welcome",
    template: "index",
    vehicleList: myObj.vehicles,
  });
});

app.post(
  "/",
  [check("name").trim().escape()], // (req, res) => {
  //   let vehicleName = req.body.name;
  //   let vehicleShortName = vehicleName.trim().split(" ").join("_");
  //   console.log(vehicleShortName);
  //   // res.send(`Sent response from /. New vehicle is ${vehicleName}`);
  //   console.log(req.body);
  //   res.redirect(path.join("/", vehicleShortName));
  // }
  newVehicle
);

app.get("/fueling/:vehicle", (req, res) => {
  loadVehicles(req.params.vehicle);
  // console.log("loadVehicle launched from Route /:vehicle");
  if (vehicleIndx !== -1) {
    res.render("layout", {
      pageTitle: "Fuel Top Up | " + myObj.vehicles[vehicleIndx].name,
      template: "fuelTopUp",
      vehicle: req.params.vehicle,
      vehicleName: myObj.vehicles[vehicleIndx].name,
    });
  } else {
    res.redirect(path.join("/"));
  }
});

/* PROCESS DATA ENTERED ON FORM */

app.post(
  "/fueling/:vehicle",
  [
    check("date")
      .trim() // remove empty characters at beginning and end
      .escape() // remove any html
      .isDate(),
    check("quantity").trim().escape().isDecimal({ decimal_digits: 2 }),
    check("quantity").trim().escape().isDecimal({ decimal_digits: 1 }),
  ],
  fuelUpdate
);

/*  ROUTE ON SUMMARY PAGE */
app.get("/summary/:vehicle", async (req, res) => {
  await loadVehicles(req.params.vehicle); // set data, myObj & vehicleIndx
  // console.log("loadVehicle launched from /summary/" + req.params.vehicle);
  if (vehicleIndx !== -1) {
    res.render("layout", {
      pageTitle: "Summary | " + myObj.vehicles[vehicleIndx].name,
      template: "summary",
      vehicle: req.params.vehicle,
      vehicleName: myObj.vehicles[vehicleIndx].name,
    });
  } else {
    res.redirect(path.join("/"));
  }
});

app.listen(port, () => {
  console.log(`Express is now listening on port ${port}`);
});
