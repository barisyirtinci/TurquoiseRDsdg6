import express from "express";
import bodyParser from "body-parser";
import axios from "axios";
import * as fs from "fs";
import { exec } from "child_process"; // child_process'ten exec fonksiyonunu kullanın

const app = express();
const port = process.env.PORT || 3000;

var stoutData;

app.use(express.static("public"));
app.use(bodyParser.urlencoded({ extended: true }));

let rawdata = fs.readFileSync("countries.json");
let encoded = fs.readFileSync("data.json");

const jsonData = JSON.parse(rawdata);
const encodedJson = JSON.parse(encoded);

app.get("/", async (req, res) => {
  res.render("index.ejs", { starterPage: true, jsonData: jsonData });
});

var getObjectByValue = function (array, key, value) {
  return array.filter(function (object) {
    return object[key] === value;
  });
};

app.post("/analysis", async (req, res) => {
  const cityName = req.body["city"];
  const countryName = req.body["country"];
  const year = req.body["year"];
  const concatCity = cityName + "_" + countryName;
  var selectedCityEncode = getObjectByValue(
    encodedJson,
    "City_Country",
    concatCity
  );

  var aqi = await runAirScript({ encodedCity: selectedCityEncode[0].Encoded });
  var wpi = await runWaterScript({
    encodedCity: selectedCityEncode[0].Encoded,
  });
  console.log(aqi);
  console.log(wpi);
  res.render("index.ejs", {
    analysisPage: true,
    cityName: cityName,
    year: year,
    aqi: aqi,
    wpi: wpi,
  });
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});

async function runAirScript(encodedCity) {
  const airScript = `python air_pollution_model.py run 1,2,3,5,76,7,58,5,6,1322,2,3,5,6,7,8,0,340,5,3,2,1 ${encodedCity.encodedCity}`;

  return new Promise(function (resolve, reject) {
    exec(airScript, (error, stdout, stderr) => {
      if (error) {
        console.log(error);
      }
      resolve(stdout.trim());
    });
  });
}

async function runWaterScript(encodedCity) {
  const waterScript = `python water_pollution_model.py run 1,2,3,5,76,7,58,5,6,1322,2,3,5,6,7,8,0,340,5,3,2,1 ${encodedCity.encodedCity}`;

  return new Promise(function (resolve, reject) {
    exec(waterScript, (error, stdout, stderr) => {
      if (error) {
        console.log(error);
      }
      resolve(stdout.trim());
    });
  });
}
