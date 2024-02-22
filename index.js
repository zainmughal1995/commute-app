// Map Initialization
var map = L.map("map", { attributionControl: false }).setView(
  [51.505, -0.09],
  13
);
var OpenStreetMap_Mapnik = L.tileLayer(
  "https://tile.openstreetmap.org/{z}/{x}/{y}.png",
  {
    maxZoom: 19,
    attribution:
      '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
  }
);
map.locate({ setView: true, maxZoom: 13 }); // Request location, set map view, and maximum zoom
OpenStreetMap_Mapnik.addTo(map);
var geocoder = L.Control.geocoder().addTo(map);
const elementToRemove = document.querySelector(".leaflet-top.leaflet-right");
// Check if the element exists
if (elementToRemove) {
  // Remove the element from its parent node
  elementToRemove.parentNode.removeChild(elementToRemove);
}
// DOM ELEMENTS
let startingInput = document.getElementById("starting-point");
let endingInput = document.getElementById("ending-point");
let carModel = document.getElementById("car-model");
let locateMeButton = document.getElementById("locate-me-button");
let carImage = document.getElementById("carImage");
let mainBody = document.querySelector(".main");
let mainHeader = document.querySelector(".header");
let advancedButton = document.querySelector(".button-advanced");
let calculateButton = document.querySelector(".button-calculate");
let startingMarker = null;
let endingMarker = null;

// DOM ELEMENTS INTERACTION

// This function locates the current user and adds a marker there while updating the input field
locateMeButton.addEventListener("click", function () {
  map.locate({ setView: true, maxZoom: 15 });

  map.on("locationfound", function (e) {
    var currentLat = e.latlng.lat;
    var currentLng = e.latlng.lng;

    if (startingMarker == null) {
      startingMarker = L.marker([currentLat, currentLng], {
        icon: L.icon({
          iconUrl: "marker-icon.png",
          iconSize: [30, 30],
        }),
        shadow: false,
      }).addTo(map);
    } else if (startingMarker._latlng.lat !== e.latlng.lat) {
      map.removeLayer(startingMarker);
      startingMarker = L.marker([currentLat, currentLng], {
        icon: L.icon({
          iconUrl: "marker-icon.png",
          iconSize: [30, 30],
        }),
        shadow: false,
      }).addTo(map);
    }

    startingInput.value = `${currentLat}, ${currentLng}`;
  });
});

// This function adds a point but only when user input is in focus mode
function startingPointFunction() {
  map.on("click", function (e) {
    startingInput.value = e.latlng.lat + ", " + e.latlng.lng;
    if (startingMarker !== null) {
      map.removeLayer(startingMarker);
    }

    startingMarker = L.marker([e.latlng.lat, e.latlng.lng], {
      icon: L.icon({
        iconUrl: "marker-icon.png",
        iconSize: [30, 30],
      }),
      shadow: false,
    }).addTo(map);
    disableMapInteraction();
  });
}
function disableMapInteraction() {
  map.off("click");
}

// Adding a point by manually geocording input field
// startingInput.addEventListener("keydown", function (event) {
//   if (event.keyCode === 13) {
//     geocoder.geocode(startingInput.value, function (results) {
//       console.log(results);
//     });
//   }
// });

// Ending point getting end point from user
function endingPointFunction() {
  map.on("click", function (e) {
    endingInput.value = e.latlng.lat + ", " + e.latlng.lng;

    if (endingMarker !== null) {
      map.removeLayer(endingMarker);
    }

    endingMarker = L.marker([e.latlng.lat, e.latlng.lng], {
      icon: L.icon({
        iconUrl: "marker-icon.png",
        iconSize: [30, 30],
      }),
      shadow: false,
    }).addTo(map);
    disableMapInteraction();
  });
}
function disableMapInteraction() {
  map.off("click");
}

// Select Option Interaction

// Add event listener for change event
carModel.addEventListener("change", function () {
  // Get the selected option
  var selectedOption = this.options[this.selectedIndex].value;

  // remove blank value
  if (this.options[0].value === "") {
    this.remove(0);
  }

  changeThumbnailImage(selectedOption);
});

