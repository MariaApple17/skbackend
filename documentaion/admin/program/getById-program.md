GET PROGRAM BY ID

Method
GET

Endpoint
/api/programs/:id

🔗 URL Parameters
Parameter	Type	Required	Description
id	number	✅	Program ID
📥 Sample Request
GET /api/programs/1

✅ Sample Success Response (200)
{
  "success": true,
  "data": {
    "id": 1,
    "code": "PRG-001",
    "name": "Scholarship Program",
    "description": "Student assistance",
    "committeeInCharge": "Education Committee",
    "beneficiaries": "College Students",
    "startDate": "2026-01-31T00:00:00.000Z",
    "endDate": "2026-12-01T00:00:00.000Z",
    "isActive": true,
    "createdAt": "2026-01-11T11:06:19.254Z",
    "updatedAt": "2026-01-11T11:23:54.933Z",
    "deletedAt": null,
    "documents": [
      {
        "id": 31,
        "imageUrl": "https://res.cloudinary.com/.../programs/doc-1.png",
        "title": "opening-day.jpg",
        "description": "Program launch event",
        "uploadedBy": "Juan Dela Cruz",
        "createdAt": "2026-01-11T11:07:02.120Z"
      },
      {
        "id": 32,
        "imageUrl": "https://res.cloudinary.com/.../programs/doc-2.png",
        "title": "orientation.jpg",
        "uploadedBy": "Juan Dela Cruz",
        "createdAt": "2026-01-11T11:08:44.511Z"
      }
    ]
  }
}

📌 Notes

documents[] contains all documentation images for the program

Programs with no images return documents: []

Soft-deleted programs are not returned

❌ Possible Error Responses
404 – Program Not Found
{
  "success": false,
  "message": "Program not found"
}

401 – Unauthorized
{
  "success": false,
  "message": "Unauthorized"
}

🔁 Changes from Old Version
Old	New
imageUrl	❌ removed
Single image	❌
Program photos	documents[]
Flat object	Program + documents