Submit Procurement Request

Submit a draft procurement request for approval.

Endpoint

PATCH /api/procurement/:id/submit

Success Response (200)
{
  "success": true,
  "message": "Procurement request submitted",
  "data": {
    "id": 1,
    "status": "SUBMITTED"
  }
}

Error Response (400)
{
  "success": false,
  "message": "Only draft requests can be submitted"
}
