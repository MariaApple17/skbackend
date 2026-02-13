🧾 Procurement Reports API

Returns a detailed list of procurement requests, including items, status, creator, and linked budget allocation details.

Endpoint
GET api/reports/procurements

Description

This endpoint provides a procurement activity report, showing:

Procurement request details

Line items and computed totals

Approval / lifecycle status

Creator (user) information

Linked budget allocation, program, and classification

Used for procurement monitoring, audits, and reporting dashboards.

Request
Method
GET

Headers
Content-Type: application/json
Authorization: Bearer <access_token>

Query Parameters (Optional)
Name	Type	Description
status	string	Filter by procurement status (DRAFT, APPROVED, PURCHASED, COMPLETED, REJECTED)
allocationId	number	Filter by budget allocation
programId	number	Filter by program
classificationId	number	Filter by classification
createdById	number	Filter by creator
dateFrom	date	Filter start date
dateTo	date	Filter end date
Sample Request
GET {{base_url}}/reports/procurements?status=APPROVED
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6...

Success Response
HTTP Status
200 OK

Response Body
{
    "success": true,
    "data": [
        {
            "id": 6,
            "title": "88",
            "description": "8",
            "amount": "144",
            "status": "DRAFT",
            "allocationId": 1,
            "vendorId": null,
            "createdById": 1,
            "createdAt": "2026-01-25T02:35:19.690Z",
            "updatedAt": "2026-01-25T02:35:19.690Z",
            "deletedAt": null,
            "vendor": null,
            "items": [
                {
                    "id": 7,
                    "requestId": 6,
                    "name": "8",
                    "description": null,
                    "quantity": 18,
                    "unitCost": "8",
                    "totalPrice": "144",
                    "createdAt": "2026-01-25T02:35:19.690Z",
                    "deletedAt": null
                }
            ],
            "createdBy": {
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
            "allocation": {
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
                }
            }
        },
        {
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
            "deletedAt": null,
            "vendor": null,
            "items": [
                {
                    "id": 6,
                    "requestId": 5,
                    "name": "66",
                    "description": null,
                    "quantity": 16,
                    "unitCost": "60",
                    "totalPrice": "960",
                    "createdAt": "2026-01-25T02:34:58.731Z",
                    "deletedAt": null
                }
            ],
            "createdBy": {
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
            "allocation": {
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
                }
            }
        },
        {
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
            "deletedAt": null,
            "vendor": null,
            "items": [
                {
                    "id": 5,
                    "requestId": 4,
                    "name": "555",
                    "description": null,
                    "quantity": 51,
                    "unitCost": "50",
                    "totalPrice": "2550",
                    "createdAt": "2026-01-25T02:34:32.329Z",
                    "deletedAt": null
                }
            ],
            "createdBy": {
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
            "allocation": {
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
                }
            }
        },
        {
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
            "deletedAt": null,
            "vendor": null,
            "items": [
                {
                    "id": 4,
                    "requestId": 3,
                    "name": "444",
                    "description": null,
                    "quantity": 14,
                    "unitCost": "44",
                    "totalPrice": "616",
                    "createdAt": "2026-01-25T02:34:21.058Z",
                    "deletedAt": null
                }
            ],
            "createdBy": {
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
            "allocation": {
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
                }
            }
        },
        {
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
            "deletedAt": null,
            "vendor": null,
            "items": [
                {
                    "id": 3,
                    "requestId": 2,
                    "name": "333",
                    "description": null,
                    "quantity": 1,
                    "unitCost": "30",
                    "totalPrice": "30",
                    "createdAt": "2026-01-25T02:34:10.355Z",
                    "deletedAt": null
                }
            ],
            "createdBy": {
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
            "allocation": {
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
                }
            }
        },
        {
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
            "deletedAt": null,
            "vendor": null,
            "items": [
                {
                    "id": 1,
                    "requestId": 1,
                    "name": "2222",
                    "description": null,
                    "quantity": 1,
                    "unitCost": "110",
                    "totalPrice": "110",
                    "createdAt": "2026-01-25T02:33:48.629Z",
                    "deletedAt": null
                },
                {
                    "id": 2,
                    "requestId": 1,
                    "name": "2222",
                    "description": null,
                    "quantity": 3,
                    "unitCost": "110",
                    "totalPrice": "330",
                    "createdAt": "2026-01-25T02:33:48.629Z",
                    "deletedAt": null
                }
            ],
            "createdBy": {
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
            "allocation": {
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
                }
            }
        }
    ]
}