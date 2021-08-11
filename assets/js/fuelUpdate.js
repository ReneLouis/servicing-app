/* UPDATE THE FUEL JSON FILE */

const fs = require("fs");
// const path = require("path");
const { check, validationResult } = require("express-validator");
const { request } = require("http");
const e = require("express");
const { nextTick } = require("process");

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
  let topUpMileage = Number(req.body.mileage);
  let data = fs.readFileSync("./assets/json/fuelTopUp.json");
  let myObj = JSON.parse(data);

  let newData = {
    date: topUpDate,
    quantity: topUpQuantity,
    mileage: topUpMileage,
  };

  let vehicle = req.params.vehicle;

  //  CREATE NEW CLASS FOR NEW VEHICLE, AND ADD NEW VEHICLE TO LOG.
  if (!myObj.vehicles.some((e) => e.shortName == vehicle)) {
    console.log(`${vehicle} not found in array.`);
    console.log(newData);
    res.redirect("/");
    // myObj.vehicles.push(new Vehicle(vehicle));
  }
  // REPLACE WITH
  // let vehicleIndex = myObj.vehicles.findIndex((e) => e.name == vehicle);
  let vehicleIndex = myObj.vehicles.findIndex((e) => e.shortName == vehicle);

  console.log(`Vehicle ${vehicle} at index ${vehicleIndex}.`);
  myObj.vehicles[vehicleIndex].fuelTopUp.unshift(newData);

  let newDataAdded = JSON.stringify(newData);
  newData = JSON.stringify(myObj);
  fs.writeFile("./assets/json/fuelTopUp.json", newData, (err) => {
    if (err) throw err;
  });

  // return res.send(`Data submitted for ${req.params.vehicle}: ${newDataAdded}.`);

  res.render("layout", {
    pageTitle: "Summary | " + myObj.vehicles[vehicleIndex].name,
    template: "summary",
    vehicle: req.params.vehicle,
    vehicleName: myObj.vehicles[vehicleIndex].name,
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

module.exports = fuelUpdate;
