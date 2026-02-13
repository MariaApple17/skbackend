📊 Dashboard Overview

Retrieve all dashboard analytics, KPIs, charts data, activities, and system logs from a single endpoint.

This endpoint supports:

✅ Active fiscal year (default)

✅ Past fiscal years

✅ ALL years aggregation & comparison

🔗 Endpoint
GET /api/dashboard/overview

🔎 Request Parameters (Optional)
Parameter	Type	Description
mode	string	YEAR (default) or ALL
year	number	Specific fiscal year (e.g. 2024)
fiscalYearId	number	Specific fiscal year ID

⚠️ Priority:

mode=ALL

fiscalYearId

year

Active fiscal year (default)

✅ Success Response (200)
🔹 Single Fiscal Year (Default / YEAR Mode)
{
    "success": true,
    "data": {
        "mode": "YEAR",
        "fiscalYear": {
            "id": 3,
            "year": 2026,
            "isActive": true
        },
        "budget": {
            "total": 2000000,
            "allocated": 100000,
            "used": 0,
            "remaining": 2000000,
            "utilizationRate": "0.00"
        },
        "procurement": [
            {
                "_count": {
                    "id": 2
                },
                "_sum": {
                    "amount": "214"
                },
                "status": "APPROVED"
            },
            {
                "_count": {
                    "id": 1
                },
                "_sum": {
                    "amount": "25"
                },
                "status": "PURCHASED"
            }
        ],
        "approvals": [
            {
                "_count": {
                    "id": 5
                },
                "status": "APPROVED"
            }
        ],
        "users": {
            "total": 1,
            "byStatus": [
                {
                    "_count": {
                        "id": 1
                    },
                    "status": "ACTIVE"
                }
            ],
            "byRole": [
                {
                    "_count": {
                        "id": 1
                    },
                    "roleId": 1
                }
            ]
        },
        "logs": {
            "recent": [
                {
                    "id": 103,
                    "level": "INFO",
                    "message": "FiscalYear update",
                    "context": null,
                    "userId": null,
                    "createdAt": "2026-01-29T06:04:13.380Z",
                    "deletedAt": null,
                    "user": null
                },
                {
                    "id": 102,
                    "level": "INFO",
                    "message": "SystemProfile update",
                    "context": null,
                    "userId": null,
                    "createdAt": "2026-01-28T11:09:39.627Z",
                    "deletedAt": null,
                    "user": null
                },
                {
                    "id": 101,
                    "level": "INFO",
                    "message": "SystemProfile update",
                    "context": null,
                    "userId": null,
                    "createdAt": "2026-01-28T11:09:24.914Z",
                    "deletedAt": null,
                    "user": null
                },
                {
                    "id": 100,
                    "level": "INFO",
                    "message": "SkOfficial create",
                    "context": null,
                    "userId": null,
                    "createdAt": "2026-01-28T11:08:04.155Z",
                    "deletedAt": null,
                    "user": null
                },
                {
                    "id": 99,
                    "level": "INFO",
                    "message": "SystemProfile update",
                    "context": null,
                    "userId": null,
                    "createdAt": "2026-01-28T10:54:21.918Z",
                    "deletedAt": null,
                    "user": null
                },
                {
                    "id": 98,
                    "level": "INFO",
                    "message": "SystemProfile update",
                    "context": null,
                    "userId": null,
                    "createdAt": "2026-01-28T10:54:10.848Z",
                    "deletedAt": null,
                    "user": null
                },
                {
                    "id": 97,
                    "level": "INFO",
                    "message": "SystemProfile update",
                    "context": null,
                    "userId": null,
                    "createdAt": "2026-01-28T10:54:05.505Z",
                    "deletedAt": null,
                    "user": null
                },
                {
                    "id": 96,
                    "level": "INFO",
                    "message": "ProcurementProof create",
                    "context": null,
                    "userId": null,
                    "createdAt": "2026-01-28T10:53:46.915Z",
                    "deletedAt": null,
                    "user": null
                },
                {
                    "id": 95,
                    "level": "INFO",
                    "message": "Program update",
                    "context": null,
                    "userId": null,
                    "createdAt": "2026-01-28T10:45:55.019Z",
                    "deletedAt": null,
                    "user": null
                },
                {
                    "id": 94,
                    "level": "INFO",
                    "message": "Program update",
                    "context": null,
                    "userId": null,
                    "createdAt": "2026-01-28T10:38:05.359Z",
                    "deletedAt": null,
                    "user": null
                }
            ],
            "summary": [
                {
                    "_count": {
                        "id": 103
                    },
                    "level": "INFO"
                }
            ]
        }
    }
}

🔹 ALL Fiscal Years (Comparison & Totals)
{
    "success": true,
    "data": {
        "mode": "ALL",
        "totals": {
            "total": 1002000000,
            "allocated": 100000,
            "used": 0,
            "remaining": 1002000000
        },
        "yearly": [
            {
                "fiscalYear": 2025,
                "total": 1000000000,
                "allocated": 0,
                "used": 0,
                "remaining": 1000000000,
                "utilizationRate": "0.00"
            },
            {
                "fiscalYear": 2026,
                "total": 2000000,
                "allocated": 100000,
                "used": 0,
                "remaining": 2000000,
                "utilizationRate": "0.00"
            }
        ]
    }
}

📌 Best used for:

Bar charts (year vs budget)

Line charts (utilization trends)

KPI totals (multi-year overview)

❌ Error Responses
🔸 Business Logic Error (404)
{
  "success": false,
  "message": "No budget found for this fiscal year"
}

🔸 System Error (500)
{
  "success": false,
  "message": "Failed to load dashboard data"
}

🧠 Notes for Frontend & Reporting

mode=YEAR → full analytics + logs

mode=ALL → aggregates only (fast, chart-friendly)

Logs are intentionally excluded from ALL mode for performance

Designed for Next.js dashboards & admin panels