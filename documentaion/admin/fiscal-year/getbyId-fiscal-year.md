GET SINGLE FISCAL YEAR

Method
GET

Endpoint
/api/fiscal-years/:id

Description
Retrieve a single fiscal year by ID.

Sample Success Response (200)
{
  "success": true,
  "data": {
    "id": 1,
    "year": 2026,
    "isActive": true,
    "createdAt": "2026-01-09T08:00:00.000Z",
    "deletedAt": null
  }
}

Sample Error Response (404)
{
  "success": false,
  "message": "Fiscal year not found"
}