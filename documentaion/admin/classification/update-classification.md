# Update Classification

Update an existing budget classification.

## Endpoint

`PUT /api/classifications/:id`

## URL Params

| Param | Type   | Description       |
|-------|--------|-------------------|
| `id`  | number | Classification ID |

## Request Body

```json
{
  "name": "Administrative Expenses",
  "description": "Office and admin-related expenses"
}
```

| Field         | Type   | Required | Description                              |
|---------------|--------|----------|------------------------------------------|
| `code`        | string | No       | Classification code (restrictions apply) |
| `name`        | string | No       | Classification name                      |
| `description` | string | No       | Classification description               |

> **Note:** Code cannot be changed if the classification is used in budget limits.

## Success Response (200)

```json
{
  "success": true,
  "message": "Classification updated successfully",
  "data": {
    "id": 5,
    "code": "BC-001",
    "name": "Administrative Expenses",
    "description": "Office and admin-related expenses",
    "createdAt": "2026-01-12T02:28:03.130Z",
    "updatedAt": "2026-01-12T02:30:03.297Z",
    "deletedAt": null
  }
}
```

## Error Responses

### No Data Provided (400)

```json
{
  "success": false,
  "message": "No data provided for update"
}
```

### Not Found (400)

```json
{
  "success": false,
  "message": "Classification not found"
}
```

### Duplicate Error (400)

```json
{
  "success": false,
  "message": "Classification code or name already exists"
}
```

### Code Change Restriction (400)

```json
{
  "success": false,
  "message": "Cannot change classification code while it is used in budget limits"
}
```