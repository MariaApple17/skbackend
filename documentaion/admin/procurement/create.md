📦 Create Procurement Request

Create a new procurement request.

🔗 Endpoint
POST /api/procurement

🔐 Authentication (REQUIRED)

This endpoint requires authentication.

Header

Authorization: Bearer <JWT_TOKEN>


userId is automatically taken from the JWT
❌ Do NOT send userId in the request body

📝 Request Body
✅ Recommended Request Body
{
  "title": "Office Supplies Purchase",
  "description": "Procurement of office materials",
  "allocationId": 3,
  "vendorId": 2,
  "items": [
    {
      "name": "Bond Paper",
      "quantity": 10,
      "unitCost": 250
    }
  ]
}

🔎 Request Body Rules
Field	Type	Required	Notes
title	string	✅	Procurement title
description	string	❌	Optional request-level description
allocationId	number	✅	Must be a valid budget allocation
vendorId	number	❌	Optional vendor reference
items	array	✅	Must contain at least one item
items[].name	string	✅	Item name
items[].quantity	number	❌	Defaults to 1
items[].unitCost	number	✅	Cost per unit
items[].description	string	❌	Optional item-level description
amount	number	❌	Auto-calculated if omitted
🧮 Amount Handling (IMPORTANT)

If amount is provided → it will be validated

If amount is omitted → it will be auto-calculated from:

sum(items.quantity × items.unitCost)


✅ Recommended: omit amount and let the backend compute it

✅ Success Response (201)
{
  "success": true,
  "message": "Procurement request created successfully",
  "data": {
    "id": 1,
    "title": "Office Supplies Purchase",
    "status": "DRAFT",
    "amount": 2500,
    "allocationId": 3,
    "createdById": 2,
    "items": [
      {
        "id": 1,
        "name": "Bond Paper",
        "quantity": 10,
        "unitCost": 250,
        "totalPrice": 2500
      }
    ]
  }
}

❌ Error Responses
400 — Validation / Business Error
{
  "success": false,
  "message": "At least one procurement item is required"
}

{
  "success": false,
  "message": "Invalid allocationId"
}

{
  "success": false,
  "message": "Invalid amount"
}

401 — Unauthorized
{
  "success": false,
  "message": "Invalid or expired token"
}

🧠 Notes & Best Practices

✅ userId is never sent in request body

✅ Item totalPrice is always calculated by backend

✅ Request starts in DRAFT status

🔒 Only authenticated users can create requests

📊 Budget validation happens on approval, not creation