GET ALL FISCAL YEARS

Method
GET

Endpoint
/api/fiscal-years

Description
Retrieve all fiscal years that are not soft-deleted.

Sample Success Response (200)
{
  "success": true,
  "data": [
    {
      "id": 2,
      "year": 2027,
      "isActive": false,
      "createdAt": "2026-01-10T08:00:00.000Z",
      "deletedAt": null
    },
    {
      "id": 1,
      "year": 2026,
      "isActive": true,
      "createdAt": "2026-01-09T08:00:00.000Z",
      "deletedAt": null
    }
  ]
}