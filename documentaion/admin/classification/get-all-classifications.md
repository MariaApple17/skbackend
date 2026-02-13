Get All Classifications

Retrieve all active budget classifications with their budget limits.

Endpoint

GET /api/classifications

Success Response (200)
{
    "success": true,
    "data": [
        {
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
        },
        {
            "id": 4,
            "code": "P-003",
            "name": "Personal Services",
            "description": "General operating expenses",
            "createdAt": "2026-01-12T01:48:17.846Z",
            "updatedAt": "2026-01-12T01:48:17.846Z",
            "deletedAt": null,
            "budgetLimits": []
        }
    ]
}