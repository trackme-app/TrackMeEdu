import { PutCommand, GetCommand, UpdateCommand, DeleteCommand, ScanCommand } from "@aws-sdk/lib-dynamodb";
import { Tenant, TenantSettings, ServiceResponse, ColourScheme } from "@tme/shared-types";
import dbclient from "../clients/dynamodb.client";
import { v4 as uuidv4 } from "uuid";

const TABLE_NAME = "Tenants";

export const getTenantById = async (id: string): Promise<ServiceResponse<Tenant>> => {
    const params = {
        TableName: TABLE_NAME,
        Key: {
            id,
        },
    }

    try {
        const data = await dbclient.send(new GetCommand(params));
        if (!data.Item) {
            return {
                success: false,
                statusCode: 404,
                error: "Tenant not found"
            };
        }
        return {
            success: true,
            statusCode: 200,
            data: data.Item as Tenant
        };
    } catch (error) {
        console.error("Error fetching tenant by ID:", error);
        return {
            success: false,
            statusCode: 500,
            error: "Failed to fetch tenant"
        };
    }
}

export const getTenantByName = async (tenant_name: string): Promise<ServiceResponse<Tenant>> => {
    const params = {
        TableName: TABLE_NAME,
        FilterExpression: "tenant_name = :tenant_name",
        ExpressionAttributeValues: {
            ":tenant_name": tenant_name,
        },
    }

    try {
        const data = await dbclient.send(new ScanCommand(params));
        if (!data.Items || data.Items.length === 0) {
            return {
                success: false,
                statusCode: 404,
                error: "Tenant not found"
            };
        }
        return {
            success: true,
            statusCode: 200,
            data: data.Items[0] as Tenant
        };
    } catch (error) {
        console.error("Error fetching tenant by name:", error);
        return {
            success: false,
            statusCode: 500,
            error: "Failed to fetch tenant"
        };
    }
}

export const getTenantSettings = async (id: string): Promise<ServiceResponse<TenantSettings>> => {
    const params = {
        TableName: TABLE_NAME,
        Key: {
            id,
        },
    }

    try {
        const data = await dbclient.send(new GetCommand(params));
        if (!data.Item) {
            return {
                success: false,
                statusCode: 404,
                error: "Tenant settings not found"
            };
        }
        return {
            success: true,
            statusCode: 200,
            data: data.Item?.tenant_settings as TenantSettings
        };
    } catch (error) {
        console.error("Error fetching tenant settings by ID:", error);
        return {
            success: false,
            statusCode: 500,
            error: "Failed to fetch tenant settings"
        };
    }
}

export const getTenantColourScheme = async (id: string): Promise<ServiceResponse<ColourScheme>> => {
    const params = {
        TableName: TABLE_NAME,
        Key: {
            id,
        },
    }

    try {
        const data = await dbclient.send(new GetCommand(params));
        if (!data.Item) {
            return {
                success: false,
                statusCode: 404,
                error: "Tenant colour scheme not found"
            };
        }
        return {
            success: true,
            statusCode: 200,
            data: data.Item?.tenant_settings?.colour_scheme as ColourScheme
        };
    } catch (error) {
        console.error("Error fetching tenant colour scheme by ID:", error);
        return {
            success: false,
            statusCode: 500,
            error: "Failed to fetch tenant colour scheme"
        };
    }
}

export const getTenants = async (): Promise<ServiceResponse<Tenant[]>> => {
    const params = {
        TableName: TABLE_NAME,
    };
    try {
        const data = await dbclient.send(new ScanCommand(params));
        return {
            success: true,
            statusCode: 200,
            data: (data.Items as Tenant[]) || []
        };
    } catch (error) {
        console.error("Error fetching tenants:", error);
        return {
            success: false,
            statusCode: 500,
            error: "Failed to fetch tenants"
        };
    }
}

export const insertTenant = async (tenant: Tenant): Promise<ServiceResponse<Tenant>> => {
    try {
        // Check if tenant with same name already exists
        const tenantsResponse = await getTenants();
        if (tenantsResponse.success && tenantsResponse.data) {
            if (tenantsResponse.data.some((t: Tenant) => t.tenant_name.toLowerCase() === tenant.tenant_name.toLowerCase())) {
                return {
                    success: false,
                    statusCode: 409,
                    error: "Tenant with this name already exists"
                };
            }
        }

        const id = uuidv4();
        const tenantObj = {
            ...tenant,
            id,
            createdAt: new Date().toISOString(),
            modifiedAt: new Date().toISOString(),
        }

        const params = {
            TableName: TABLE_NAME,
            Item: tenantObj,
        };
        await dbclient.send(new PutCommand(params));

        // Retrieve the inserted tenant to confirm
        const getParams = {
            TableName: TABLE_NAME,
            Key: {
                id,
            },
        };

        const data = await dbclient.send(new GetCommand(getParams));

        if (!data.Item) {
            return {
                success: false,
                statusCode: 500,
                error: "Failed to retrieve created tenant"
            };
        }

        return {
            success: true,
            statusCode: 201,
            data: data.Item as Tenant
        };
    } catch (error) {
        console.error("Error inserting tenant:", error);
        return {
            success: false,
            statusCode: 500,
            error: "Failed to insert tenant"
        };
    }
}

export const updateTenant = async (id: string, tenant: Partial<Tenant>): Promise<ServiceResponse<Tenant>> => {
    try {
        const getParams = {
            TableName: TABLE_NAME,
            Key: {
                id,
            },
        };

        const data = await dbclient.send(new GetCommand(getParams));

        if (!data.Item) {
            return {
                success: false,
                statusCode: 404,
                error: "Tenant not found"
            };
        }

        if (tenant.tenant_name && tenant.tenant_name !== data.Item.tenant_name) {
            const checkParams = {
                TableName: TABLE_NAME,
                FilterExpression: "tenant_name = :tenant_name",
                ExpressionAttributeValues: {
                    ":tenant_name": tenant.tenant_name,
                },
            };

            const checkResult = await dbclient.send(new ScanCommand(checkParams));

            if (checkResult.Items && checkResult.Items.length > 0) {
                return {
                    success: false,
                    statusCode: 409,
                    error: "Tenant name already in use"
                };
            }
        }

        const updateFields: string[] = [];
        const expressionAttributeValues: any = {};
        const expressionAttributeNames: any = {};

        // Only update fields that are provided and NOT keys
        const fieldsToUpdate = ['tenant_name', 'tenant_plan', 'tenant_settings', 'company_name', 'primary_owner_email', 'billing_contact_email', 'tenant_description', 'tenant_status', 'tenant_settings'];

        fieldsToUpdate.forEach(field => {
            const value = (tenant as any)[field];
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
                error: "Failed to retrieve updated tenant"
            };
        }

        return {
            success: true,
            statusCode: 200,
            data: updatedData.Item as Tenant
        };
    } catch (error: any) {
        console.error("Error updating tenant:", error);
        return {
            success: false,
            statusCode: 500,
            error: error?.message || "Internal server error while updating tenant"
        };
    }
};

export const deleteTenant = async (id: string): Promise<ServiceResponse<null>> => {
    try {
        const params = {
            TableName: TABLE_NAME,
            Key: {
                id,
            },
        };
        await dbclient.send(new DeleteCommand(params));
        return {
            success: true,
            statusCode: 200,
            data: null
        };
    } catch (error) {
        console.error("Error deleting tenant:", error);
        return {
            success: false,
            statusCode: 500,
            error: "Failed to delete tenant"
        };
    }
}