function changeThumbnailImage(value) {
  if (value == "corolla") {
    carImage.src = "corolla.jpg";
  }
  if (value == "alto") {
    carImage.src = "alto.png";
  }
  if (value == "mehran") {
    carImage.src = "mehran.jpg";
  }
  if (value == "vitz") {
    carImage.src = "vitz.jpg";
  }
}

// Theme Mode
let toggleButton = document.getElementById("toggleIcon");
toggleButton.addEventListener("click", function () {
  if (this.classList.contains("fa-toggle-off")) {
    this.classList.add("fa-toggle-on");
    this.classList.remove("fa-toggle-off");
    setDarkTheme();
  } else if (this.classList.contains("fa-toggle-on")) {
    this.classList.remove("fa-toggle-on");
    this.classList.add("fa-toggle-off");
    setLightTheme();
  }
});

function setDarkTheme() {
  mainBody.classList.add("bg-gray-900");
  mainBody.classList.add("text-white");
  mainHeader.classList.add("bg-gray-800");
  mainHeader.classList.add("text-white");
  startingInput.classList.add("text-gray-900");
  endingInput.classList.add("text-gray-900");
  carModel.classList.add("text-gray-900");
  locateMeButton.classList.add("text-gray-900");
  advancedButton.classList.add("text-gray-900");
}

function setLightTheme() {
  mainBody.classList.remove("bg-gray-900");
  mainBody.classList.remove("text-white");
  mainHeader.classList.remove("bg-gray-800");
  mainHeader.classList.remove("text-white");
  startingInput.classList.remove("text-gray-900");
  endingInput.classList.remove("text-gray-900");
  carModel.classList.remove("text-gray-900");
  locateMeButton.classList.remove("text-gray-900");
  advancedButton.classList.remove("text-gray-900");
}

// Calculations

// This function must takes variables, calculates fuel consumption and returns an object that will be used later
function calcConsumption(startingPoint, endingInput) {
  // create a Route and calculate the distance

  // Remove previous paths

  // const elementToRemove = document.querySelector("path");
  // // Check if the element exists
  // if (elementToRemove) {
  //   // Remove the element from its parent node
  //   elementToRemove.parentNode.removeChild(elementToRemove);
  // }
  oldRoutesInteractiveClass = document.querySelectorAll(".leaflet-interactive");
  oldRoutesInteractiveClass.forEach(function (element) {
    element.parentNode.removeChild(element);
  });

  oldMarkers = document.querySelectorAll(".leaflet-marker-icon");
  oldMarkers.forEach(function (element) {
    element.parentNode.removeChild(element);
  });
  var unnecessaryElements = document.querySelectorAll(
    ".leaflet-routing-container"
  );
  unnecessaryElements.forEach(function (element) {
    element.parentNode.removeChild(element);
  });

  // new points
  let waypoints = [startingPoint, endingInput];

  route = L.Routing.control({
    waypoints: [startingPoint, endingInput],
    show: false,
    createMarker: function (waypointIndex, waypoint, numberOfWaypoints) {
      var markerOptions = {
        draggable: false, // Set to true if you want the markers to be draggable
        icon: L.icon({
          iconUrl: "marker-icon.png", // URL to the marker icon
          iconSize: [30, 30], // Size of the icon
        }),
      };

      // Return the marker with custom options
      return L.marker(waypoint.latLng, markerOptions);
    },
  }).addTo(map);

  var bounds = L.latLngBounds(waypoints);

  map.fitBounds(bounds);

  route.on("routesfound", function (event) {
    const routes = event.routes;

    if (routes.length > 0) {
      const distanceInMeters = routes[0].summary.totalDistance;
      const timeOnRoad = routes[0].summary.totalTime;

      if (carModel.value === "alto") {
        calculateCarFuelConsumption(distanceInMeters, 18, timeOnRoad);
      }
      if (carModel.value === "corolla") {
        calculateCarFuelConsumption(distanceInMeters, 11.3, timeOnRoad);
      }
      if (carModel.value === "mehran") {
        calculateCarFuelConsumption(distanceInMeters, 13, timeOnRoad);
      }
      if (carModel.value === "vitz") {
        calculateCarFuelConsumption(distanceInMeters, 15, timeOnRoad);
      }
    }
  });
}

