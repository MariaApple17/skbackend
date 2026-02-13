Get Object Of Expenditure by ID

Retrieve a specific object of expenditure.

Endpoint

GET /api/objects-of-expenditure/:id

Success Response (200)
{
    "success": true,
    "data": {
        "id": 1,
        "code": "BC-002",
        "name": "Administrative Expenses",
        "description": "Office and admin-related expenses",
        "createdAt": "2026-01-11T12:49:43.179Z",
        "updatedAt": "2026-01-11T12:56:34.220Z",
        "deletedAt": null
    }
}

Error Response (404)
{
  "success": false,
  "message": "Object of expenditure not found"
}