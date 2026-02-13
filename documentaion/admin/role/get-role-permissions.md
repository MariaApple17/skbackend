Retrieve only the permissions assigned to a specific role.

Endpoint

GET /api/roles/:id/permissions

Path Parameters
Name	Type	Required	Description
id	number	✅ Yes	Role ID
Behavior

Returns permissions only if the role exists and is not soft-deleted

Includes only active permissions (deletedAt = null)

Each permission object includes its key and module

If the role does not exist, a 404 error is returned

Sample Success Response (200)
{
    "success": true,
    "data": [
        {
            "id": 1,
            "key": "DASHBOARD_VIEW",
            "description": null,
            "module": "DASHBOARD",
            "createdAt": "2026-01-11T04:19:31.472Z",
            "updatedAt": "2026-01-11T04:19:31.472Z",
            "deletedAt": null
        },
        {
            "id": 2,
            "key": "PROCUREMENT_CREATE",
            "description": null,
            "module": "PROCUREMENT",
            "createdAt": "2026-01-11T04:19:31.472Z",
            "updatedAt": "2026-01-11T04:19:31.472Z",
            "deletedAt": null
        },
        {
            "id": 3,
            "key": "PROCUREMENT_UPDATE",
            "description": null,
            "module": "PROCUREMENT",
            "createdAt": "2026-01-11T04:19:31.472Z",
            "updatedAt": "2026-01-11T04:19:31.472Z",
            "deletedAt": null
        },
        {
            "id": 4,
            "key": "PROCUREMENT_APPROVE",
            "description": null,
            "module": "PROCUREMENT",
            "createdAt": "2026-01-11T04:19:31.472Z",
            "updatedAt": "2026-01-11T04:19:31.472Z",
            "deletedAt": null
        },
        {
            "id": 5,
            "key": "PROCUREMENT_SOFTDELETE",
            "description": null,
            "module": "PROCUREMENT",
            "createdAt": "2026-01-11T04:19:31.472Z",
            "updatedAt": "2026-01-11T04:19:31.472Z",
            "deletedAt": null
        },
        {
            "id": 6,
            "key": "REPORT_VIEW",
            "description": null,
            "module": "REPORT",
            "createdAt": "2026-01-11T04:19:31.472Z",
            "updatedAt": "2026-01-11T04:19:31.472Z",
            "deletedAt": null
        },
        {
            "id": 7,
            "key": "DATA_SETUP_CREATE",
            "description": null,
            "module": "DATA_SETUP",
            "createdAt": "2026-01-11T04:19:31.472Z",
            "updatedAt": "2026-01-11T04:19:31.472Z",
            "deletedAt": null
        },
        {
            "id": 8,
            "key": "DATA_SETUP_UPDATE",
            "description": null,
            "module": "DATA_SETUP",
            "createdAt": "2026-01-11T04:19:31.472Z",
            "updatedAt": "2026-01-11T04:19:31.472Z",
            "deletedAt": null
        },
        {
            "id": 9,
            "key": "DATA_SETUP_SOFTDELETE",
            "description": null,
            "module": "DATA_SETUP",
            "createdAt": "2026-01-11T04:19:31.472Z",
            "updatedAt": "2026-01-11T04:19:31.472Z",
            "deletedAt": null
        },
        {
            "id": 10,
            "key": "ROLE_CREATE",
            "description": null,
            "module": "ROLES_PERMISSION",
            "createdAt": "2026-01-11T04:19:31.472Z",
            "updatedAt": "2026-01-11T04:19:31.472Z",
            "deletedAt": null
        },
        {
            "id": 11,
            "key": "ROLE_UPDATE",
            "description": null,
            "module": "ROLES_PERMISSION",
            "createdAt": "2026-01-11T04:19:31.472Z",
            "updatedAt": "2026-01-11T04:19:31.472Z",
            "deletedAt": null
        },
        {
            "id": 12,
            "key": "ROLE_SOFTDELETE",
            "description": null,
            "module": "ROLES_PERMISSION",
            "createdAt": "2026-01-11T04:19:31.472Z",
            "updatedAt": "2026-01-11T04:19:31.472Z",
            "deletedAt": null
        },
        {
            "id": 13,
            "key": "ROLE_ASSIGN_PERMISSION",
            "description": null,
            "module": "ROLES_PERMISSION",
            "createdAt": "2026-01-11T04:19:31.472Z",
            "updatedAt": "2026-01-11T04:19:31.472Z",
            "deletedAt": null
        },
        {
            "id": 14,
            "key": "USER_CREATE",
            "description": null,
            "module": "USER_MANAGEMENT",
            "createdAt": "2026-01-11T04:19:31.472Z",
            "updatedAt": "2026-01-11T04:19:31.472Z",
            "deletedAt": null
        },
        {
            "id": 15,
            "key": "USER_UPDATE",
            "description": null,
            "module": "USER_MANAGEMENT",
            "createdAt": "2026-01-11T04:19:31.472Z",
            "updatedAt": "2026-01-11T04:19:31.472Z",
            "deletedAt": null
        },
        {
            "id": 16,
            "key": "USER_SOFTDELETE",
            "description": null,
            "module": "USER_MANAGEMENT",
            "createdAt": "2026-01-11T04:19:31.472Z",
            "updatedAt": "2026-01-11T04:19:31.472Z",
            "deletedAt": null
        },
        {
            "id": 17,
            "key": "USER_ASSIGN_ROLE",
            "description": null,
            "module": "USER_MANAGEMENT",
            "createdAt": "2026-01-11T04:19:31.472Z",
            "updatedAt": "2026-01-11T04:19:31.472Z",
            "deletedAt": null
        },
        {
            "id": 18,
            "key": "SYSTEM_SETTINGS_MANAGE",
            "description": null,
            "module": "SYSTEM_SETTINGS",
            "createdAt": "2026-01-11T04:19:31.472Z",
            "updatedAt": "2026-01-11T04:19:31.472Z",
            "deletedAt": null
        }
    ]
}
Not Found Response (404)

Returned when the role ID does not exist or the role has been soft-deleted.

{
  "success": false,
  "message": "Role not found"
}

🧪 Error Response Format

All error responses follow this structure:

{
  "success": false,
  "message": "Error description here"
}

⚠️ Notes

Soft-deleted roles are not accessible

Soft-deleted permissions are never returned

This endpoint returns permissions only, not role metadata