// using function to calculate the route

calculateButton.addEventListener("click", function () {
  var startLatLng = startingInput.value.split(", ");
  var endLatLng = endingInput.value.split(", ");

  var startlat = parseFloat(startLatLng[0]);
  var startlng = parseFloat(startLatLng[1]);

  var endlat = parseFloat(endLatLng[0]);
  var endlng = parseFloat(endLatLng[1]);

  startingCalPoint = [startlat, startlng];
  endingCalPoint = [endlat, endlng];

  calcConsumption(startingCalPoint, endingCalPoint);
});

function calculateCarFuelConsumption(
  metersDriven,
  fuelConsumptionRate,
  timeOnRoad
) {
  let fuelPricePerLiter = 272.89;
  const kilometersDriven = metersDriven / 1000;
  const litersConsumed = kilometersDriven / fuelConsumptionRate;
  const totalPrice = litersConsumed * fuelPricePerLiter;

  showPopUp();
  updatePopValues(litersConsumed, totalPrice, kilometersDriven, timeOnRoad);
}

// Creating a blank pop-up above map
// Assuming 'mapContainer' is the container element of your Leaflet map
var mapContainer = document.getElementById("map");

// Assuming 'popupDiv' is your popup <div> element
var popupDiv = document.getElementById("popup-div");

// Set the position of the popup relative to the map container
function updatePopupPosition() {
  var mapRect = mapContainer.getBoundingClientRect();
  var mapTop = mapRect.top;
  var mapLeft = mapRect.left;
  var mapWidth = mapRect.width;
  var mapHeight = mapRect.height;
  popupDiv.style.zIndex = 1000;
}

// Call the updatePopupPosition function initially and whenever the map's size changes
updatePopupPosition();

// show pop-up
function showPopUp() {
  popupDiv.classList.remove("top-[-990px]");
  popupDiv.classList.add("top-[150px]");
}

function closePopUp() {
  popupDiv.classList.remove("top-[150px]");
  popupDiv.classList.add("top-[-990px]");
}

