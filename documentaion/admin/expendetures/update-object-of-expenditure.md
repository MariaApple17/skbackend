Update Object Of Expenditure

Update an existing object of expenditure.

Endpoint

PUT /api/objects-of-expenditure/:id

Request Body
{
  "name": "Office & Stationery Supplies",
  "description": "Updated description"
}

Success Response (200)
{
    "success": true,
    "data": {
        "id": 1,
        "code": "BC-002",
        "name": "Office & Stationery Supplies",
        "description": "Updated description",
        "createdAt": "2026-01-11T12:49:43.179Z",
        "updatedAt": "2026-01-11T13:24:08.132Z",
        "deletedAt": null
    }
}

Error Response (400)
{
  "success": false,
  "message": "Object of expenditure code or name already exists"
}
