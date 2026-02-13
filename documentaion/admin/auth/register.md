REGISTER USER

Method
POST

Endpoint
/api/auth/register

Sample Request Body
{
"email": "user@email.com",
"password": "password123",
"fullName": "Sample User",
"roleId": 2
}

Sample Success Response (201)
{
    "success": true,
    "message": "User registered successfully",
    "data": {
        "id": 2,
        "email": "user2@email.com",
        "fullName": "Sample User",
        "status": "ACTIVE",
        "role": {
            "id": 1,
            "name": "Super Admin",
            "permissions": [
                "DASHBOARD_VIEW",
                "PROCUREMENT_CREATE",
                "PROCUREMENT_UPDATE",
                "PROCUREMENT_APPROVE",
                "PROCUREMENT_SOFTDELETE",
                "REPORT_VIEW",
                "DATA_SETUP_CREATE",
                "DATA_SETUP_UPDATE",
                "DATA_SETUP_SOFTDELETE",
                "ROLE_CREATE",
                "ROLE_UPDATE",
                "ROLE_SOFTDELETE",
                "ROLE_ASSIGN_PERMISSION",
                "USER_CREATE",
                "USER_UPDATE",
                "USER_SOFTDELETE",
                "USER_ASSIGN_ROLE",
                "SYSTEM_SETTINGS_MANAGE"
            ]
        },
        "createdAt": "2026-01-11T06:02:25.529Z"
    }
}