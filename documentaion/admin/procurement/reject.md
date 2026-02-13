Reject Procurement Request

Reject a submitted procurement request.

Endpoint

PATCH /api/procurement/:id/reject

Request Body
{
  "remarks": "Budget not available"
}

Success Response (200)
{
  "success": true,
  "message": "Procurement request rejected",
  "data": {
    "id": 1,
    "status": "REJECTED"
  }
}

Error Response (400)
{
  "success": false,
  "message": "Only submitted requests can be rejected"
}
