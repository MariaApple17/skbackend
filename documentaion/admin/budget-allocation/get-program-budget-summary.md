Get Program Budget Summary

Retrieve program budgets grouped by classification and object of expenditure.

Endpoint

GET /api/budget-allocations/reports/program-summary

Success Response (200)
{
    "success": true,
    "data": [
        {
            "programId": 2,
            "programCode": "PRG-002",
            "programName": "Scholarship Program",
            "totalAllocated": 0,
            "totalUsed": 0,
            "classifications": []
        },
        {
            "programId": 3,
            "programCode": "PRG-003",
            "programName": "Scholarship Program",
            "totalAllocated": 8000,
            "totalUsed": 0,
            "classifications": [
                {
                    "classificationId": 4,
                    "classificationCode": "P-003",
                    "classificationName": "Personal Services",
                    "totalAllocated": 8000,
                    "totalUsed": 0,
                    "objects": [
                        {
                            "objectId": 1,
                            "objectCode": "OOE-001",
                            "objectName": "Office Supplies",
                            "allocatedAmount": 5000,
                            "usedAmount": 0
                        },
                        {
                            "objectId": 1,
                            "objectCode": "OOE-001",
                            "objectName": "Office Supplies",
                            "allocatedAmount": 3000,
                            "usedAmount": 0
                        }
                    ]
                }
            ]
        }
    ]
}
Error Response (500)
{
  "success": false,
  "message": "Internal server error"
}
