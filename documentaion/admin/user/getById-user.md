👤 Get User by ID

Retrieve a single user by ID.

Endpoint

GET /api/users/:id

Success Response (200)
{
    "success": true,
    "data": {
        "id": 1,
        "email": "user@email.com",
        "password": "$2b$10$zmc2H5mIsZUOWD.qSsgtwODav1xlp31LNWBf.zJSODLcdbU00o...",
        "fullName": "Sample User",
        "status": "ACTIVE",
        "roleId": 1,
        "createdAt": "2026-01-11T05:52:00.251Z",
        "updatedAt": "2026-01-11T05:52:00.251Z",
        "deletedAt": null,
        "role": {
            "id": 1,
            "name": "Super Admin",
            "description": "Full system access",
            "createdAt": "2026-01-11T04:19:31.515Z",
            "updatedAt": "2026-01-11T04:19:31.515Z",
            "deletedAt": null
        }
    }
}