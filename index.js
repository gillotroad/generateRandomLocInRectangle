/**
 * @license
 * Copyright 2019 Google LLC. All Rights Reserved.
 * SPDX-License-Identifier: Apache-2.0
 */
// This example creates a rectangle based on the viewport
// on any 'zoom-changed' event.

var tempControlUI;


async function initMap() {
    const { Map } = await google.maps.importLibrary("maps");

    const map = new google.maps.Map(document.getElementById("map"), {
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
    tempControlUI = createControl(newPopupControlDiv, "Shows rectangle bounds", "Show rect bounds", "5px", "25px");
    tempControlUI.addEventListener("click", () => {
        showRectBounds(rectangle);
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

async function showRectBounds(rect) {
    const { Map } = await google.maps.importLibrary("maps");
	
	//Open popup window
    let boundsWin = window.open("about:blank", "Rectangle bounds", "width=400, height=400, left=300, top=200 , menubar=no, toolbar=no, location=no, status=no, resizable=no, scrollbars=no");
	
	//Write rectangle bounds info topopup window
    boundsWin.document.write(
        '<div id=boundsWin><b style="color: blue">Rectangle bounds:</b><br><br>North: ' 
		+ rect.bounds.getNorthEast().lat() 
		+ '<br>East: ' + rect.bounds.getNorthEast().lng() 
		+ '<br>South: ' + rect.bounds.getSouthWest().lat() 
		+ '<br>West: ' + rect.bounds.getSouthWest().lng() 
		+ '</div>'
    );
	

}
