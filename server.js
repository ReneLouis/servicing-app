const express = require("express");
const path = require("path");
const fs = require("fs");

// module to post data from form and process it:
const bodyParser = require("body-parser");

/* MODULE TO CHECK AND VALIDATE DATA ENTERED ON FORM */
const { check, validationResult } = require("express-validator");

// const functions = require("./assets/js/functions");
const fuelPage = require("./assets/js/fuelPage");
const newVehicle = require("./assets/js/newVehicle");
const summary = require("./assets/js/summary");

const app = express();
const port = process.env.PORT || 1971;

app.use(bodyParser.urlencoded({ extended: true }));

// let vehicleIndx = -1;

/* SETUP EJS TEMPLATE */
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "./views"));

/*  * STATIC FILES MIDDLEWARE: allows server to see statics files such as imaes for sites.
   BELOW MIDDLEWARE FEED ALL IN ROOT FOLDER "./" TO THE SERVER: */
app.use(express.static(path.join(__dirname, "static")));

/*  * STATIC FILES MIDDLEWARE: allows server to see statics files such as imaes for sites.
 * BELOW MIDDLEWARE FEED ALL IN ROOT FOLDER "./" TO THE SERVER: */
// app.use(express.static(path.join(__dirname, "./HondaCBF/index.html")));

/*  ========================================================*/
/*  ================= LOAD DATA FRON JSON ================= */
// let data = fs.readFileSync("./assets/json/fuelTopUp.json");
// let myObj = JSON.parse(data);

/*  ========================================================*/
/*  =============  W E L C O M E   P A G E ================ */

app.get("/", (req, res) => {
  let data = fs.readFileSync("./assets/json/fuelTopUp.json");
  let myObj = JSON.parse(data);
  res.render("layout", {
    pageTitle: "Welcome",
    template: "index",
    vehicleList: myObj.vehicles,
  });
});

app.post("/", [check("name").trim().escape()], newVehicle);

/*  ====================================================== */
/*  =============== F U E L I N G   P A G E ===============*/

/*  GET REQUEST ON FUELING PAGE */

app.get("/fueling/:vehicle", fuelPage.fuelPage);

/*  PROCESS DATA ENTERED ON FUALING PAGE */

app.post(
  "/fueling/:vehicle",
  [
    check("date")
      .trim() // remove empty characters at beginning and end
      .escape() // remove any html
      .isDate()
      .notEmpty(),
    check("quantity")
      .trim()
      .escape()
      .isDecimal({ decimal_digits: 2 })
      .notEmpty(),
    check("quantity")
      .trim()
      .escape()
      .isDecimal({ decimal_digits: 1 })
      .notEmpty(),
  ],
  fuelPage.fuelUpdate
);

/*  ==================================== */
/*  ROUTE ON SUMMARY PAGE */
app.get("/summary/:vehicle", summary);

app.listen(port, () => {
  console.log(`Express is now listening on port ${port}`);
});
