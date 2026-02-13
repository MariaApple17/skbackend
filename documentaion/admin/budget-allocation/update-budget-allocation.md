Update Budget Allocation

Update an existing budget allocation.

Endpoint

PUT /api/budget-allocations/:id

Request Body
{
  "allocatedAmount": 750000.00,
  "usedAmount": 300000.00
}

Success Response (200)
{
    "success": true,
    "message": "Budget allocation updated successfully",
    "data": {
        "id": 1,
        "budgetId": 2,
        "programId": 3,
        "classificationId": 4,
        "objectOfExpenditureId": 1,
        "allocatedAmount": "5000",
        "usedAmount": "0",
        "createdAt": "2026-01-12T01:48:31.319Z",
        "updatedAt": "2026-01-12T01:55:13.335Z",
        "deletedAt": null
    }
}

Error Response (400)
{
  "success": false,
  "message": "Used amount cannot exceed allocated amount"
}
