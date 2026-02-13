Get System Profile

Retrieve the system profile for the active fiscal year.  
Only one system profile exists. If not found, a default profile is automatically created.

Endpoint

GET /api/system-profile

Success Response (200)

{
    "success": true,
    "data": {
        "id": 1,
        "fiscalYearId": 3,
        "systemName": "SK Budget Management System",
        "systemDescription": "Default system profile",
        "logoUrl": "",
        "location": "Baranggay BongBong, Trinidad, Bohol",
        "createdAt": "2026-01-28T06:08:24.178Z",
        "updatedAt": "2026-01-28T06:08:24.178Z",
        "deletedAt": null,
        "fiscalYear": {
            "id": 3,
            "year": 2026,
            "isActive": true,
            "createdAt": "2026-01-27T04:19:25.933Z",
            "deletedAt": null
        }
    }
}

Error Response (400)

{
  "success": false,
  "message": "No active fiscal year found"
}
