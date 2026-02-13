Delete Budget Allocation

Soft delete a budget allocation.

Endpoint

DELETE /api/budget-allocations/:id

Success Response (200)
{
    "success": true,
    "message": "Budget allocation deleted successfully"
}

Error Response (404)
{
  "success": false,
  "message": "Budget allocation not found"
}
