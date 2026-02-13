# Budget Classification Limit API

Manage budget limits for classifications. Each limit defines how much of a budget can be allocated to a specific classification.

---

## Create Classification Limit

Create a new budget classification limit.

### Endpoint

`POST /api/classification-limits`

### Request Body

```json
{
  "budgetId": 1,
  "classificationId": 2,
  "limitAmount": 300000
}
```

| Field              | Type   | Required | Description                     |
|--------------------|--------|----------|---------------------------------|
| `budgetId`         | number | Yes      | Budget ID                       |
| `classificationId` | number | Yes      | Classification ID               |
| `limitAmount`      | number | Yes      | Limit amount (must be > 0)      |

### Success Response (201)

```json
{
  "success": true,
  "message": "Classification limit created successfully",
  "data": {
    "id": 1,
    "budgetId": 1,
    "classificationId": 2,
    "limitAmount": "300000",
    "createdAt": "2026-01-12T02:28:03.130Z",
    "updatedAt": "2026-01-12T02:28:03.130Z",
    "budget": {
      "id": 1,
      "totalAmount": "1000000",
      "fiscalYear": {
        "id": 1,
        "year": 2026
      }
    },
    "classification": {
      "id": 2,
      "code": "BC-001",
      "name": "General Services"
    }
  }
}
```

### Error Responses

#### Validation Error (400)

```json
{
  "success": false,
  "message": "Invalid limit amount"
}
```

#### Budget Not Found (404)

```json
{
  "success": false,
  "message": "Budget not found"
}
```

#### Classification Not Found (404)

```json
{
  "success": false,
  "message": "Classification not found"
}
```

#### Duplicate Error (400)

```json
{
  "success": false,
  "message": "Budget limit for this classification already exists"
}
```

#### Exceeds Budget (400)

```json
{
  "success": false,
  "message": "Limit amount exceeds remaining budget. Remaining budget: 200000"
}
```

---

## Get All Classification Limits

Retrieve all classification limits, optionally filtered by budget.

### Endpoint

`GET /api/classification-limits`

### Query Parameters

| Param      | Type   | Required | Description                        |
|------------|--------|----------|------------------------------------|
| `budgetId` | number | No       | Filter by budget ID                |

### Success Response (200)

```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "budgetId": 1,
      "classificationId": 2,
      "limitAmount": "300000",
      "createdAt": "2026-01-12T02:28:03.130Z",
      "updatedAt": "2026-01-12T02:28:03.130Z",
      "budget": {
        "id": 1,
        "totalAmount": "1000000",
        "fiscalYear": {
          "id": 1,
          "year": 2026
        }
      },
      "classification": {
        "id": 2,
        "code": "BC-001",
        "name": "General Services"
      }
    }
  ]
}
```

---

## Get Classification Limit by ID

Retrieve a single classification limit by ID.

### Endpoint

`GET /api/classification-limits/:id`

### URL Parameters

| Param | Type   | Description |
|-------|--------|-------------|
| `id`  | number | Limit ID    |

### Success Response (200)

```json
{
  "success": true,
  "data": {
    "id": 1,
    "budgetId": 1,
    "classificationId": 2,
    "limitAmount": "300000",
    "createdAt": "2026-01-12T02:28:03.130Z",
    "updatedAt": "2026-01-12T02:28:03.130Z",
    "budget": {
      "id": 1,
      "totalAmount": "1000000",
      "fiscalYear": {
        "id": 1,
        "year": 2026
      }
    },
    "classification": {
      "id": 2,
      "code": "BC-001",
      "name": "General Services"
    }
  }
}
```

### Error Response (404)

```json
{
  "success": false,
  "message": "Classification limit not found"
}
```

---

## Update Classification Limit

Update an existing classification limit amount.

### Endpoint

`PUT /api/classification-limits/:id`

### URL Parameters

| Param | Type   | Description |
|-------|--------|-------------|
| `id`  | number | Limit ID    |

### Request Body

```json
{
  "limitAmount": 350000
}
```

| Field         | Type   | Required | Description                |
|---------------|--------|----------|----------------------------|
| `limitAmount` | number | Yes      | New limit amount (must > 0)|

### Success Response (200)

```json
{
  "success": true,
  "message": "Classification limit updated successfully",
  "data": {
    "id": 1,
    "budgetId": 1,
    "classificationId": 2,
    "limitAmount": "350000",
    "createdAt": "2026-01-12T02:28:03.130Z",
    "updatedAt": "2026-01-12T02:35:00.000Z",
    "budget": {
      "id": 1,
      "totalAmount": "1000000",
      "fiscalYear": {
        "id": 1,
        "year": 2026
      }
    },
    "classification": {
      "id": 2,
      "code": "BC-001",
      "name": "General Services"
    }
  }
}
```

### Error Responses

#### Not Found (404)

```json
{
  "success": false,
  "message": "Classification limit not found"
}
```

#### Validation Error (400)

```json
{
  "success": false,
  "message": "Limit amount must be greater than zero"
}
```

#### Exceeds Budget (400)

```json
{
  "success": false,
  "message": "Limit amount exceeds remaining budget. Remaining budget: 400000"
}
```

---

## Delete Classification Limit

Delete a classification limit.

### Endpoint

`DELETE /api/classification-limits/:id`

### URL Parameters

| Param | Type   | Description |
|-------|--------|-------------|
| `id`  | number | Limit ID    |

### Success Response (200)

```json
{
  "success": true,
  "message": "Classification limit deleted successfully"
}
```

### Error Responses

#### Not Found (404)

```json
{
  "success": false,
  "message": "Classification limit not found"
}
```

#### Has Allocations (400)

```json
{
  "success": false,
  "message": "Cannot delete limit with existing budget allocations"
}
```

---

## Get Limits by Classification

Get all budget limits for a specific classification.

### Endpoint

`GET /api/classification-limits/classification/:classificationId`

### URL Parameters

| Param              | Type   | Description       |
|--------------------|--------|-------------------|
| `classificationId` | number | Classification ID |

### Success Response (200)

```json
{
  "success": true,
  "data": {
    "classification": {
      "id": 2,
      "code": "BC-001",
      "name": "General Services",
      "description": "General operating expenses",
      "createdAt": "2026-01-12T02:28:03.130Z",
      "updatedAt": "2026-01-12T02:28:03.130Z",
      "deletedAt": null
    },
    "limits": [
      {
        "id": 1,
        "budgetId": 1,
        "classificationId": 2,
        "limitAmount": "300000",
        "createdAt": "2026-01-12T02:28:03.130Z",
        "updatedAt": "2026-01-12T02:28:03.130Z",
        "budget": {
          "id": 1,
          "totalAmount": "1000000",
          "fiscalYear": {
            "id": 1,
            "year": 2026
          }
        },
        "classification": {
          "id": 2,
          "code": "BC-001",
          "name": "General Services"
        }
      }
    ]
  }
}
```

### Error Response (404)

```json
{
  "success": false,
  "message": "Classification not found"
}
```

---

## Get Remaining Budget

Get the remaining unallocated budget amount for a specific budget.

### Endpoint

`GET /api/classification-limits/remaining/:budgetId`

### URL Parameters

| Param      | Type   | Description |
|------------|--------|-------------|
| `budgetId` | number | Budget ID   |

### Success Response (200)

```json
{
  "success": true,
  "data": {
    "budgetId": 1,
    "totalAmount": 1000000,
    "totalAllocated": 600000,
    "remaining": 400000
  }
}
```

### Error Response (404)

```json
{
  "success": false,
  "message": "Budget not found"
}
```