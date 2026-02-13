Delete Budget (Soft Delete)

Soft deletes a budget (sets deletedAt).

Endpoint
DELETE /api/budgets/:id

URL Params
Name	Type	Required
id	number	✅
Success Response (200)
{
    "success": true,
    "message": "Budget deleted successfully"
}

Error Response (400)
{
  "success": false,
  "message": "Unable to delete budget"
}
