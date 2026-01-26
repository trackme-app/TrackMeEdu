import { PutCommand, GetCommand, UpdateCommand, DeleteCommand, ScanCommand } from "@aws-sdk/lib-dynamodb";
import { User, ServiceResponse } from "@tme/shared-types";
import { getUsersWithoutPassword, getUserWithoutPassword } from "../helpers";
import dbclient from "../clients/dynamodb.client";
import { v4 as uuidv4 } from "uuid";

const TABLE_NAME = "Users";

export const getUserById = async (tenantId: string, id: string): Promise<ServiceResponse<User>> => {
    const params = {
        TableName: TABLE_NAME,
        Key: {
            tenantId,
            id,
        },
    };
    try {
        const data = await dbclient.send(new GetCommand(params));
        if (!data.Item) {
            return {
                success: false,
                statusCode: 404,
                error: "User not found"
            };
        }
        return {
            success: true,
            statusCode: 200,
            data: getUserWithoutPassword(data.Item as User)
        };
    } catch (error) {
        return {
            success: false,
            statusCode: 500,
            error: "Failed to fetch user"
        };
    }
};

export const getUsers = async (tenantId: string): Promise<ServiceResponse<User[]>> => {
    const params = {
        TableName: TABLE_NAME,
        FilterExpression: "tenantId = :tenantId",
        ExpressionAttributeValues: {
            ":tenantId": tenantId,
        },
    };
    try {
        const data = await dbclient.send(new ScanCommand(params));
        return {
            success: true,
            statusCode: 200,
            data: getUsersWithoutPassword(data.Items as User[]) || []
        };
    } catch (error) {
        return {
            success: false,
            statusCode: 500,
            error: "Failed to fetch users"
        };
    }
};

export const insertUser = async (tenantId: string, user: User): Promise<ServiceResponse<User>> => {
    try {
        // Check if user with same name already exists
        const usersResponse = await getUsers(tenantId);
        if (usersResponse.success && usersResponse.data) {
            if (usersResponse.data.some((u: User) => u.emailAddress.toLowerCase() === user.emailAddress.toLowerCase())) {
                return {
                    success: false,
                    statusCode: 409,
                    error: "User with this email already exists"
                };
            }
        }

        // Generate ID and prepare item
        const id = uuidv4();
        // Construct item explicitly to ensure tenantId from header is used
        const userItem = {
            ...user,
            tenantId,
            id,
            createdAt: new Date().toISOString(),
            modifiedAt: new Date().toISOString()
        };

        // Insert into database
        const putParams = {
            TableName: TABLE_NAME,
            Item: userItem,
        };

        await dbclient.send(new PutCommand(putParams));

        // Retrieve the inserted course to confirm
        const getParams = {
            TableName: TABLE_NAME,
            Key: {
                tenantId,
                id,
            },
        };

        const data = await dbclient.send(new GetCommand(getParams));

        if (!data.Item) {
            return {
                success: false,
                statusCode: 500,
                error: "Failed to retrieve created user"
            };
        }

        return {
            success: true,
            statusCode: 201,
            data: getUserWithoutPassword(data.Item as User)
        };
    } catch (error) {
        return {
            success: false,
            statusCode: 500,
            error: "Internal server error while creating user"
        };
    }
};

export const updateUser = async (tenantId: string, id: string, user: Partial<User>): Promise<ServiceResponse<User>> => {
    try {
        const getParams = {
            TableName: TABLE_NAME,
            Key: {
                tenantId,
                id,
            },
        };

        const data = await dbclient.send(new GetCommand(getParams));

        if (!data.Item) {
            return {
                success: false,
                statusCode: 404,
                error: "User not found"
            };
        }

        const updateFields: string[] = [];
        const expressionAttributeValues: any = {};
        const expressionAttributeNames: any = {};

        // Only update fields that are provided and NOT keys
        const fieldsToUpdate = ['firstName', 'lastName', 'emailAddress', 'dateOfBirth', 'phoneNumber', 'settings', 'oauth', 'status', 'lastLoginAt', 'emailVerifiedAt', 'phoneNumberVerifiedAt', 'termsAcceptedAt', 'privacyPolicyAcceptedAt', 'metaData'];

        fieldsToUpdate.forEach(field => {
            const value = (user as any)[field];
            // Explicitly check for undefined to allow null or empty strings if intended
            if (value !== undefined) {
                updateFields.push(`#${field} = :${field}`);
                expressionAttributeValues[`:${field}`] = value;
                expressionAttributeNames[`#${field}`] = field;
            }
        });

        // Always update modifiedAt
        updateFields.push("#modifiedAt = :modifiedAt");
        expressionAttributeValues[":modifiedAt"] = new Date().toISOString();
        expressionAttributeNames["#modifiedAt"] = "modifiedAt";

        const updateParams = {
            TableName: TABLE_NAME,
            Key: {
                tenantId,
                id,
            },
            UpdateExpression: `SET ${updateFields.join(", ")}`,
            ExpressionAttributeValues: expressionAttributeValues,
            ExpressionAttributeNames: expressionAttributeNames,
        };

        console.log("DynamoDB Update Params:", JSON.stringify(updateParams, null, 2));

        await dbclient.send(new UpdateCommand(updateParams));

        const updatedData = await dbclient.send(new GetCommand(getParams));

        if (!updatedData.Item) {
            return {
                success: false,
                statusCode: 500,
                error: "Failed to retrieve updated user"
            };
        }

        return {
            success: true,
            statusCode: 200,
            data: updatedData.Item as User
        };
    } catch (error: any) {
        return {
            success: false,
            statusCode: 500,
            error: error?.message || "Internal server error while updating user"
        };
    }
};

export const softDeleteUser = async (tenantId: string, id: string): Promise<ServiceResponse<null>> => {
    try {
        const getParams = {
            TableName: TABLE_NAME,
            Key: {
                tenantId,
                id,
            },
        };

        const data = await dbclient.send(new GetCommand(getParams));

        if (!data.Item) {
            return {
                success: false,
                statusCode: 404,
                error: "User not found"
            };
        }

        const deleteParams = {
            TableName: TABLE_NAME,
            Key: {
                tenantId,
                id,
            },
        };

        const updateFields: string[] = [];
        const expressionAttributeValues: any = {};
        const expressionAttributeNames: any = {};

        const fieldsToUpdate = ['status', 'deletedAt', 'modifiedAt'];

        fieldsToUpdate.forEach(field => {
            const value = ({
                status: "deleted",
                deletedAt: new Date().toISOString(),
                modifiedAt: new Date().toISOString()
            })[field];
            // Explicitly check for undefined to allow null or empty strings if intended
            if (value !== undefined) {
                updateFields.push(`#${field} = :${field}`);
                expressionAttributeValues[`:${field}`] = value;
                expressionAttributeNames[`#${field}`] = field;
            }
        });

        await dbclient.send(new UpdateCommand(deleteParams));

        return {
            success: true,
            statusCode: 200,
            data: null
        };
    } catch (error) {
        return {
            success: false,
            statusCode: 500,
            error: "Internal server error while soft deleting user"
        };
    }
};

export const hardDeleteUser = async (tenantId: string, id: string): Promise<ServiceResponse<null>> => {
    try {
        const deleteParams = {
            TableName: TABLE_NAME,
            Key: {
                tenantId,
                id,
            },
        };

        await dbclient.send(new DeleteCommand(deleteParams));

        return {
            success: true,
            statusCode: 200,
            data: null
        };
    } catch (error) {
        return {
            success: false,
            statusCode: 500,
            error: "Internal server error while hard deleting user"
        };
    }
};