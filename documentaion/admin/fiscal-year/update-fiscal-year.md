UPDATE FISCAL YEAR

Method
PUT

Endpoint
/api/fiscal-years/:id

Description
Update fiscal year details.
If isActive = true, all other fiscal years will be deactivated automatically.

Sample Request Body
{
  "isActive": true
}

Sample Success Response (200)
{
  "success": true,
  "data": {
    "id": 2,
    "year": 2027,
    "isActive": true,
    "createdAt": "2026-01-10T08:00:00.000Z",
    "deletedAt": null
  }
}