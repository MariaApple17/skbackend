✏️ Update User

Update user details (excluding password & email by default).

Endpoint

PUT /api/users/:id

Request Body
{
  "fullName": "Updated User Name",
  "roleId": 2,
  "status": "ACTIVE"
}

Success Response (200)
{
    "success": true,
    "data": {
        "id": 1,
        "email": "user@email.com",
        "password": "$2b$10$zmc2H5mIsZUOWD.qSsgtwODav1xlp31LNWBf.zJSODLcdbU00o...",
        "fullName": "Updated User Name",
        "status": "ACTIVE",
        "roleId": 2,
        "createdAt": "2026-01-11T05:52:00.251Z",
        "updatedAt": "2026-01-11T12:13:28.714Z",
        "deletedAt": null
    }
}