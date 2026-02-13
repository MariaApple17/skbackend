# Create Classification

Create a new budget classification.

## Endpoint

`POST /api/classifications`

## Request Body

```json
{
  "code": "BC-001",
  "name": "General Services",
  "description": "General operating expenses"
}
```

| Field         | Type   | Required | Description                          |
|---------------|--------|----------|--------------------------------------|
| `code`        | string | Yes      | Unique classification code           |
| `name`        | string | Yes      | Unique classification name           |
| `description` | string | No       | Optional description                 |

## Success Response (201)

```json
{
  "success": true,
  "message": "Classification created successfully",
  "data": {
    "id": 5,
    "code": "BC-001",
    "name": "General Services",
    "description": "General operating expenses",
    "createdAt": "2026-01-12T02:28:03.130Z",
    "updatedAt": "2026-01-12T02:28:03.130Z",
    "deletedAt": null
  }
}
```

## Error Responses

### Validation Error (400)

```json
{
  "success": false,
  "message": "Code and name are required"
}
```

### Duplicate Error (400)

```json
{
  "success": false,
  "message": "Classification code or name already exists"
}
```