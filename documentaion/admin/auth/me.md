GET CURRENT USER

Method
GET

Endpoint
/api/auth/me

Required Header
Authorization: Bearer <JWT_TOKEN>

Sample Success Response (200)
{
    "success": true,
    "data": {
        "id": 1,
        "email": "user@email.com",
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
        "createdAt": "2026-01-11T05:52:00.251Z"
    }
}