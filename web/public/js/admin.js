async function getCameras() {
    const cameraEndpoint = '/api/camera';
    let res = await fetch(cameraEndpoint);
    let cameras = await res.json();
    return cameras;
}

async function populateCameraTable() {
    const cameras = await getCameras(); // Fetch camera data

    const tableBody = document.querySelector('table tbody');

    // Clear existing table rows
    tableBody.innerHTML = '';

    // Loop through the camera data and create table rows for each camera
    cameras.forEach((camera) => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${camera.properties.Type}</td>
            <td>${camera.properties.ID}</td>
            <td>${camera.properties.ROAD_NAME}</td>
            <td>${camera.geometry.coordinates[1]}</td>
            <td>${camera.geometry.coordinates[0]}</td>
            <td>${camera.properties.DESCP}</td>
            <td><button type="button" class="btn btn-success btn-sm">Update Details</button></td>
            <td><button type="button" class="btn btn-danger btn-sm">Delete</button></td>
        `;
        tableBody.appendChild(row);
    });
}

async function populateUserTable() {
    try {
        const response = await fetch('/api/user/all');
        const userData = await response.json();
        console.log(userData);
        const userTableBody = document.querySelector('#userTable tbody');

        userTableBody.innerHTML = '';

        userData.forEach((user) => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${user.userID}</td>
                <td>${user.firstName}</td>
                <td>${user.lastName}</td>
                <td>${user.username}</td>
                <td>${user.userRole === 1 ? 'User' : 'Admin'}</td>
                <td><button type="submit" class="btn btn-success btn-sm" onclick="upgradeUser(${
                    user.userID
                })" ${user.userRole === 2 ? 'disabled' : ''}>Make Admin</button></td>
                <td><button type="button" class="btn btn-danger btn-sm" onclick="deleteUser(${
                    user.userID
                })">Delete User</button></td>
            `;
            userTableBody.appendChild(row);
        });
    } catch (error) {
        console.error('Error fetching user data:', error);
    }
}

async function upgradeUser(userID) {
    try {
        const response = await fetch('/api/user/update', {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ userID: userID, userRole: 2 }), // Send the userID in the request body
        });
        if (response.ok) {
            const upgradeButton = document.querySelector(
                `#upgradeButton_${userID}`
            );
            if (upgradeButton) {
                upgradeButton.disabled = true;
                upgradeButton.classList.add('disabled');
            }
        }
    } catch (error) {
        console.error('Error making user admin:', error);
    }
}

async function deleteUser(userId) {
    try {
        const response = await fetch('/api/user/delete', {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ userID: userId }), // Send the userID in the request body
        });

        if (response.ok) {
            // User deletion was successful
            const rowToRemove = document.querySelector(
                `#userTable tbody tr[data-userid="${userId}"]`
            );
            if (rowToRemove) {
                rowToRemove.remove(); // Remove the corresponding row from the table
            }
        } else {
            // Handle errors if the deletion was not successful
            console.error('Error deleting user:', response.statusText);
        }
    } catch (error) {
        console.error('Error deleting user:', error);
    }
}

window.onload = function () {
    populateCameraTable();
    populateUserTable();
};
