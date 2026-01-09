import { PutCommand, GetCommand, UpdateCommand, DeleteCommand, ScanCommand } from "@aws-sdk/lib-dynamodb";
import { Course, ServiceResponse } from "@tme/shared-types";
import dbclient from "../clients/dynamodb.client";
import { v4 as uuidv4 } from "uuid";

const TABLE_NAME = "Courses";

export const getCourseById = async (tenantIdFromHeader: string, id: string): Promise<ServiceResponse<Course>> => {
    const params = {
        TableName: TABLE_NAME,
        Key: {
            tenantId: tenantIdFromHeader,
            id,
        },
    };
    try {
        const data = await dbclient.send(new GetCommand(params));
        if (!data.Item) {
            return {
                success: false,
                statusCode: 404,
                error: "Course not found"
            };
        }
        return {
            success: true,
            statusCode: 200,
            data: data.Item as Course
        };
    } catch (error) {
        console.error("Error fetching course by ID:", error);
        return {
            success: false,
            statusCode: 500,
            error: "Failed to fetch course"
        };
    }
};

export const getCourses = async (tenantIdFromHeader: string): Promise<ServiceResponse<Course[]>> => {
    const params = {
        TableName: TABLE_NAME,
        FilterExpression: "tenantId = :tenantId",
        ExpressionAttributeValues: {
            ":tenantId": tenantIdFromHeader,
        },
    };
    try {
        const data = await dbclient.send(new ScanCommand(params));
        return {
            success: true,
            statusCode: 200,
            data: (data.Items as Course[]) || []
        };
    } catch (error) {
        console.error("Error fetching courses:", error);
        return {
            success: false,
            statusCode: 500,
            error: "Failed to fetch courses"
        };
    }
};

export const insertCourse = async (tenantIdFromHeader: string, course: Course): Promise<ServiceResponse<Course>> => {
    try {
        // Check if course with same name already exists
        const coursesResponse = await getCourses(tenantIdFromHeader);
        if (coursesResponse.success && coursesResponse.data) {
            if (coursesResponse.data.some((c: Course) => c.course_name.toLowerCase() === course.course_name.toLowerCase())) {
                return {
                    success: false,
                    statusCode: 409,
                    error: "Course with this name already exists"
                };
            }
        }

        // Generate ID and prepare item
        const id = uuidv4();
        // Construct item explicitly to ensure tenantId from header is used
        const courseItem = {
            course_name: course.course_name,
            description: course.description,
            tenantId: tenantIdFromHeader,
            id,
            createdAt: new Date().toISOString(),
            modifiedAt: new Date().toISOString()
        };

        // Insert into database
        const putParams = {
            TableName: TABLE_NAME,
            Item: courseItem,
        };

        await dbclient.send(new PutCommand(putParams));

        // Retrieve the inserted course to confirm
        const getParams = {
            TableName: TABLE_NAME,
            Key: {
                tenantId: tenantIdFromHeader,
                id,
            },
        };

        const data = await dbclient.send(new GetCommand(getParams));

        if (!data.Item) {
            return {
                success: false,
                statusCode: 500,
                error: "Failed to retrieve created course"
            };
        }

        return {
            success: true,
            statusCode: 201,
            data: data.Item as Course
        };
    } catch (error) {
        console.error("Error inserting course:", error);
        return {
            success: false,
            statusCode: 500,
            error: "Internal server error while creating course"
        };
    }
};

export const updateCourse = async (tenantIdFromHeader: string, id: string, course: Partial<Course>): Promise<ServiceResponse<Course>> => {
    try {
        const getParams = {
            TableName: TABLE_NAME,
            Key: {
                tenantId: tenantIdFromHeader,
                id,
            },
        };

        const data = await dbclient.send(new GetCommand(getParams));

        if (!data.Item) {
            return {
                success: false,
                statusCode: 404,
                error: "Course not found"
            };
        }

        const updateFields: string[] = [];
        const expressionAttributeValues: any = {};
        const expressionAttributeNames: any = {};

        // Only update fields that are provided and NOT keys
        const fieldsToUpdate = ['course_name', 'description'];

        fieldsToUpdate.forEach(field => {
            const value = (course as any)[field];
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
                tenantId: tenantIdFromHeader,
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
                error: "Failed to retrieve updated course"
            };
        }

        return {
            success: true,
            statusCode: 200,
            data: updatedData.Item as Course
        };
    } catch (error: any) {
        console.error("Error updating course:", error);
        return {
            success: false,
            statusCode: 500,
            error: error?.message || "Internal server error while updating course"
        };
    }
};

export const deleteCourse = async (tenantIdFromHeader: string, id: string): Promise<ServiceResponse<null>> => {
    try {
        const deleteParams = {
            TableName: TABLE_NAME,
            Key: {
                tenantId: tenantIdFromHeader,
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
        console.error("Error deleting course:", error);
        return {
            success: false,
            statusCode: 500,
            error: "Internal server error while deleting course"
        };
    }
};