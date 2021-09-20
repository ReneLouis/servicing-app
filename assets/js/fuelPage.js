/* UPDATE THE FUEL JSON FILE */

const fs = require("fs");
const path = require("path");
const functions = require("./functions");
const { check, validationResult } = require("express-validator");
const { request } = require("http");
const e = require("express");
const { nextTick } = require("process");
const summary = require("./summary");

// // NEW
// /*  ========================================================*/
// /*  === SETUP FUNCTION TO CREATE / UPDATE DATA FRON JSON === */
// let data = fs.readFileSync("./assets/json/fuelTopUp.json");
// let myObj = JSON.parse(data);
// var vehicleIndx = -1;
// const loadVehicles = function (vehicle) {
//   console.log(`loadVehicle function launched for ${vehicle}`);
//   new Promise((resolve, reject) => {
//     data = fs.readFileSync("./assets/json/fuelTopUp.json");
//     myObj = JSON.parse(data);
//     vehicleIndx = myObj.vehicles.findIndex((e) => e.shortName === vehicle);
//     console.log(`in fuelUpdate.loadVehicle, vehicleIndx is ${vehicleIndx}`);
//     resolve(vehicleIndx);
//   });
//   module.exports.vehicleIndx = vehicleIndx;
//   return vehicleIndx;
// };

// module.exports.loadVehicles = loadVehicles;

// //END

let fuelUpdate = async (req, res, next) => {
  const errors = validationResult(req);

  // if(!errors.isEmpty()) {
  //   req.session.feedback = {
  //     errors: errors.array(),
  //   };
  //   return res.redirect('/');
  // }
  // console.log(`request body: ${req.body}`);

  /* CREATE CLASS FOR NEW VEHICLE */
  // class Vehicle {
  //   constructor(name, fuelTopUp) {
  //     (this.name = vehicle), (this.fuelTopUp = []);
  //   }
  // }

  /* SET FORM DATA IN VARIABLES: */
  let topUpDate = req.body.date;
  let topUpQuantity = Number(req.body.quantity);
  let topUpDistance = Number(req.body.distance);
  let unit = req.body.unit;
  let data = fs.readFileSync("./assets/json/fuelTopUp.json");
  let myObj = JSON.parse(data);

  let newData = {
    date: topUpDate,
    quantity: topUpQuantity,
    distance: topUpDistance,
    unit: unit,
  };

  let vehicle = req.params.vehicle;

  //  CREATE NEW CLASS FOR NEW VEHICLE, AND ADD NEW VEHICLE TO LOG.
  if (!myObj.vehicles.some((e) => e.shortName == vehicle)) {
    res.redirect("/");
  }
  let vehicleIndex = myObj.vehicles.findIndex((e) => e.shortName == vehicle);

  console.log(`Vehicle ${vehicle} at index ${vehicleIndex}.`);
  myObj.vehicles[vehicleIndex].fuelTopUp.unshift(newData);

  let newDataAdded = JSON.stringify(newData);
  newData = JSON.stringify(myObj);
  fs.writeFile("./assets/json/fuelTopUp.json", newData, (err) => {
    if (err) throw err;
  });

  // return res.send(`Data submitted for ${req.params.vehicle}: ${newDataAdded}.`);
  let ecoLastTopUp = functions.consumtion(
    myObj.vehicles[vehicleIndex].fuelTopUp[0].quantity,
    myObj.vehicles[vehicleIndex].fuelTopUp[0].distance,
    myObj.vehicles[vehicleIndex].fuelTopUp[0].unit
  );
  console.log(`mpg: ${ecoLastTopUp.mpg} : L/100km : ${ecoLastTopUp.lphkm}`);

  // NEW
  let = totalVehicleData = functions.consumptionTotal(
    myObj.vehicles[vehicleIndex]
  );

  let ecoTotal = functions.consumtion(
    totalVehicleData.quantity,
    totalVehicleData.distance,
    totalVehicleData.unit
  );

  console.log(
    `total distance for ${myObj.vehicles[vehicleIndex].name}: ${ecoTotal.distance} km ; total quantity for ${myObj.vehicles[vehicleIndex].name}: ${ecoTotal.quantity} ${ecoTotal.unit}`
  );

  res.render("layout", {
    pageTitle: "Summary | " + myObj.vehicles[vehicleIndex].name,
    template: "summary",
    vehicle: req.params.vehicle,
    vehicleName: myObj.vehicles[vehicleIndex].name,
    vehicleData: myObj.vehicles[vehicleIndex],
    vehicleEconomy: ecoLastTopUp,
    vehicleEconomyTotal: ecoTotal,
    fuellingData: true,
  });

  // function sleep() {
  //   return new Promise((resolve) => {
  //     console.log("this is: " + req.params.vehicle);
  //     setTimeout(() => {
  //       resolve(
  //         res.render("pages/fuelTopUp", {
  //           vehicle: req.params.vehicle,
  //           vehicleName: myObj.vehicles[vehicleIndex].name,
  //           // vehicleName: myObj.vehicles[vehicleIndx].name,
  //         })
  //       );
  //     }, 5000);
  //   });
  // }
  // async function asyncCall() {
  //   console.log("calling");
  //   const result = await sleep();
  //   console.log(result);
  // }
  // asyncCall();
  next();
};

module.exports.fuelUpdate = fuelUpdate;

/*   ==== DSIPLAY FUEL PQGE FOR VEHICLE ON GET REQUEST === */
const fuelPage = async (req, res) => {
  await functions.loadVehicles(req.params.vehicle);
  console.log(`after the ext index is ${functions.vehicleIndx}`);
  if (functions.vehicleIndx !== -1) {
    res.render("layout", {
      pageTitle:
        "Fuel Top Up | " + functions.myObj.vehicles[functions.vehicleIndx].name,
      template: "fuelTopUp",
      vehicle: req.params.vehicle,
      vehicleName: functions.myObj.vehicles[functions.vehicleIndx].name,
    });
  } else {
    res.redirect(path.join("/"));
  }
};

module.exports.fuelPage = fuelPage;
