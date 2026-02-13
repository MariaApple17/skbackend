SK Officials API

Manage Sangguniang Kabataan (SK) Officials including creation, listing with pagination and filters, update with image upload, status toggle, and deletion.

Base Route

{{base_url}}/sk-officials

────────────────────────────
Create SK Official
────────────────────────────

Create a new SK Official with optional profile image upload.

Endpoint

POST /sk-officials

Content-Type

multipart/form-data

Request Body (Form Data)

| Field            | Type    | Required | Description |
|------------------|---------|----------|-------------|
| fiscalYearId    | number  | ✅ Yes   | Fiscal Year ID |
| position        | string  | ✅ Yes   | SK position |
| fullName        | string  | ✅ Yes   | Full name |
| responsibility | string  | ❌ No    | Responsibilities |
| birthDate       | string  | ✅ Yes   | ISO date (YYYY-MM-DD) |
| email           | string  | ❌ No    | Email address |
| gender          | string  | ✅ Yes   | MALE, FEMALE, OTHER |
| isActive        | boolean | ❌ No    | Defaults to true |
| profileImage    | file    | ❌ No    | Profile image |

Success Response (201)

```json
{
  "success": true,
  "message": "SK Official created successfully",
  "data": { ... }
}
Error Response (400)

{
  "success": false,
  "message": "Failed to create SK Official"
}
────────────────────────────
List SK Officials (Pagination & Filters)
────────────────────────────

Retrieve SK Officials by fiscal year with pagination and optional filters.

Endpoint

GET /sk-officials/fiscal/:fiscalYearId

Query Parameters

Parameter	Type	Required	Description
page	number	❌ No	Page number (default: 1)
limit	number	❌ No	Items per page (default: 10)
position	string	❌ No	Filter by position
fullName	string	❌ No	Filter by full name
gender	string	❌ No	MALE, FEMALE, OTHER
isActive	boolean	❌ No	true / false
Example Requests

GET /sk-officials/fiscal/3?page=1&limit=10
GET /sk-officials/fiscal/3?position=Chairperson
GET /sk-officials/fiscal/3?fullName=Juan&isActive=true
Success Response (200)

{
  "success": true,
  "message": "SK Officials retrieved successfully",
 "data": {
        "id": 2,
        "fiscalYearId": 3,
        "position": "SK Chairperson",
        "fullName": "Juan Dela Cruz",
        "responsibility": "Overall supervision of SK programs and budget",
        "birthDate": "2000-05-15T00:00:00.000Z",
        "email": "juan.delacruz@example.com",
        "gender": "MALE",
        "profileImageUrl": null,
        "isActive": true,
        "createdAt": "2026-01-27T06:44:55.946Z",
        "updatedAt": "2026-01-27T06:44:55.946Z",
        "deletedAt": null
    },
  "meta": {
    "page": 1,
    "limit": 10,
    "total": 25,
    "totalPages": 3
  }
}
────────────────────────────
Get SK Official by ID
────────────────────────────

Endpoint

GET /sk-officials/:id

Success Response (200)

{
  "success": true,
  "message": "SK Official retrieved successfully",
  "data": { ... }
}
Error Response (404)

{
  "success": false,
  "message": "SK Official not found"
}
────────────────────────────
Update SK Official
────────────────────────────

Update an existing SK Official. Supports updating profile image.

Endpoint

PUT /sk-officials/:id

Content-Type

multipart/form-data

Request Body (Form Data)

Field	Type	Required	Description
position	string	❌ No	SK position
fullName	string	❌ No	Full name
responsibility	string	❌ No	Responsibilities
birthDate	string	❌ No	ISO date
email	string	❌ No	Email
gender	string	❌ No	MALE, FEMALE, OTHER
isActive	boolean	❌ No	Active status
profileImage	file	❌ No	New profile image
Success Response (200)

{
  "success": true,
  "message": "SK Official updated successfully",
  "data": { ... }
}
────────────────────────────
Toggle SK Official Status
────────────────────────────

Activate or deactivate an SK Official.

Endpoint

PATCH /sk-officials/:id/status

Request Body

{
  "isActive": false
}
Success Response (200)

{
  "success": true,
  "message": "SK Official deactivated successfully",
  "data": { ... }
}
────────────────────────────
Delete SK Official
────────────────────────────

Soft-delete an SK Official.

Endpoint

DELETE /sk-officials/:id

Success Response (200)

{
  "success": true,
  "message": "SK Official deleted successfully"
}
────────────────────────────
Notes
────────────────────────────

All delete operations are soft deletes (deletedAt)

File uploads use multipart/form-data

profileImageUrl is generated automatically

Filters are case-sensitive

Pagination metadata is always included in list responses