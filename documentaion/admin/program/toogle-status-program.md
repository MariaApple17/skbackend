TOGGLE PROGRAM STATUS

Method
PATCH

Endpoint
/api/programs/toggle-status/:id

Sample Success Response (200)

{
    "success": true,
    "data": {
        "id": 1,
        "code": "PRG-001",
        "name": "Scholarship Program",
        "description": "Student assistance",
        "imageUrl": "/uploads/programs/1768129579230-362227515.png",
        "committeeInCharge": "Education Committee",
        "beneficiaries": "College Students",
        "startDate": "2026-01-31T00:00:00.000Z",
        "endDate": "2026-12-01T00:00:00.000Z",
        "isActive": true,
        "createdAt": "2026-01-11T11:06:19.254Z",
        "updatedAt": "2026-01-11T11:23:54.933Z",
        "deletedAt": null
    }
}