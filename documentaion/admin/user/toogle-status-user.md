🔁 Toggle User Status

Toggle user status between ACTIVE ↔ INACTIVE
(SUSPENDED → ACTIVE by default rule)

Endpoint

PATCH /api/users/:id/toggle-status

Success Response (200)
{
    "success": true,
    "message": "User status updated successfully",
    "data": {
        "id": 1,
        "email": "user@email.com",
        "password": "$2b$10$zmc2H5mIsZUOWD.qSsgtwODav1xlp31LNWBf.zJSODLcdbU00o...",
        "fullName": "Updated User Name",
        "status": "INACTIVE",
        "roleId": 2,
        "createdAt": "2026-01-11T05:52:00.251Z",
        "updatedAt": "2026-01-11T12:14:30.127Z",
        "deletedAt": null
    }
}