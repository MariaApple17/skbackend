Retrieve a specific role by its ID, including all assigned permissions.

Endpoint

GET /api/roles/:id

Path Parameters
Name	Type	Required	Description
id	number	✅ Yes	Role ID
Behavior

Returns the role only if it is not soft-deleted (deletedAt = null)

Includes all assigned permissions

Each permission includes its key and module

If the role does not exist or is soft-deleted, a 404 response is returned

Sample Success Response (200)
{
    "success": true,
    "data": {
        "id": 2,
        "name": "No permisions",
        "description": "Full system access",
        "createdAt": "2026-01-11T04:20:15.160Z",
        "updatedAt": "2026-01-11T04:30:37.080Z",
        "deletedAt": null,
        "permissions": [
            {
                "roleId": 2,
                "permissionId": 1,
                "createdAt": "2026-01-11T04:30:37.080Z",
                "deletedAt": null,
                "permission": {
                    "id": 1,
                    "key": "DASHBOARD_VIEW",
                    "description": null,
                    "module": "DASHBOARD",
                    "createdAt": "2026-01-11T04:19:31.472Z",
                    "updatedAt": "2026-01-11T04:19:31.472Z",
                    "deletedAt": null
                }
            },
            {
                "roleId": 2,
                "permissionId": 2,
                "createdAt": "2026-01-11T04:30:37.080Z",
                "deletedAt": null,
                "permission": {
                    "id": 2,
                    "key": "PROCUREMENT_CREATE",
                    "description": null,
                    "module": "PROCUREMENT",
                    "createdAt": "2026-01-11T04:19:31.472Z",
                    "updatedAt": "2026-01-11T04:19:31.472Z",
                    "deletedAt": null
                }
            },
            {
                "roleId": 2,
                "permissionId": 3,
                "createdAt": "2026-01-11T04:30:37.080Z",
                "deletedAt": null,
                "permission": {
                    "id": 3,
                    "key": "PROCUREMENT_UPDATE",
                    "description": null,
                    "module": "PROCUREMENT",
                    "createdAt": "2026-01-11T04:19:31.472Z",
                    "updatedAt": "2026-01-11T04:19:31.472Z",
                    "deletedAt": null
                }
            },
            {
                "roleId": 2,
                "permissionId": 4,
                "createdAt": "2026-01-11T04:30:37.080Z",
                "deletedAt": null,
                "permission": {
                    "id": 4,
                    "key": "PROCUREMENT_APPROVE",
                    "description": null,
                    "module": "PROCUREMENT",
                    "createdAt": "2026-01-11T04:19:31.472Z",
                    "updatedAt": "2026-01-11T04:19:31.472Z",
                    "deletedAt": null
                }
            },
            {
                "roleId": 2,
                "permissionId": 5,
                "createdAt": "2026-01-11T04:30:37.080Z",
                "deletedAt": null,
                "permission": {
                    "id": 5,
                    "key": "PROCUREMENT_SOFTDELETE",
                    "description": null,
                    "module": "PROCUREMENT",
                    "createdAt": "2026-01-11T04:19:31.472Z",
                    "updatedAt": "2026-01-11T04:19:31.472Z",
                    "deletedAt": null
                }
            },
            {
                "roleId": 2,
                "permissionId": 6,
                "createdAt": "2026-01-11T04:30:37.080Z",
                "deletedAt": null,
                "permission": {
                    "id": 6,
                    "key": "REPORT_VIEW",
                    "description": null,
                    "module": "REPORT",
                    "createdAt": "2026-01-11T04:19:31.472Z",
                    "updatedAt": "2026-01-11T04:19:31.472Z",
                    "deletedAt": null
                }
            },
            {
                "roleId": 2,
                "permissionId": 7,
                "createdAt": "2026-01-11T04:30:37.080Z",
                "deletedAt": null,
                "permission": {
                    "id": 7,
                    "key": "DATA_SETUP_CREATE",
                    "description": null,
                    "module": "DATA_SETUP",
                    "createdAt": "2026-01-11T04:19:31.472Z",
                    "updatedAt": "2026-01-11T04:19:31.472Z",
                    "deletedAt": null
                }
            },
            {
                "roleId": 2,
                "permissionId": 8,
                "createdAt": "2026-01-11T04:30:37.080Z",
                "deletedAt": null,
                "permission": {
                    "id": 8,
                    "key": "DATA_SETUP_UPDATE",
                    "description": null,
                    "module": "DATA_SETUP",
                    "createdAt": "2026-01-11T04:19:31.472Z",
                    "updatedAt": "2026-01-11T04:19:31.472Z",
                    "deletedAt": null
                }
            },
            {
                "roleId": 2,
                "permissionId": 9,
                "createdAt": "2026-01-11T04:30:37.080Z",
                "deletedAt": null,
                "permission": {
                    "id": 9,
                    "key": "DATA_SETUP_SOFTDELETE",
                    "description": null,
                    "module": "DATA_SETUP",
                    "createdAt": "2026-01-11T04:19:31.472Z",
                    "updatedAt": "2026-01-11T04:19:31.472Z",
                    "deletedAt": null
                }
            },
            {
                "roleId": 2,
                "permissionId": 10,
                "createdAt": "2026-01-11T04:30:37.080Z",
                "deletedAt": null,
                "permission": {
                    "id": 10,
                    "key": "ROLE_CREATE",
                    "description": null,
                    "module": "ROLES_PERMISSION",
                    "createdAt": "2026-01-11T04:19:31.472Z",
                    "updatedAt": "2026-01-11T04:19:31.472Z",
                    "deletedAt": null
                }
            },
            {
                "roleId": 2,
                "permissionId": 11,
                "createdAt": "2026-01-11T04:30:37.080Z",
                "deletedAt": null,
                "permission": {
                    "id": 11,
                    "key": "ROLE_UPDATE",
                    "description": null,
                    "module": "ROLES_PERMISSION",
                    "createdAt": "2026-01-11T04:19:31.472Z",
                    "updatedAt": "2026-01-11T04:19:31.472Z",
                    "deletedAt": null
                }
            },
            {
                "roleId": 2,
                "permissionId": 12,
                "createdAt": "2026-01-11T04:30:37.080Z",
                "deletedAt": null,
                "permission": {
                    "id": 12,
                    "key": "ROLE_SOFTDELETE",
                    "description": null,
                    "module": "ROLES_PERMISSION",
                    "createdAt": "2026-01-11T04:19:31.472Z",
                    "updatedAt": "2026-01-11T04:19:31.472Z",
                    "deletedAt": null
                }
            },
            {
                "roleId": 2,
                "permissionId": 13,
                "createdAt": "2026-01-11T04:30:37.080Z",
                "deletedAt": null,
                "permission": {
                    "id": 13,
                    "key": "ROLE_ASSIGN_PERMISSION",
                    "description": null,
                    "module": "ROLES_PERMISSION",
                    "createdAt": "2026-01-11T04:19:31.472Z",
                    "updatedAt": "2026-01-11T04:19:31.472Z",
                    "deletedAt": null
                }
            },
            {
                "roleId": 2,
                "permissionId": 14,
                "createdAt": "2026-01-11T04:30:37.080Z",
                "deletedAt": null,
                "permission": {
                    "id": 14,
                    "key": "USER_CREATE",
                    "description": null,
                    "module": "USER_MANAGEMENT",
                    "createdAt": "2026-01-11T04:19:31.472Z",
                    "updatedAt": "2026-01-11T04:19:31.472Z",
                    "deletedAt": null
                }
            },
            {
                "roleId": 2,
                "permissionId": 15,
                "createdAt": "2026-01-11T04:30:37.080Z",
                "deletedAt": null,
                "permission": {
                    "id": 15,
                    "key": "USER_UPDATE",
                    "description": null,
                    "module": "USER_MANAGEMENT",
                    "createdAt": "2026-01-11T04:19:31.472Z",
                    "updatedAt": "2026-01-11T04:19:31.472Z",
                    "deletedAt": null
                }
            },
            {
                "roleId": 2,
                "permissionId": 16,
                "createdAt": "2026-01-11T04:30:37.080Z",
                "deletedAt": null,
                "permission": {
                    "id": 16,
                    "key": "USER_SOFTDELETE",
                    "description": null,
                    "module": "USER_MANAGEMENT",
                    "createdAt": "2026-01-11T04:19:31.472Z",
                    "updatedAt": "2026-01-11T04:19:31.472Z",
                    "deletedAt": null
                }
            },
            {
                "roleId": 2,
                "permissionId": 17,
                "createdAt": "2026-01-11T04:30:37.080Z",
                "deletedAt": null,
                "permission": {
                    "id": 17,
                    "key": "USER_ASSIGN_ROLE",
                    "description": null,
                    "module": "USER_MANAGEMENT",
                    "createdAt": "2026-01-11T04:19:31.472Z",
                    "updatedAt": "2026-01-11T04:19:31.472Z",
                    "deletedAt": null
                }
            },
            {
                "roleId": 2,
                "permissionId": 18,
                "createdAt": "2026-01-11T04:30:37.080Z",
                "deletedAt": null,
                "permission": {
                    "id": 18,
                    "key": "SYSTEM_SETTINGS_MANAGE",
                    "description": null,
                    "module": "SYSTEM_SETTINGS",
                    "createdAt": "2026-01-11T04:19:31.472Z",
                    "updatedAt": "2026-01-11T04:19:31.472Z",
                    "deletedAt": null
                }
            }
        ]
    }
}
Not Found Response (404)

Returned when the role ID does not exist or the role has been soft-deleted.

{
  "success": false,
  "message": "Role not found"
}

⚠️ Notes

Soft-deleted roles are not retrievable

Permission records with deletedAt != null are never returned

The permissions array reflects the current role-permission mapping