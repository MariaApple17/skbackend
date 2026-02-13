Update System Profile

Update the system profile for the active fiscal year.  
Only one system profile exists. Logo image is uploaded via Cloudinary.

Endpoint

PUT /api/system-profile

Request Headers

Content-Type: multipart/form-data

Request Body (Form Data)

| Field | Type | Required | Description |
|------|------|----------|-------------|
| systemName | string | yes | Name of the system |
| systemDescription | string | no | Description of the system |
| location | string | no | System location |
| logo | file (image) | no | System logo image |

Example Request (Form Data)

systemName: SK Budget Management System  
systemDescription: Barangay finance and procurement system  
location: Barangay XYZ  
logo: (image file)

Success Response (200)

{
  "success": true,
  "message": "System profile updated successfully",
  "data": {
    "id": 1,
    "fiscalYearId": 1,
    "systemName": "SK Budget Management System",
    "systemDescription": "Barangay finance and procurement system",
    "logoUrl": "https://res.cloudinary.com/demo/image/upload/sk_system/system-profile/logo.png",
    "location": "Barangay XYZ",
    "createdAt": "2026-01-20T09:11:22.000Z",
    "updatedAt": "2026-01-28T08:10:45.456Z",
    "deletedAt": null
  }
}

Error Response (400)

{
  "success": false,
  "message": "No active fiscal year found"
}

Error Response (400)

{
  "success": false,
  "message": "System profile not found"
}
