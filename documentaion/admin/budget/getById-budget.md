Get Budget by ID

Retrieve a single budget including its allocations.

Endpoint
GET /api/budgets/:id

URL Params
Name	Type	Required
id	number	✅
Success Response (200)
{
    "success": true,
    "data": {
        "id": 1,
        "fiscalYearId": 1,
        "totalAmount": "5000000",
        "createdAt": "2026-01-11T09:54:11.788Z",
        "updatedAt": "2026-01-11T09:54:11.788Z",
        "deletedAt": null,
        "fiscalYear": {
            "id": 1,
            "year": 2027,
            "isActive": false,
            "createdAt": "2026-01-11T09:28:44.821Z",
            "deletedAt": "2026-01-11T09:31:10.911Z"
        },
        "allocations": []
    }
}

Error Response (404)
{
  "success": false,
  "message": "Budget not found"
}