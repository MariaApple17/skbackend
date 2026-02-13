📄 List Procurement Requests

Retrieve procurement requests with search, status filtering, and pagination.

🔗 Endpoint
GET /api/procurement

🔍 Query Parameters
Parameter	Type	Description
q	string	Search by request title (optional)
status	string	Filter by request status (optional)
page	number	Page number (default: 1)
limit	number	Items per page (default: 10)
✅ Valid status values
DRAFT
SUBMITTED
APPROVED
REJECTED
PURCHASED
COMPLETED

📌 Example Requests
GET /api/procurement

GET /api/procurement?status=DRAFT

GET /api/procurement?q=office&page=1&limit=10

GET /api/procurement?status=APPROVED&page=2

✅ Success Response (200)
{
    "success": true,
    "data": [
        {
            "id": 4,
            "title": "ff",
            "description": "fdsasd",
            "amount": "1950",
            "status": "PURCHASED",
            "allocationId": 1,
            "vendorId": null,
            "createdById": 2,
            "createdAt": "2026-01-16T05:20:21.311Z",
            "updatedAt": "2026-01-16T05:21:18.182Z",
            "deletedAt": null,
            "items": [
                {
                    "id": 4,
                    "requestId": 4,
                    "name": "ddasd",
                    "description": null,
                    "quantity": 11,
                    "unitCost": "120",
                    "totalPrice": "1320",
                    "createdAt": "2026-01-16T05:20:21.311Z",
                    "deletedAt": null
                },
                {
                    "id": 5,
                    "requestId": 4,
                    "name": "ddsf",
                    "description": null,
                    "quantity": 21,
                    "unitCost": "30",
                    "totalPrice": "630",
                    "createdAt": "2026-01-16T05:20:21.311Z",
                    "deletedAt": null
                }
            ],
            "proofs": [
                {
                    "id": 1,
                    "requestId": 4,
                    "type": "OR",
                    "fileUrl": "/uploads/procurement/e7974290-d000-4ed1-bf9a-f4c99c55c820.jpg",
                    "description": null,
                    "uploadedById": 2,
                    "createdAt": "2026-01-16T05:43:20.046Z",
                    "deletedAt": null
                }
            ],
            "vendor": null,
            "allocation": {
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
            },
            "createdBy": {
                "id": 2,
                "email": "user2@email.com",
                "password": "$2b$10$TnpN6Z3XMZzVKty7ehL5su1Boa.dJCP2lSQoVSO0id7mvravUXG8e",
                "fullName": "Sample Users",
                "status": "ACTIVE",
                "roleId": 1,
                "createdAt": "2026-01-11T06:02:25.529Z",
                "updatedAt": "2026-01-12T04:01:22.201Z",
                "deletedAt": null
            },
            "approvals": [
                {
                    "id": 3,
                    "status": "APPROVED",
                    "remarks": "ok",
                    "approverId": 2,
                    "createdAt": "2026-01-16T05:21:05.311Z"
                }
            ],
            "latestRemark": "ok",
            "latestDecision": "APPROVED"
        },
        {
            "id": 3,
            "title": "sss",
            "description": "ss",
            "amount": "1068",
            "status": "REJECTED",
            "allocationId": 4,
            "vendorId": null,
            "createdById": 6,
            "createdAt": "2026-01-16T03:09:58.536Z",
            "updatedAt": "2026-01-16T05:05:24.843Z",
            "deletedAt": null,
            "items": [
                {
                    "id": 2,
                    "requestId": 3,
                    "name": "sss",
                    "description": null,
                    "quantity": 5,
                    "unitCost": "120",
                    "totalPrice": "600",
                    "createdAt": "2026-01-16T03:09:58.536Z",
                    "deletedAt": null
                },
                {
                    "id": 3,
                    "requestId": 3,
                    "name": "eee",
                    "description": null,
                    "quantity": 3,
                    "unitCost": "156",
                    "totalPrice": "468",
                    "createdAt": "2026-01-16T03:09:58.536Z",
                    "deletedAt": null
                }
            ],
            "proofs": [],
            "vendor": null,
            "allocation": {
                "id": 4,
                "budgetId": 4,
                "programId": 3,
                "classificationId": 7,
                "objectOfExpenditureId": 3,
                "allocatedAmount": "5000",
                "usedAmount": "0",
                "createdAt": "2026-01-15T09:15:30.131Z",
                "updatedAt": "2026-01-15T09:15:30.131Z",
                "deletedAt": null
            },
            "createdBy": {
                "id": 6,
                "email": "admin@system.local",
                "password": "$2b$10$Y/PecVc/GzYHor58umQVu.QUrSb/67.EpsNQ/WxawqgdKnzjY/XK6",
                "fullName": "System Super Admin",
                "status": "ACTIVE",
                "roleId": 7,
                "createdAt": "2026-01-15T01:38:09.830Z",
                "updatedAt": "2026-01-15T01:38:09.830Z",
                "deletedAt": null
            },
            "approvals": [
                {
                    "id": 1,
                    "status": "REJECTED",
                    "remarks": "Approved for purchase",
                    "approverId": 2,
                    "createdAt": "2026-01-16T05:05:24.835Z"
                }
            ],
            "latestRemark": "Approved for purchase",
            "latestDecision": "REJECTED"
        },
        {
            "id": 2,
            "title": "Updated Office Supplies",
            "description": "Updated procurement description",
            "amount": "26000",
            "status": "REJECTED",
            "allocationId": 3,
            "vendorId": null,
            "createdById": 2,
            "createdAt": "2026-01-16T03:03:22.335Z",
            "updatedAt": "2026-01-16T05:05:55.027Z",
            "deletedAt": null,
            "items": [
                {
                    "id": 1,
                    "requestId": 2,
                    "name": "Bond Paper",
                    "description": null,
                    "quantity": 10,
                    "unitCost": "250",
                    "totalPrice": "2500",
                    "createdAt": "2026-01-16T03:03:22.335Z",
                    "deletedAt": null
                }
            ],
            "proofs": [],
            "vendor": null,
            "allocation": {
                "id": 3,
                "budgetId": 2,
                "programId": 3,
                "classificationId": 4,
                "objectOfExpenditureId": 1,
                "allocatedAmount": "5000",
                "usedAmount": "0",
                "createdAt": "2026-01-12T01:48:47.427Z",
                "updatedAt": "2026-01-12T01:55:57.877Z",
                "deletedAt": "2026-01-12T01:55:57.874Z"
            },
            "createdBy": {
                "id": 2,
                "email": "user2@email.com",
                "password": "$2b$10$TnpN6Z3XMZzVKty7ehL5su1Boa.dJCP2lSQoVSO0id7mvravUXG8e",
                "fullName": "Sample Users",
                "status": "ACTIVE",
                "roleId": 1,
                "createdAt": "2026-01-11T06:02:25.529Z",
                "updatedAt": "2026-01-12T04:01:22.201Z",
                "deletedAt": null
            },
            "approvals": [
                {
                    "id": 2,
                    "status": "REJECTED",
                    "remarks": "Approved for purchase",
                    "approverId": 2,
                    "createdAt": "2026-01-16T05:05:55.024Z"
                }
            ],
            "latestRemark": "Approved for purchase",
            "latestDecision": "REJECTED"
        }
    ],
    "pagination": {
        "page": 1,
        "limit": 10,
        "total": 3,
        "totalPages": 1
    }
}

❌ Error Response
Invalid query / validation error (400)
{
  "success": false,
  "message": "Invalid request status"
}

Server error (500)
{
  "success": false,
  "message": "Internal server error"
}

🧠 Notes (Important)

Soft-deleted requests (deletedAt != null) are never returned

Only DRAFT requests can be:

updated

deleted

submitted

Pagination is always included

Search applies to title only

Status filtering matches exact workflow logic