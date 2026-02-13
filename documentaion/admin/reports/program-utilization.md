📊 Program Utilization Report API

Returns a summary of budget utilization per program, showing allocated, used, and remaining amounts.

Endpoint
GET {{base_url}}/reports/program-utilization

Description

This endpoint provides a high-level financial utilization report per program, including:

Total allocated budget

Total used (spent) amount

Remaining available funds

Primarily used for executive dashboards, budget monitoring, and planning reports.

Request
Method
GET

Headers
Content-Type: application/json
Authorization: Bearer <access_token>

Query Parameters (Optional)
Name	Type	Description
fiscalYearId	number	Filter by fiscal year
programId	number	Filter by specific program
dateFrom	date	Filter utilization from date
dateTo	date	Filter utilization until date
Sample Request
GET {{base_url}}/reports/program-utilization
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6...

Success Response
HTTP Status
200 OK

Response Body
{
  "success": true,
  "data": [
    {
      "programId": 1,
      "programName": "222",
      "allocated": 22222,
      "used": 960,
      "remaining": 21262
    }
  ]
}