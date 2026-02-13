CREATE FISCAL YEAR

Method
POST

Endpoint
/api/fiscal-years

Description
Create a new fiscal year.
Only one fiscal year can be active at a time.
If isActive = true, all other fiscal years will be deactivated automatically.

Sample Request Body
{
  "year": 2026,
  "isActive": true
}

Sample Success Response (201)
{
  "success": true,
  "data": {
    "id": 1,
    "year": 2026,
    "isActive": true,
    "createdAt": "2026-01-11T08:45:21.000Z",
    "deletedAt": null
  }
}

Sample Error Response (400)
{
  "success": false,
  "message": "Fiscal year already exists"
}
