Delete Object Of Expenditure

Soft delete an object of expenditure.

Endpoint

DELETE /api/objects-of-expenditure/:id

Success Response (200)
{
  "success": true,
  "message": "Object of expenditure deleted"
}

Error Response (400)
{
  "success": false,
  "message": "Failed to delete object of expenditure"
}