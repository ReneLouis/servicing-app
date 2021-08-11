/* CREATE NEW VEHICLE */

const fs = require("fs");
const path = require("path");

newVehicle = async (req, res) => {
  class Vehicle {
    constructor(name, shortName, fuelTopUp) {
      (this.name = vehicleName),
        (this.shortName = vehicleShortName),
        (this.fuelTopUp = []);
    }
  }

  let vehicleName = req.body.name;
  let vehicleShortName = vehicleName.trim().split(" ").join("_");
  console.log("short name: " + vehicleShortName);
  // create new vehicle in JSON file:

  let data = fs.readFileSync("./assets/json/fuelTopUp.json");
  let myObj = JSON.parse(data);

  if (!myObj.vehicles.some((e) => e.name == vehicleName)) {
    // res.send(`There is already a vehcicle called ${vehicleName}.`);
    // res.redirect(path.join("/", vehicleShortName));

    myObj.vehicles.push(new Vehicle(vehicleName, vehicleShortName));
    data = JSON.stringify(myObj);
    fs.writeFile("./assets/json/fuelTopUp.json", data, (err) => {
      if (err) throw err;
    });
  }

  console.log(req.body);
  res.redirect(path.join("/summary/", vehicleShortName));
};

module.exports = newVehicle;