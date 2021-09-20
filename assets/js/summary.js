const functions = require("./functions");
const path = require("path");

const summary = async (req, res, next) => {
  await functions.loadVehicles(req.params.vehicle); // set data, myObj & vehicleIndx
  if (functions.vehicleIndx !== -1) {
    // NEW
    let fuellingData = true;
    // console.log(functions.myObj.vehicles[functions.vehicleIndx].fuelTopUp);
    if (
      functions.myObj.vehicles[functions.vehicleIndx].fuelTopUp.length !== 0
    ) {
      // END

      // GET TOTAL FUEL AND TOTAL DISTANCE
      ecoLastTopUp = functions.consumtion(
        functions.myObj.vehicles[functions.vehicleIndx].fuelTopUp[0].quantity,
        functions.myObj.vehicles[functions.vehicleIndx].fuelTopUp[0].distance,
        functions.myObj.vehicles[functions.vehicleIndx].fuelTopUp[0].unit
      );
      //   AVERAGE CONSUMPTION FOR ALL TOPUP
      let qTotal = 0;
      let kmTotal = 0;
      for (
        let i = 0;
        i < functions.myObj.vehicles[functions.vehicleIndx].fuelTopUp.length;
        i++
      ) {
        qTotal +=
          functions.myObj.vehicles[functions.vehicleIndx].fuelTopUp[i].quantity;
        if (
          functions.myObj.vehicles[functions.vehicleIndx].fuelTopUp[i].unit ===
          "km"
        ) {
          kmTotal +=
            functions.myObj.vehicles[functions.vehicleIndx].fuelTopUp[i]
              .distance;
        } else if (
          functions.myObj.vehicles[functions.vehicleIndx].fuelTopUp[i].unit ===
          "miles"
        ) {
          kmTotal +=
            functions.myObj.vehicles[functions.vehicleIndx].fuelTopUp[i]
              .distance * 1.609;
        }
      }
      console.log(`qTotal: ${qTotal} ; kmTotal: ${kmTotal}`);
      ecoTotal = functions.consumtion(qTotal, kmTotal, "km");
      // let ecoTotal = functions.consumptionTotal(functions.vehicleIndx);
    } else {
      {
        // console.log(`Vehicle ${req.params.vehicle} has no fuelling data.`);
        fuellingData = false;
        ecoLastTopUp = 0;
        ecoTotal = 0;
        // res.redirect(path.join("/"));
      }
    }
    console.log(
      ` fuel avg for ${
        functions.myObj.vehicles[functions.vehicleIndx].name
      } is: ${ecoTotal.lphkm} L/100km / ${ecoTotal.mpg} MPG.`
    );
    res.render("layout", {
      pageTitle:
        "Summary | " + functions.myObj.vehicles[functions.vehicleIndx].name,
      template: "summary",
      vehicle: req.params.vehicle,
      vehicleName: functions.myObj.vehicles[functions.vehicleIndx].name,
      vehicleData: functions.myObj.vehicles[functions.vehicleIndx],
      vehicleEconomy: ecoLastTopUp,
      vehicleEconomyTotal: ecoTotal,
      fuellingData: fuellingData,
    });
  } else {
    res.redirect(path.join("/"));
  }
  // console.log(`function consumtion with ${req.params.vehicle}`);
  // next();
};

module.exports = summary;
