let map;

async function initMap() {
    const { Map } = await google.maps.importLibrary('maps');
    const { AdvancedMarkerElement } = await google.maps.importLibrary('marker');
    // Center of SG
    let initialPosition = { lat: 1.3521, lng: 103.8198 };

    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
            (position) => {
                initialPosition = {
                    lat: position.coords.latitude,
                    lng: position.coords.longitude,
                };
                createMap(initialPosition);
            },
            () => {
                // Handle location access denied or error
                handleLocationError(initialPosition); // Pass initialPosition as an argument
            }
        );
    } else {
        // Browser doesn't support Geolocation
        handleLocationError(initialPosition); // Pass initialPosition as an argument
    }

    async function createMap(position) {
        map = new Map(document.getElementById('map'), {
            zoom: 15,
            center: position,
        });

        let cameras = await getCameras();
        let markerIcon;
        cameras.forEach((item) => {
            const position = {
                lat: item.geometry.coordinates[1],
                lng: item.geometry.coordinates[0],
            };
            if (item.properties.Type === 1) {
                markerIcon = RLC;

            } else if (item.properties.Type === 2) {
                markerIcon = FSC;

            } else {
                markerIcon = MSC;
            }

            const marker = new google.maps.Marker({
                position: position,
                map: map,
                title: 'Traffic Cam',
                icon: markerIcon, // Set the icon for the marker based on camera type
            });

        });
    }
    // Type 1
    const RLC = {
        path: google.maps.SymbolPath.CIRCLE,
        fillColor: 'red', // Color of the marker
        fillOpacity: 1, // Opacity (1 is fully opaque)
        scale: 8, // Size of the marker
        strokeWeight: 1, // Border thickness
        strokeColor: 'black', // Border color
    };

    const FSC = {
        path: google.maps.SymbolPath.CIRCLE,
        fillColor: 'blue',
        fillOpacity: 1,
        scale: 8,
        strokeWeight: 1,
        strokeColor: 'black',
    };

    const MSC = {
        path: google.maps.SymbolPath.CIRCLE,
        fillColor: 'green',
        fillOpacity: 1,
        scale: 8,
        strokeWeight: 1,
        strokeColor: 'black',
    };



    function handleLocationError(initialPosition) {
        createMap(initialPosition);
    }
}

async function getCameras() {
    const cameraEndpoint = '/api/camera';
    let res = await fetch(cameraEndpoint);
    let cameras = await res.json();
    return cameras;
}

async function populateTable() {
    let cameras = await getCameras();
    cameras.forEach((data) => {
        const tableBody = document.getElementById('table-body');
        const newRow = document.createElement('tr');

        // Create table cells and populate with data
        const typeCell = document.createElement('td');
        if (data.properties.Type === 1) {
            typeCell.textContent = 'Red Light Camera';
            newRow.appendChild(typeCell);
        } else if (data.properties.Type === 2) {
            typeCell.textContent = 'Fixed Speed Camera';
            newRow.appendChild(typeCell);
        } else {
            typeCell.textContent = 'Mobile Speed Camera';
            newRow.appendChild(typeCell);
        }

        const idCell = document.createElement('td');
        idCell.textContent = data.properties.ID;
        newRow.appendChild(idCell);

        const roadNameCell = document.createElement('td');
        roadNameCell.textContent = data.properties.ROAD_NAME;
        newRow.appendChild(roadNameCell);

        const directionCell = document.createElement('td');
        directionCell.textContent = data.properties.DIRECTION;
        newRow.appendChild(directionCell);

        const descpCell = document.createElement('td');
        descpCell.textContent = data.properties.DESCP;
        newRow.appendChild(descpCell);

        // Append the new row to the table body
        tableBody.appendChild(newRow);
    });
}

populateTable();

initMap();
