Get Budget Allocation By ID

Retrieve a specific budget allocation.

Endpoint

GET /api/budget-allocations/:id

Success Response (200)
{
    "success": true,
    "data": {
        "id": 1,
        "budgetId": 2,
        "programId": 3,
        "classificationId": 4,
        "objectOfExpenditureId": 1,
        "allocatedAmount": "1000",
        "usedAmount": "0",
        "createdAt": "2026-01-12T01:48:31.319Z",
        "updatedAt": "2026-01-12T01:48:31.319Z",
        "deletedAt": null,
        "budget": {
            "id": 2,
            "fiscalYearId": 1,
            "totalAmount": "5000000",
            "createdAt": "2026-01-12T01:46:48.015Z",
            "updatedAt": "2026-01-12T01:46:48.015Z",
            "deletedAt": null
        },
        "program": {
            "id": 3,
            "code": "PRG-003",
            "name": "Scholarship Program",
            "description": "Student assistance",
            "imageUrl": "/uploads/programs/1768130331636-16481884.png",
            "committeeInCharge": "Education Committee",
            "beneficiaries": "College Students",
            "startDate": "2026-01-31T00:00:00.000Z",
            "endDate": "2026-12-01T00:00:00.000Z",
            "isActive": true,
            "createdAt": "2026-01-11T11:18:51.642Z",
            "updatedAt": "2026-01-11T11:18:51.642Z",
            "deletedAt": null
        },
        "classification": {
            "id": 4,
            "code": "P-003",
            "name": "Personal Services",
            "description": "General operating expenses",
            "createdAt": "2026-01-12T01:48:17.846Z",
            "updatedAt": "2026-01-12T01:48:17.846Z",
            "deletedAt": null
        },
        "object": {
            "id": 1,
            "code": "OOE-001",
            "name": "Office Supplies",
            "description": "Expenses for office materials",
            "createdAt": "2026-01-11T13:19:22.558Z",
            "updatedAt": "2026-01-11T13:19:22.558Z",
            "deletedAt": null
        }
    }
}

Error Response (404)
{
  "success": false,
  "message": "Budget allocation not found"
}
