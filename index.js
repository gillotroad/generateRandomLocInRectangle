/**
 * @license
 * Copyright 2019 Google LLC. All Rights Reserved.
 * SPDX-License-Identifier: Apache-2.0
 */
/*
Description:
Creates a rectangle on right-click + button-click generates 100 random markers inside rectangle

*/

var tempControlUI;
let map;
var latMarker, lngMarker;


async function initMap() {
    const { Map } = await google.maps.importLibrary("maps");
	const { AdvancedMarkerElement, PinElement } = await google.maps.importLibrary("marker");

    map = new Map(document.getElementById("map"), {
        zoom: 1,
        center: {
            lat: 0,
            lng: 0
        },
        mapId: "f0133ed91e943e1c",
    });

	var rectangle = new google.maps.Rectangle();


    //Create "Show rect bounds" control button at top center of map
    var newPopupControlDiv = document.createElement("div");
    tempControlUI = createControl(newPopupControlDiv, "Gnerates random markers inside rectangle", "Generate", "5px", "25px");
    tempControlUI.addEventListener("click", () => {
        generateRandomLocInRect(rectangle);
    });
    map.controls[google.maps.ControlPosition.TOP_CENTER].push(newPopupControlDiv);


	//On right click, create rectangle at map center
    map.addListener("rightclick", () => {
        // Get the current bounds, which reflect the bounds before the zoom.
        rectangle.setOptions({
            strokeColor: "red",
            strokeOpacity: 0.8,
            strokeWeight: 2,
            fillColor: "red",
            fillOpacity: 0.25,
            map,
            bounds: {
				north: map.getCenter().lat() + 5,
				east: map.getCenter().lng() + 5,
				south: map.getCenter().lat() - 5,
				west: map.getCenter().lng() - 5,
			},
            editable: true,
            draggable: true,
            geodesic: true,
        });
		
    });
}

initMap();


function createControl(controlDiv, desc, content, bSize, fSize) {
    // Set CSS for the control border.
    const controlUI = document.createElement("div");
    controlUI.style.backgroundColor = "#fff";
    controlUI.style.border = bSize + " solid #fff";
    controlUI.style.borderRadius = "3px";
    controlUI.style.boxShadow = "0 2px 6px rgba(0,0,0,.3)";
    controlUI.style.cursor = "pointer";
    controlUI.style.marginBottom = "22px";
    controlUI.style.textAlign = "center";
    controlUI.title = desc;
    controlDiv.appendChild(controlUI);

    // Set CSS for the control interior.
    const controlText = document.createElement("div");
    controlText.style.color = "rgb(25,25,25)";
    controlText.style.fontFamily = "Comic Sans MS,Arial,sans-serif";
    controlText.style.fontSize = fSize;
    controlText.style.lineHeight = "20px";
    controlText.style.paddingLeft = "5px";
    controlText.style.paddingRight = "5px";
    controlText.innerHTML = content;
    controlUI.appendChild(controlText);
    return controlUI;
}

async function generateRandomLocInRect(rect) {
	
	const { Map } = await google.maps.importLibrary("maps");
	const { AdvancedMarkerElement, PinElement } = await google.maps.importLibrary("marker");
	

	
	console.log("Start:");
	
	//Generate 100 random markers inside rectangle
	for (let iCount = 0; iCount < 100; iCount++) {
		latMarker = getRandomLatBetween(rect.bounds.getSouthWest().lat(), rect.bounds.getNorthEast().lat());
		lngMarker = getRandomLngBetween(rect.bounds.getSouthWest().lng(), rect.bounds.getNorthEast().lng());
		
		console.log(iCount + ":");
		console.log(latMarker + ', ' + lngMarker);
		
		const pinRandomMarker = new PinElement({
  			scale: 0.5,
			background: "blue",
			borderColor: "black",
			glyphColor: "black",
  		});
	
		new AdvancedMarkerElement ({
    		map: map,
    		position: { lat: latMarker, lng: lngMarker },
			draggable: false,
			title: "Nr: " + iCount, //latMarker + ',' + lngMarker,
			content: pinRandomMarker.element,
  		});		
	}
}

function getRandomLatBetween(southernLat, northernLat) {
	if (southernLat  > northernLat) {
		console.assert(!(southernLat  > northernLat), "SOUTHERN LAT MUST BE SMALLER THAN NORTHERN LAT!");
		return 0;
	}
	
	var latRange = Math.abs(northernLat - southernLat);
	
	var randomAddend = Math.random() * latRange;
	
	return southernLat + randomAddend;
}

function getRandomLngBetween(westernLng, easternLng) {
	if (easternLng == westernLng) {
		return 0;
	} else if (easternLng < westernLng) { //If easternLng < westernLng, range overlaps 180th meridian
		var lngRange = (180 - westernLng) + Math.abs(easternLng - (-180));
		
		var randomAddend = Math.random() * lngRange;

		//Calculate new (random) longitude depending on whether given (westernLng, easternLng) range overlaps 180th meridian 
		if ((westernLng + randomAddend) == 180) {
			return 180;
		} else if ((westernLng + randomAddend) < 180) {
			return westernLng + randomAddend;
		} else if ((westernLng + randomAddend) > 180) {
			return (-180 + ((westernLng + randomAddend) - 180));
		} else {
			console.log("Invalid calculation in getRandomLngBetween()!");
		}
	} else { //If easternLng > westernLng, range does not overlap 180th meridian
		var lngRange = Math.abs(easternLng - westernLng);
		
		var randomAddend = Math.random() * lngRange;
		
		return westernLng + randomAddend;
	}	
}
