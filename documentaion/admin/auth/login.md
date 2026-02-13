LOGIN USER

Method
POST

Endpoint
/api/auth/login

Sample Request Body
{
"email": "user@email.com
",
"password": "password123"
}

Sample Success Response (200)
{
    "success": true,
    "message": "Login successful",
    "data": {
        "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjEsImVtYWlsIjoiYWRtaW5Ac3lzdGVtLmxvY2FsIiwiaWF0IjoxNzY4NTUzMDA2LCJleHAiOjE3Njg2Mzk0MDZ9.3HBNzYDYwyBH9sh6tz8CX4u4QjGzNk5qggOENnwTqII",
        "user": {
            "id": 1,
            "email": "admin@system.local",
            "fullName": "System Super Admin",
            "status": "ACTIVE",
            "role": {
                "id": 1,
                "name": "SUPER_ADMIN",
                "permissions": [
                    "DASHBOARD_VIEW",
                    "BUDGET_ALLOCATION_VIEW",
                    "BUDGET_TOTAL_VIEW",
                    "PROCUREMENT_REQUEST_VIEW",
                    "PROCUREMENT_MANAGE_VIEW",
                    "FISCAL_YEAR_VIEW",
                    "CLASSIFICATION_VIEW",
                    "OBJECT_EXPENDITURES_VIEW",
                    "PROGRAMS_VIEW",
                    "USERS_VIEW",
                    "ROLES_VIEW"
                ]
            }
        }
    }
}