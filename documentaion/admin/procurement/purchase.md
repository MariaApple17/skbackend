Mark Procurement as Purchased

Mark an approved procurement request as purchased.

Endpoint

PATCH /api/procurement/:id/purchase

Success Response (200)
{
  "success": true,
  "message": "Procurement request marked as purchased",
  "data": {
    "id": 1,
    "status": "PURCHASED"
  }
}

Error Response (400)
{
  "success": false,
  "message": "Only approved requests can be marked as purchased"
}
