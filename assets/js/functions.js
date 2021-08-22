const fs = require("fs");

/*  ========================================================*/
/*  === SETUP FUNCTION TO CREATE / UPDATE DATA FRON JSON === */
// let data = fs.readFileSync("./assets/json/fuelTopUp.json");
// let myObj = JSON.parse(data);
// var vehicleIndx = -1;
const loadVehicles = function (vehicle) {
  let data = fs.readFileSync("./assets/json/fuelTopUp.json");
  let myObj = JSON.parse(data);
  // console.log(`loadVehicle function launched for ${vehicle}`);
  new Promise((resolve, reject) => {
    // data = fs.readFileSync("./assets/json/fuelTopUp.json");
    // myObj = JSON.parse(data);
    vehicleIndx = myObj.vehicles.findIndex((e) => e.shortName === vehicle);
    // console.log(`in functions.loadVehicle, vehicleIndx is ${vehicleIndx}`);
    resolve(vehicleIndx);
  });
  module.exports.vehicleIndx = vehicleIndx;
  module.exports.myObj = myObj;
  return vehicleIndx;
};

module.exports.loadVehicles = loadVehicles;

/*  ========================================================*/
/*  ======== FUNCTION TO CALCULATE L/100km AND MPG ======== */

const consumtion = function (q, d, unit) {
  let clkm;
  let cmpg;
  if (unit === "miles") {
    clkm = Math.round((q / (d * 1.609)) * 100 * 100) / 100; // L/100km
    cmpg = Math.round((d / (q / 4.54609)) * 100) / 100; // MPG
  } else if (unit === "km") {
    clkm = Math.round((q / d) * 100 * 100) / 100; // L/100km
    cmpg = Math.round((d / 1.609 / (q / 4.54609)) * 100) / 100;
  }
  //   let economy = { mpg: cmpg, lphkm: clkm };
  //   console.log(`in consumtion, ${clkm} L/100km or ${cmpg} mpg.`);
  //   console.log(`in consumption: ${economy.mpg} mpg`);
  module.exports.economy = { mpg: cmpg, lphkm: clkm };
  return { mpg: cmpg, lphkm: clkm };
};
module.exports.consumtion = consumtion;

const consumptionTotal = function (object) {
  // let data = fs.readFileSync("./assets/json/fuelTopUp.json");
  // let myObj = JSON.parse(data);
  let qTotal = 0;
  let kmTotal = 0;
  for (let i = 0; i < object.fuelTopUp.length; i++) {
    qTotal += object.fuelTopUp[i].quantity;
    if (object.fuelTopUp.unit === "km") {
      kmTotal += object.fuelTopUp[i].distance;
    } else if (object.fuelTopUp[i].unit === "miles") {
      kmTotal += object.fuelTopUp[i].distance * 1.609;
    }
  }
  // let ecoTotal = functions.consumtion(qTotal, kmTotal, "km");
  // module.exports.consumptionTotal = consumtion(qTotal, kmTotal, "km");
  // console.log(`consumptionTotal.mpg: ${consumptionTotal.mpg}`);
  // return { mpg: .mpg, lphkm: ecoTotal.lphkm };
  console.log(
    `result of consumptionTotal function: ${{
      quantity: qTotal,
      distance: kmTotal,
      unit: "km",
    }}`
  );
  return { quantity: qTotal, distance: kmTotal, unit: "km" };
};

module.exports.consumptionTotal = consumptionTotal;
