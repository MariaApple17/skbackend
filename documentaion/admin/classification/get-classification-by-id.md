Get Classification by ID

Retrieve a specific budget classification using its ID, including its budget limits.

Endpoint

GET /api/classifications/:id

URL Params
Param   Type    Description
id      number  Classification ID

Success Response (200)
{
    "success": true,
    "data": {
        "id": 5,
        "code": "BC-001",
        "name": "General Services",
        "description": "General operating expenses",
        "createdAt": "2026-01-12T02:28:03.130Z",
        "updatedAt": "2026-01-12T02:28:03.130Z",
        "deletedAt": null,
        "budgetLimits": [
            {
                "id": 1,
                "budgetId": 2,
                "classificationId": 5,
                "limitAmount": "300000",
                "createdAt": "2026-01-12T02:28:03.134Z",
                "updatedAt": "2026-01-12T02:28:03.134Z",
                "budget": {
                    "id": 2,
                    "totalAmount": "5000000"
                }
            }
        ]
    }
}
Error Response (404)
{
  "success": false,
  "message": "Classification not found"
}
