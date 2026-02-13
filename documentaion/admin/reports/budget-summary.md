📊 Budget Summary Report API

Returns a consolidated summary of budget allocations and usage, grouped by Program, Classification, Object of Expenditure, and Fiscal Year.

Endpoint
GET api/reports/budget-summary

Description

This endpoint provides a budget utilization overview, including:

Allocated vs used amounts

Linked program details

Classification and object of expenditure metadata

Budget and fiscal year information

Used mainly for reports, dashboards, and analytics.

Request
Method
GET

Headers
Content-Type: application/json
Authorization: Bearer <access_token>

Query Parameters (Optional)
Name	Type	Description
fiscalYearId	number	Filter by fiscal year
programId	number	Filter by program
classificationId	number	Filter by classification
objectOfExpenditureId	number	Filter by object of expenditure
Sample Request
GET {{base_url}}/reports/budget-summary
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6...

Success Response
HTTP Status
200 OK

Response Body
{
    "success": true,
    "data": [
        {
            "id": 1,
            "budgetId": 1,
            "programId": 1,
            "classificationId": 1,
            "objectOfExpenditureId": 1,
            "allocatedAmount": "22222",
            "usedAmount": "960",
            "createdAt": "2026-01-25T02:33:17.558Z",
            "updatedAt": "2026-01-25T02:35:54.684Z",
            "deletedAt": null,
            "program": {
                "id": 1,
                "code": "2222",
                "name": "222",
                "description": "2222",
                "imageUrl": "/uploads/programs/1769308379004-789972871.webp",
                "committeeInCharge": "22",
                "beneficiaries": "222",
                "startDate": "2026-01-25T00:00:00.000Z",
                "endDate": "2026-01-25T00:00:00.000Z",
                "isActive": true,
                "createdAt": "2026-01-25T02:32:59.015Z",
                "updatedAt": "2026-01-25T02:32:59.015Z",
                "deletedAt": null
            },
            "classification": {
                "id": 1,
                "code": "1111",
                "name": "111",
                "description": "111",
                "createdAt": "2026-01-25T02:32:24.133Z",
                "updatedAt": "2026-01-25T02:32:24.133Z",
                "deletedAt": null
            },
            "object": {
                "id": 1,
                "code": "111",
                "name": "11",
                "description": "11",
                "createdAt": "2026-01-25T02:32:31.832Z",
                "updatedAt": "2026-01-25T02:32:31.832Z",
                "deletedAt": null
            },
            "budget": {
                "id": 1,
                "fiscalYearId": 1,
                "totalAmount": "1000000000",
                "createdAt": "2026-01-25T02:02:11.864Z",
                "updatedAt": "2026-01-25T02:02:11.864Z",
                "deletedAt": null,
                "fiscalYear": {
                    "id": 1,
                    "year": 2025,
                    "isActive": true,
                    "createdAt": "2026-01-25T02:02:11.860Z",
                    "deletedAt": null
                }
            }
        }
    ]
}