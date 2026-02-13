Delete Procurement Request

Soft delete a draft procurement request.

Endpoint

DELETE /api/procurement/:id

Success Response (200)
{
  "success": true,
  "message": "Procurement request deleted successfully"
}

Error Response (400)
{
  "success": false,
  "message": "Only draft requests can be deleted"
}
