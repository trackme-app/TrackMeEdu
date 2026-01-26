import { PutCommand, GetCommand, UpdateCommand, DeleteCommand, ScanCommand } from "@aws-sdk/lib-dynamodb";
import { User, ServiceResponse } from "@tme/shared-types";
import { getUserWithoutPassword } from "../helpers";
import dbclient from "../clients/dynamodb.client";
import { v4 as uuidv4 } from "uuid";
import { getUsers } from "./users.service";
import argon2 from 'argon2';
import crypto from 'crypto';

const TABLE_NAME = "Users";

function generatePassword(length = 16) {
    const charset =
        'ABCDEFGHIJKLMNOPQRSTUVWXYZ' +
        'abcdefghijklmnopqrstuvwxyz' +
        '0123456789' +
        '!@#$%^&*()-_=+[]{};:,.<>?';

    const charsetLength = charset.length;
    const randomBytes = crypto.randomBytes(length);
    let password = '';

    for (let i = 0; i < length; i++) {
        password += charset[randomBytes[i] % charsetLength];
    }

    return password;
}

export const registerUser = async (tenantId: string, user: User): Promise<ServiceResponse<User>> => {
    try {
        if (!user.password) {
            user.password = generatePassword();
        }
        const hashedPassword = await argon2.hash(String(user.password), {
            type: argon2.argon2id,
            memoryCost: 2 ** 16,
            timeCost: 3,
            parallelism: 1
        });

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
            password: hashedPassword,
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