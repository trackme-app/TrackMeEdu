import { PutCommand, GetCommand, UpdateCommand, DeleteCommand, ScanCommand } from "@aws-sdk/lib-dynamodb";
import { HTTPError, Course, ServiceResponse } from "@tme/shared-types";
import dbclient from "../clients/dynamodb.client";
import { v4 as uuidv4 } from "uuid";

const TABLE_NAME = "Courses";

export const getCourseById = async (tenantId: string, id: string): Promise<ServiceResponse<Course>> => {
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

export const getCourses = async (tenantId: string): Promise<ServiceResponse<Course[]>> => {
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

export const insertCourse = async (tenantId: string, course: Course): Promise<ServiceResponse<Course>> => {
    try {
        // Check if course with same name already exists
        const coursesResponse = await getCourses(tenantId);
        if (coursesResponse.success && coursesResponse.data) {
            if (coursesResponse.data.some((c: Course) => c.name.toLowerCase() === course.name.toLowerCase())) {
                return {
                    success: false,
                    statusCode: 409,
                    error: "Course with this name already exists"
                };
            }
        }

        // Generate ID and prepare item
        const id = uuidv4();
        const courseItem = {
            ...course,
            tenantId,
            id,
            createdAt: new Date().toISOString()
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
                tenantId,
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