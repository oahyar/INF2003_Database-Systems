async function loginUser() {
    const username = document.getElementById('login-email').value;
    const password = document.getElementById('login-password').value;

    const loginEndpoint = '/api/user/login';

    const requestBody = {
        username: username, 
        password: password,
    };

    let res = await fetch(loginEndpoint, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestBody),
    });
    if (res.ok) {
        document.location.href = '/';
    }
}

async function registerUser() {
    const username = document.getElementById('signup-email').value;
    const password = document.getElementById('signup-password').value;
    const firstName = document.getElementById('signup-firstName').value;
    const lastName = document.getElementById('signup-lastName').value;


    const registrationEndpoint = '/api/user/register'; 
    
    const requestBody = {
        username: username, 
        password: password,
        firstName: firstName,
        lastName: lastName
    };

    let res = await fetch(registrationEndpoint, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestBody),
    });
    if (res.ok) {
        document.location.href = '/';
    } else {
        alert(res.err);
    }
}