// Updating values in Pop-Up
function updatePopValues(
  totalConsumption,
  totalCost,
  totalDistance,
  totalTime
) {
  let consumptionDay = document.querySelector(".popup-consumption-d");
  let consumptionWeek = document.querySelector(".popup-consumption-w");
  let consumptionMonth = document.querySelector(".popup-consumption-m");
  let consumptionYear = document.querySelector(".popup-consumption-y");
  let costDay = document.querySelector(".popup-cost-d");
  let costWeek = document.querySelector(".popup-cost-w");
  let costMonth = document.querySelector(".popup-cost-m");
  let costYear = document.querySelector(".popup-cost-y");
  let distanceDay = document.querySelector(".popup-distance-d");
  let distanceWeek = document.querySelector(".popup-distance-w");
  let distanceMonth = document.querySelector(".popup-distance-m");
  let distanceYear = document.querySelector(".popup-distance-y");
  let timeDay = document.querySelector(".popup-time-d");
  let timeWeek = document.querySelector(".popup-time-w");
  let timeMonth = document.querySelector(".popup-time-m");
  let timeYear = document.querySelector(".popup-time-y");

  let carNamePopUp = document.querySelector(".carModelPopUpName");
  let carPhotoPopUp = document.querySelector(".carPhotoPopUpName");
  let carMileagePopUp = document.querySelector(".carMileagePopUpName");
  let fuelPricePopUp = document.querySelector(".fuelPricePkrPopUpName");
  fuelPricePopUp.textContent = "272.89";

  if (carModel.value === "mehran") {
    carNamePopUp.textContent = "Suzuki Mehran";
    carPhotoPopUp.src = "mehran.jpg";
    carMileagePopUp.textContent = "13";
  }
  if (carModel.value === "vitz") {
    carNamePopUp.textContent = "Toyota Vitz";
    carPhotoPopUp.src = "vitz.jpg";
    carMileagePopUp.textContent = "15";
  }
  if (carModel.value === "corolla") {
    carNamePopUp.textContent = "Toyota Corolla";
    carPhotoPopUp.src = "corolla.jpg";
    carMileagePopUp.textContent = "11.3";
  }
  if (carModel.value === "alto") {
    carNamePopUp.textContent = "Suzuki Alto";
    carPhotoPopUp.src = "alto.png";
    carMileagePopUp.textContent = "18";
  }

  let totalConsumptionPerWeek = totalConsumption * 5;
  let totalConsumptionPerMonth = totalConsumption * 22;
  let totalConsumptionPerYear = totalConsumption * 22 * 12;

  let totalCostPerWeek = totalCost * 5;
  let totalCostPerMonth = totalCost * 22;
  let totalCostPerYear = totalCost * 22 * 12;

  let totalDistancePerWeek = totalDistance * 5;
  let totalDistancePerMonth = totalDistance * 22;
  let totalDistancePerYear = totalDistance * 22 * 12;

  let totalTimePerDay = totalTime / 60;
  let totalTimePerWeek = (totalTime / 60) * 5;
  let totalTimePerMonth = (totalTime / 60) * 22;
  let totalTimePerYear = (totalTime / 60) * 22 * 12;

  updateListContent(
    consumptionDay,
    totalConsumption.toString().substring(0, 5)
  );

  updateListContent(
    consumptionWeek,
    totalConsumptionPerWeek.toString().substring(0, 5)
  );
  updateListContent(
    consumptionMonth,
    totalConsumptionPerMonth.toString().substring(0, 5)
  );
  updateListContent(
    consumptionYear,
    totalConsumptionPerYear.toString().substring(0, 5)
  );
  updateListContent(costDay, totalCost.toString().substring(0, 5));
  updateListContent(costWeek, totalCostPerWeek.toString().substring(0, 5));
  updateListContent(costMonth, totalCostPerMonth.toString().substring(0, 5));
  updateListContent(costYear, totalCostPerYear.toString().substring(0, 5));
  updateListContent(distanceDay, totalDistance.toString().substring(0, 5));
  updateListContent(
    distanceWeek,
    totalDistancePerWeek.toString().substring(0, 5)
  );
  updateListContent(
    distanceMonth,
    totalDistancePerMonth.toString().substring(0, 5)
  );
  updateListContent(
    distanceYear,
    totalDistancePerYear.toString().substring(0, 5)
  );
  updateListContent(timeDay, totalTimePerDay.toString().substring(0, 5));
  updateListContent(timeWeek, totalTimePerWeek.toString().substring(0, 5));
  updateListContent(timeMonth, totalTimePerMonth.toString().substring(0, 5));
  updateListContent(timeYear, totalTimePerYear.toString().substring(0, 5));
}

function updateListContent(elementToUpdate, textContent) {
  elementToUpdate.textContent = textContent;
}

// function downloadTxtFile(
//   carName,
//   carMileage,
//   fuelPricePKR,
//   consumptionDay,
//   consumptionWeek,
//   consumptionMonth,
//   consumptionYear,
//   costDay,
//   costWeek,
//   costMonth,
//   costYear,
//   timeDay,
//   timeWeek,
//   timeMonth,
//   timeYear,
//   distanceDay,
//   distanceWeek,
//   distanceMonth,
//   distanceYear
// ) {
//   // Text content for the file
//   const textContent = `Fuel Consumption Data: \n\n Car Model: ${carName} \n Average Mileage: ${carMileage} \n Fuel Price in Pakistan: ${fuelPricePKR} \n\n Consumption Per Day: ${consumptionDay} \n Consumption Per Day: ${consumptionWeek} \n Consumption Per Week: ${consumptionWeek} \n Consumption Per Month: ${consumptionMonth} \n Consumption Per Year: ${consumptionYear} \n `;

//   // Create a Blob with the text content
//   const blob = new Blob([textContent], { type: "text/plain" });

//   // Create a temporary link element
//   const link = document.createElement("a");
//   link.download = "sample.txt"; // File name
//   link.href = window.URL.createObjectURL(blob);

//   // Trigger the download
//   link.click();

//   // Cleanup
//   window.URL.revokeObjectURL(link.href);
// }
