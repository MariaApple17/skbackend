CREATE PROGRAM

Method
POST

Endpoint
/api/programs

Content-Type
multipart/form-data

✅ Request Body (form-data)
Text Fields
Key	Type	Required	Description
code	Text	✅	Unique program code
name	Text	✅	Program name
description	Text	❌	Program description
committeeInCharge	Text	✅	Committee responsible
beneficiaries	Text	✅	Target beneficiaries
startDate	Text	✅	Start date (YYYY-MM-DD)
endDate	Text	✅	End date (YYYY-MM-DD)
isActive	Text	❌	true / false (default: true)
File Fields (Documentation Images)
Key	Type	Required	Description
documents	File[]	❌	Multiple program documentation images (jpg/png/webp, max 5MB each)

📌 IMPORTANT

Field name for image uploads must be documents

Multiple files are supported

Images are stored separately in ProgramDocumentImage

imageUrl no longer exists on Program

📦 Sample Request (form-data)
code = PRG-003
name = Scholarship Program
description = Student assistance
committeeInCharge = Education Committee
beneficiaries = College Students
startDate = 2026-01-31
endDate = 2026-12-01
isActive = true
documents = img1.jpg
documents = img2.jpg
documents = img3.jpg

✅ Sample Success Response (201)
{
  "success": true,
  "data": {
    "id": 3,
    "code": "PRG-003",
    "name": "Scholarship Program",
    "description": "Student assistance",
    "committeeInCharge": "Education Committee",
    "beneficiaries": "College Students",
    "startDate": "2026-01-31T00:00:00.000Z",
    "endDate": "2026-12-01T00:00:00.000Z",
    "isActive": true,
    "createdAt": "2026-01-11T11:18:51.642Z",
    "updatedAt": "2026-01-11T11:18:51.642Z",
    "deletedAt": null,
    "documents": [
      {
        "id": 12,
        "imageUrl": "https://res.cloudinary.com/.../programs/doc-1.png",
        "title": "img1.jpg",
        "uploadedBy": "Juan Dela Cruz",
        "createdAt": "2026-01-11T11:18:51.700Z"
      },
      {
        "id": 13,
        "imageUrl": "https://res.cloudinary.com/.../programs/doc-2.png",
        "title": "img2.jpg",
        "uploadedBy": "Juan Dela Cruz",
        "createdAt": "2026-01-11T11:18:51.712Z"
      }
    ]
  }
}

❌ Possible Error Responses
400 – Validation Error
{
  "success": false,
  "message": "Program code already exists"
}

400 – Invalid File
{
  "success": false,
  "message": "Only image files are allowed"
}

401 – Unauthorized
{
  "success": false,
  "message": "Unauthorized"
}