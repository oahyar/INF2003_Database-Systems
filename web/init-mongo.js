db.createUser({
    user: 'devacc',
    pwd: 'devenv22!',
    roles: [
        {
            role: 'readWrite',
            db: 'TraffiCam',
        },
    ],
});
db.createCollection('camera'); 
