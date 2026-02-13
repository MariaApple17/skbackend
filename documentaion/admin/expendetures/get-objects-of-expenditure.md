Get Objects Of Expenditure

Retrieve a list of objects of expenditure with search, sort, and pagination.

Endpoint

GET /api/objects-of-expenditure

Query Parameters
Parameter	Type	Description
q	string	Search by code or name
page	number	Page number (default: 1)
limit	number	Items per page (default: 10)
sortBy	string	Column to sort by
order	string	asc / desc
Sample Request
GET /api/objects-of-expenditure?q=office&page=1&limit=10

Success Response (200)
{
    "success": true,
    "data": [
        {
            "id": 3,
            "code": "OOE-003",
            "name": "Office Suppliess",
            "description": "Expenses for office materials",
            "createdAt": "2026-01-11T13:20:38.667Z",
            "updatedAt": "2026-01-11T13:20:38.667Z",
            "deletedAt": null
        },
        {
            "id": 2,
            "code": "OOE-002",
            "name": "Office Supplie",
            "description": "Expenses for office materials",
            "createdAt": "2026-01-11T13:20:29.573Z",
            "updatedAt": "2026-01-11T13:20:29.573Z",
            "deletedAt": null
        },
        {
            "id": 1,
            "code": "OOE-001",
            "name": "Office Supplies",
            "description": "Expenses for office materials",
            "createdAt": "2026-01-11T13:19:22.558Z",
            "updatedAt": "2026-01-11T13:19:22.558Z",
            "deletedAt": null
        }
    ],
    "pagination": {
        "total": 3,
        "page": 1,
        "limit": 10,
        "totalPages": 1
    }
}