Upload Procurement Proof

Upload a proof document for a procurement request.

Endpoint

POST /api/procurement/upload-proof

Request Body (multipart/form-data)
file: PDF / JPG / PNG  
requestId: number  
type: OR | DR | Invoice  
description: string (optional)

Success Response (201)
{
  "success": true,
  "message": "Proof uploaded successfully",
  "data": {
    "id": 1,
    "requestId": 1,
    "fileUrl": "/uploads/procurement/abc123.pdf"
  }
}

Error Response (400)
{
  "success": false,
  "message": "File is required"
}
