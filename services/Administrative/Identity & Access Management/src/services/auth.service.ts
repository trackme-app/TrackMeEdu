import { PutCommand, GetCommand, UpdateCommand, DeleteCommand, ScanCommand } from "@aws-sdk/lib-dynamodb";
import { User, ServiceResponse } from "@tme/shared-types";
import { getUserWithoutPassword } from "../helpers";
import dbclient from "../clients/dynamodb.client";
import { v4 as uuidv4 } from "uuid";
import { getUsers } from "./users.service";

const TABLE_NAME = "Users";

export const registerUser = async (tenantId: string, user: User): Promise<ServiceResponse<User>> => {
    try {
        const username = user.username || user.emailAddress;
        // Check if user with same name already exists
        const usersResponse = await getUsers(tenantId);
        if (usersResponse.success && usersResponse.data) {
            if (usersResponse.data.some((u: User) => String(u.username).toLowerCase() === username.toLowerCase())) {
                return {
                    success: false,
                    statusCode: 409,
                    error: "User with this username already exists"
                };
            }
        }

        // Generate ID and prepare item
        const id = uuidv4();
        // Construct item explicitly to ensure tenantId from header is used
        const userItem = {
            ...user,
            username,
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