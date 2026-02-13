Create Budget Allocation

Create a new budget allocation.

Endpoint

POST /api/budget-allocations

Request Body
{
  "budgetId": 1,
  "programId": 2,
  "classificationId": 3,
  "objectOfExpenditureId": 4,
  "allocatedAmount": 500000.00
}

Success Response (201)
{
    "success": true,
    "message": "Budget allocation created successfully",
    "data": {
        "id": 3,
        "budgetId": 2,
        "programId": 3,
        "classificationId": 4,
        "objectOfExpenditureId": 1,
        "allocatedAmount": "5000",
        "usedAmount": "0",
        "createdAt": "2026-01-12T01:48:47.427Z",
        "updatedAt": "2026-01-12T01:48:47.427Z",
        "deletedAt": null
    }
}

Error Response (400)
{
  "success": false,
  "message": "Missing required fields"
}
