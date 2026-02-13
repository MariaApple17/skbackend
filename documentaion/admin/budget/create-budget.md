Create Total Budget

Create a new total budget for a fiscal year.

Endpoint
POST /api/budgets

Request Body
{
  "fiscalYearId": 1,
  "totalAmount": 5000000.00
}

Success Response (201)
{
    "success": true,
    "message": "Total budget created successfully",
    "data": {
        "id": 1,
        "fiscalYearId": 1,
        "totalAmount": "5000000",
        "createdAt": "2026-01-11T09:54:11.788Z",
        "updatedAt": "2026-01-11T09:54:11.788Z",
        "deletedAt": null
    }
}

Error Response (400)
{
  "success": false,
  "message": "Budget for this fiscal year already exists"
}
