Complete Procurement Request

Complete a purchased procurement request and deduct budget.

Endpoint

PATCH /api/procurement/:id/complete

Success Response (200)
{
  "success": true,
  "message": "Procurement request completed",
  "data": {
    "id": 1,
    "status": "COMPLETED"
  }
}

Error Response (400)
{
  "success": false,
  "message": "Only purchased requests can be completed"
}
