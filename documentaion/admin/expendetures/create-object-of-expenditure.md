Create Object Of Expenditure

Create a new object of expenditure.

Endpoint

POST /api/objects-of-expenditure

Request Body
{
  "code": "OOE-001",
  "name": "Office Supplies",
  "description": "Expenses for office materials"
}

Success Response (201)
{
    "success": true,
    "data": {
        "id": 1,
        "code": "OOE-001",
        "name": "Office Supplies",
        "description": "Expenses for office materials",
        "createdAt": "2026-01-11T13:19:22.558Z",
        "updatedAt": "2026-01-11T13:19:22.558Z",
        "deletedAt": null
    }
}

Error Response (400)
{
  "success": false,
  "message": "Object of expenditure code or name already exists"
}