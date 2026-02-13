UPDATE PROGRAM

Method
PUT

Endpoint
/api/programs/:id

Content-Type
application/json

🔗 URL Parameters
Parameter	Type	Required	Description
id	number	✅	Program ID
✅ Request Body (JSON)

All fields are optional. Only provided fields will be updated.

Key	Type	Required	Description
name	string	❌	Program name
description	string	❌	Program description
committeeInCharge	string	❌	Responsible committee
beneficiaries	string	❌	Target beneficiaries
startDate	string	❌	Start date (YYYY-MM-DD)
endDate	string	❌	End date (YYYY-MM-DD)
isActive	boolean	❌	true / false

📌 IMPORTANT

All fields are optional

Images are NOT updated here

Use POST /api/programs/:id/documents to add documentation images

Existing documents remain untouched

📥 Sample Request
PUT /api/programs/2
Content-Type: application/json

{
  "name": "Updated Scholarship Program",
  "description": "Updated student assistance",
  "isActive": true
}

✅ Sample Success Response (200)
{
  "success": true,
  "data": {
    "id": 2,
    "code": "PRG-002",
    "name": "Updated Scholarship Program",
    "description": "Updated student assistance",
    "committeeInCharge": "Education Committee",
    "beneficiaries": "College Students",
    "startDate": "2026-01-31T00:00:00.000Z",
    "endDate": "2026-12-01T00:00:00.000Z",
    "isActive": true,
    "createdAt": "2026-01-11T11:18:03.813Z",
    "updatedAt": "2026-01-12T09:41:22.104Z",
    "deletedAt": null,
    "documents": [
      {
        "id": 41,
        "imageUrl": "https://res.cloudinary.com/.../programs/doc-1.png",
        "title": "orientation.jpg",
        "uploadedBy": "Juan Dela Cruz",
        "createdAt": "2026-01-11T11:19:10.003Z"
      }
    ]
  }
}

❌ Possible Error Responses
400 – Validation Error
{
  "success": false,
  "message": "Program not found"
}

401 – Unauthorized
{
  "success": false,
  "message": "Unauthorized"
}

🔁 What Changed from Old Version
Old	New
multipart/form-data	application/json
image field	❌ removed
Image replace on update	❌ not allowed
imageUrl on Program	❌ removed
Program photos	documents[]