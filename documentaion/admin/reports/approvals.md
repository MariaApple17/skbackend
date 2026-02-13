✅ Approval Reports API

Returns a detailed report of approval actions and current request states across the full procurement lifecycle.

Endpoint
GET api/reports/approvals

Description

This endpoint provides an approval and workflow status report, covering procurement requests from creation to completion, including:

Approval decisions

Approver details

Remarks

Current procurement lifecycle status

Used for audit trails, compliance checks, and management reporting.

Request
Method
GET

Headers
Content-Type: application/json
Authorization: Bearer <access_token>

Query Parameters (Optional)
Name	Type	Description
status	string	Filter by workflow status
approverId	number	Filter by approver
requestId	number	Filter by procurement request
allocationId	number	Filter by budget allocation
dateFrom	date	Filter from date
dateTo	date	Filter until date
✔️ Valid Status Values

The system follows this procurement workflow lifecycle:

Status	Description
DRAFT	Request created but not yet submitted
SUBMITTED	Request submitted for approval
APPROVED	Request approved
REJECTED	Request rejected
PURCHASED	Items purchased
COMPLETED	Procurement fully completed
Sample Request
GET {{base_url}}/reports/approvals?status=APPROVED
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
            "requestId": 4,
            "approverId": 1,
            "status": "REJECTED",
            "remarks": "555",
            "createdAt": "2026-01-25T02:34:41.524Z",
            "deletedAt": null,
            "approver": {
                "id": 1,
                "email": "admin@system.local",
                "password": "$2b$10$na1r1c.mM9sXMIR8LPERku0d.ri5FuhOkhNSvp0pZlSMf3IDG.ucC",
                "fullName": "System Super Admin",
                "status": "ACTIVE",
                "roleId": 1,
                "createdAt": "2026-01-25T02:02:11.851Z",
                "updatedAt": "2026-01-25T02:02:11.851Z",
                "deletedAt": null
            },
            "request": {
                "id": 4,
                "title": "4555",
                "description": "55",
                "amount": "2550",
                "status": "REJECTED",
                "allocationId": 1,
                "vendorId": null,
                "createdById": 1,
                "createdAt": "2026-01-25T02:34:32.329Z",
                "updatedAt": "2026-01-25T02:34:41.527Z",
                "deletedAt": null
            }
        },
        {
            "id": 2,
            "requestId": 3,
            "approverId": 1,
            "status": "APPROVED",
            "remarks": null,
            "createdAt": "2026-01-25T02:34:43.934Z",
            "deletedAt": null,
            "approver": {
                "id": 1,
                "email": "admin@system.local",
                "password": "$2b$10$na1r1c.mM9sXMIR8LPERku0d.ri5FuhOkhNSvp0pZlSMf3IDG.ucC",
                "fullName": "System Super Admin",
                "status": "ACTIVE",
                "roleId": 1,
                "createdAt": "2026-01-25T02:02:11.851Z",
                "updatedAt": "2026-01-25T02:02:11.851Z",
                "deletedAt": null
            },
            "request": {
                "id": 3,
                "title": "4444",
                "description": "44",
                "amount": "616",
                "status": "PURCHASED",
                "allocationId": 1,
                "vendorId": null,
                "createdById": 1,
                "createdAt": "2026-01-25T02:34:21.058Z",
                "updatedAt": "2026-01-25T02:35:08.585Z",
                "deletedAt": null
            }
        },
        {
            "id": 3,
            "requestId": 1,
            "approverId": 1,
            "status": "APPROVED",
            "remarks": null,
            "createdAt": "2026-01-25T02:35:06.229Z",
            "deletedAt": null,
            "approver": {
                "id": 1,
                "email": "admin@system.local",
                "password": "$2b$10$na1r1c.mM9sXMIR8LPERku0d.ri5FuhOkhNSvp0pZlSMf3IDG.ucC",
                "fullName": "System Super Admin",
                "status": "ACTIVE",
                "roleId": 1,
                "createdAt": "2026-01-25T02:02:11.851Z",
                "updatedAt": "2026-01-25T02:02:11.851Z",
                "deletedAt": null
            },
            "request": {
                "id": 1,
                "title": "222",
                "description": "22",
                "amount": "440",
                "status": "APPROVED",
                "allocationId": 1,
                "vendorId": null,
                "createdById": 1,
                "createdAt": "2026-01-25T02:33:48.629Z",
                "updatedAt": "2026-01-25T02:35:06.230Z",
                "deletedAt": null
            }
        },
        {
            "id": 4,
            "requestId": 5,
            "approverId": 1,
            "status": "APPROVED",
            "remarks": null,
            "createdAt": "2026-01-25T02:35:24.709Z",
            "deletedAt": null,
            "approver": {
                "id": 1,
                "email": "admin@system.local",
                "password": "$2b$10$na1r1c.mM9sXMIR8LPERku0d.ri5FuhOkhNSvp0pZlSMf3IDG.ucC",
                "fullName": "System Super Admin",
                "status": "ACTIVE",
                "roleId": 1,
                "createdAt": "2026-01-25T02:02:11.851Z",
                "updatedAt": "2026-01-25T02:02:11.851Z",
                "deletedAt": null
            },
            "request": {
                "id": 5,
                "title": "666",
                "description": "666",
                "amount": "960",
                "status": "COMPLETED",
                "allocationId": 1,
                "vendorId": null,
                "createdById": 1,
                "createdAt": "2026-01-25T02:34:58.731Z",
                "updatedAt": "2026-01-25T02:35:54.687Z",
                "deletedAt": null
            }
        },
        {
            "id": 5,
            "requestId": 2,
            "approverId": 1,
            "status": "APPROVED",
            "remarks": null,
            "createdAt": "2026-01-25T02:37:05.948Z",
            "deletedAt": null,
            "approver": {
                "id": 1,
                "email": "admin@system.local",
                "password": "$2b$10$na1r1c.mM9sXMIR8LPERku0d.ri5FuhOkhNSvp0pZlSMf3IDG.ucC",
                "fullName": "System Super Admin",
                "status": "ACTIVE",
                "roleId": 1,
                "createdAt": "2026-01-25T02:02:11.851Z",
                "updatedAt": "2026-01-25T02:02:11.851Z",
                "deletedAt": null
            },
            "request": {
                "id": 2,
                "title": "333",
                "description": "33",
                "amount": "30",
                "status": "APPROVED",
                "allocationId": 1,
                "vendorId": null,
                "createdById": 1,
                "createdAt": "2026-01-25T02:34:10.355Z",
                "updatedAt": "2026-01-25T02:37:05.950Z",
                "deletedAt": null
            }
        }
    ]
}