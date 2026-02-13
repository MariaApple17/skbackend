📄 Get Users (List with Search, Filter, Sort, Pagination)

Retrieve a paginated list of users with search, filtering, and sorting.

Endpoint

GET /api/users

Query Parameters (Optional)
Parameter	Type	Description
search	string	Search by email or full name
status	string	ACTIVE, INACTIVE, SUSPENDED
roleId	number	Filter by role ID
sortBy	string	Column to sort (default: createdAt)
sortOrder	string	asc or desc
page	number	Page number (default: 1)
limit	number	Items per page (default: 10)
Sample Request
GET /api/users?search=admin&status=ACTIVE&page=1&limit=10

Success Response (200)
{
    "success": true,
    "data": [
        {
            "id": 2,
            "email": "user2@email.com",
            "password": "$2b$10$TnpN6Z3XMZzVKty7ehL5su1Boa.dJCP2lSQoVSO0id7mvravUXG8e",
            "fullName": "Sample User",
            "status": "ACTIVE",
            "roleId": 1,
            "createdAt": "2026-01-11T06:02:25.529Z",
            "updatedAt": "2026-01-11T06:02:25.529Z",
            "deletedAt": null,
            "role": {
                "id": 1,
                "name": "Super Admin",
                "description": "Full system access",
                "createdAt": "2026-01-11T04:19:31.515Z",
                "updatedAt": "2026-01-11T04:19:31.515Z",
                "deletedAt": null
            }
        },
        {
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
    ],
    "pagination": {
        "total": 2,
        "page": 1,
        "limit": 10,
        "totalPages": 1
    }
}
