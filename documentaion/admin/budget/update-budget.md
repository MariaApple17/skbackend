Update Budget

Update total amount or fiscal year of a budget.

Endpoint
PUT /api/budgets/:id

URL Params
Name	Type	Required
id	number	✅
Request Body
{
  "totalAmount": 7500000.00
}

Success Response (200)
{
    "success": true,
    "message": "Budget updated successfully",
    "data": {
        "id": 1,
        "fiscalYearId": 1,
        "totalAmount": "7500000",
        "createdAt": "2026-01-11T09:54:11.788Z",
        "updatedAt": "2026-01-11T09:58:48.615Z",
        "deletedAt": null
    }
}

Error Response (400)
{
  "success": false,
  "message": "Invalid budget data"
}