Delete Classification (Soft Delete)

Soft delete a budget classification.

Endpoint

DELETE /api/classifications/:id

URL Params
Param	Type	Description
id	number	Classification ID
Success Response (200)
{
  "success": true,
  "message": "Classification deleted"
}

Error Response (400)
{
  "success": false,
  "message": "Classification not found"
}