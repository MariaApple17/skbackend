✏️ Update Procurement Request

Update an existing procurement request.
⚠️ Only requests with DRAFT status can be updated.

🔗 Endpoint
PUT /api/procurement/:id

🔐 Authentication (REQUIRED)

Header

Authorization: Bearer <JWT_TOKEN>


The authenticated user must be the creator of the request
(ownership enforcement can be enabled if not already)

📝 Request Body
✅ Allowed Request Body
{
  "title": "Updated Office Supplies",
  "description": "Updated procurement description",
  "amount": 26000
}

🔎 Request Body Rules
Field	Type	Required	Notes
title	string	❌	New request title
description	string	❌	Optional updated description
amount	number	❌	Must be a valid number

🔒 Items, allocation, and vendor cannot be updated in this endpoint.

✅ Success Response (200)
{
  "success": true,
  "message": "Procurement request updated successfully",
  "data": {
    "id": 1,
    "status": "DRAFT",
    "title": "Updated Office Supplies",
    "amount": 26000
  }
}

❌ Error Responses
400 — Business Rule Violation
{
  "success": false,
  "message": "Only draft requests can be updated"
}

{
  "success": false,
  "message": "Request not found"
}

401 — Unauthorized
{
  "success": false,
  "message": "Invalid or expired token"
}

🧠 Notes & Best Practices

🔒 This endpoint does not allow item updates

✏️ Changes are limited to request-level fields

🚫 Submitted, approved, or completed requests cannot be edited

📦 Item updates should be handled via a dedicated endpoint (recommended)