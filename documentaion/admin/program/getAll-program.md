GET ALL PROGRAMS

Method
GET

Endpoint
/api/programs

🔎 Query Parameters (Optional)
Parameter	Type	Description	Example
q	string	Search keyword (code, name, description, committee, beneficiaries)	scholar
isActive	boolean	Filter by active status	true
startDateFrom	date	Filter programs starting from date (YYYY-MM-DD)	2026-01-01
startDateTo	date	Filter programs up to date (YYYY-MM-DD)	2026-12-31
sortBy	string	Sort field	createdAt, name, code
sortOrder	string	Sort direction	asc / desc
page	number	Page number (default: 1)	1
limit	number	Items per page (default: 10)	10
📌 Notes

Search (q) matches code, name, description, committeeInCharge, beneficiaries

Deleted programs (deletedAt != null) are excluded

Results include program documentation images via documents[]

📥 Sample Requests
Basic
GET /api/programs

Search
GET /api/programs?q=scholar

Filter Active Programs
GET /api/programs?isActive=true

Sort by Name
GET /api/programs?sortBy=name&sortOrder=asc

Paginated
GET /api/programs?page=2&limit=5

Combined
GET /api/programs?q=education&isActive=true&page=1&limit=10&sortBy=createdAt&sortOrder=desc

✅ Sample Success Response (200)
{
  "success": true,
  "data": [
    {
      "id": 2,
      "code": "PRG-002",
      "name": "Scholarship Program",
      "description": "Student assistance",
      "committeeInCharge": "Education Committee",
      "beneficiaries": "College Students",
      "startDate": "2026-01-31T00:00:00.000Z",
      "endDate": "2026-12-01T00:00:00.000Z",
      "isActive": true,
      "createdAt": "2026-01-11T11:18:03.813Z",
      "updatedAt": "2026-01-11T11:18:03.813Z",
      "deletedAt": null,
      "documents": [
        {
          "id": 21,
          "imageUrl": "https://res.cloudinary.com/.../programs/doc-1.png",
          "title": "launch-photo.jpg",
          "uploadedBy": "Juan Dela Cruz",
          "createdAt": "2026-01-11T11:18:05.120Z"
        }
      ]
    },
    {
      "id": 1,
      "code": "PRG-001",
      "name": "Youth Development Program",
      "description": "Community engagement",
      "committeeInCharge": "Youth Affairs",
      "beneficiaries": "Out-of-school youth",
      "startDate": "2026-02-01T00:00:00.000Z",
      "endDate": "2026-11-30T00:00:00.000Z",
      "isActive": true,
      "createdAt": "2026-01-11T11:06:19.254Z",
      "updatedAt": "2026-01-11T11:06:19.254Z",
      "deletedAt": null,
      "documents": []
    }
  ],
  "meta": {
    "total": 2,
    "page": 1,
    "limit": 10,
    "totalPages": 1
  }
}

❌ Possible Error Responses
401 – Unauthorized
{
  "success": false,
  "message": "Unauthorized"
}

500 – Server Error
{
  "success": false,
  "message": "Internal server error"
}

🔁 What Changed from Old Version
Old	New
imageUrl	❌ removed
Single image	❌
Program photos	documents[]
Flat response	Program + documents