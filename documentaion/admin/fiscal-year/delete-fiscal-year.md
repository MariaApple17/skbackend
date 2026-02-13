DELETE FISCAL YEAR (SOFT DELETE)

Method
DELETE

Endpoint
/api/fiscal-years/:id

Description
Soft delete a fiscal year.
The record is not removed from the database.

Sample Success Response (200)
{
  "success": true,
  "data": {
    "id": 1,
    "year": 2026,
    "isActive": false,
    "createdAt": "2026-01-09T08:00:00.000Z",
    "deletedAt": "2026-01-11T09:10:00.000Z"
  }
}