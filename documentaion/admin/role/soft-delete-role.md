Marks a role as deleted without permanently removing it from the database.

Endpoint

DELETE /api/roles/:id

Path Parameters
Name	Type	Required	Description
id	number	✅ Yes	Role ID
Behavior

Sets deletedAt to the current timestamp

The role is excluded from:

Fetch all roles

Get role by ID

Get role permissions

Existing role–permission relationships are preserved for audit/history

The operation is idempotent
(Deleting an already deleted role will not cause an error)

Sample Success Response (200)
{
  "success": true,
  "message": "Role deleted successfully"
}

Not Found Response (404)

Returned when the role ID does not exist.

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