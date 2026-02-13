Create a new role and assign permissions.

ℹ️ Important Behavior

Automatic Permission Seeding
If the permission table is empty, the system will automatically insert ALL predefined permission enums into the database before creating the role.

Default Permission Assignment

If permissions is omitted or an empty array, the role will be assigned ALL available permissions.

If permissions is provided with specific keys, only those permissions will be assigned.

Endpoint

POST /api/roles

Sample Request Body
Assign Specific Permissions
{
  "name": "Admin",
  "description": "System administrator role",
  "permissions": [
    "DASHBOARD_VIEW",
    "USER_CREATE",
    "USER_UPDATE",
    "ROLE_CREATE",
    "ROLE_UPDATE",
    "SYSTEM_SETTINGS_MANAGE"
  ]
}

Assign ALL Permissions
{
  "name": "Super Admin",
  "description": "Full system access",
  "permissions": []
}


✅ If permissions is empty or not provided, all permissions from the system enums are assigned automatically.

Sample Success Response (201)
{
    "success": true,
    "data": {
        "id": 4,
        "name": "No permision45",
        "description": "Full system access",
        "createdAt": "2026-01-11T04:31:44.760Z",
        "updatedAt": "2026-01-11T04:31:44.760Z",
        "deletedAt": null,
        "permissions": [
            {
                "roleId": 4,
                "permissionId": 1,
                "createdAt": "2026-01-11T04:31:44.760Z",
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
                "roleId": 4,
                "permissionId": 2,
                "createdAt": "2026-01-11T04:31:44.760Z",
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
                "roleId": 4,
                "permissionId": 3,
                "createdAt": "2026-01-11T04:31:44.760Z",
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
                "roleId": 4,
                "permissionId": 4,
                "createdAt": "2026-01-11T04:31:44.760Z",
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
                "roleId": 4,
                "permissionId": 5,
                "createdAt": "2026-01-11T04:31:44.760Z",
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
                "roleId": 4,
                "permissionId": 6,
                "createdAt": "2026-01-11T04:31:44.760Z",
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
                "roleId": 4,
                "permissionId": 7,
                "createdAt": "2026-01-11T04:31:44.760Z",
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
                "roleId": 4,
                "permissionId": 8,
                "createdAt": "2026-01-11T04:31:44.760Z",
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
                "roleId": 4,
                "permissionId": 9,
                "createdAt": "2026-01-11T04:31:44.760Z",
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
                "roleId": 4,
                "permissionId": 10,
                "createdAt": "2026-01-11T04:31:44.760Z",
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
                "roleId": 4,
                "permissionId": 11,
                "createdAt": "2026-01-11T04:31:44.760Z",
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
                "roleId": 4,
                "permissionId": 12,
                "createdAt": "2026-01-11T04:31:44.760Z",
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
                "roleId": 4,
                "permissionId": 13,
                "createdAt": "2026-01-11T04:31:44.760Z",
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
                "roleId": 4,
                "permissionId": 14,
                "createdAt": "2026-01-11T04:31:44.760Z",
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
                "roleId": 4,
                "permissionId": 15,
                "createdAt": "2026-01-11T04:31:44.760Z",
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
                "roleId": 4,
                "permissionId": 16,
                "createdAt": "2026-01-11T04:31:44.760Z",
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
                "roleId": 4,
                "permissionId": 17,
                "createdAt": "2026-01-11T04:31:44.760Z",
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
                "roleId": 4,
                "permissionId": 18,
                "createdAt": "2026-01-11T04:31:44.760Z",
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
✅ Notes for Developers

Permission keys must exactly match the values defined in permissions.constant.js.

Invalid or unknown permission keys will be ignored by the system.

Soft-deleted permissions (deletedAt != null) are never assigned.