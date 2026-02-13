Approve Procurement Request

Approve a submitted procurement request.

Endpoint

PATCH /api/procurement/:id/approve

Request Body
{
  "remarks": "Approved for purchase"
}

Success Response (200)
{
  "success": true,
  "message": "Procurement request approved",
  "data": {
    "id": 1,
    "status": "APPROVED"
  }
}

Error Response (400)
{
  "success": false,
  "message": "Insufficient budget allocation"
}
