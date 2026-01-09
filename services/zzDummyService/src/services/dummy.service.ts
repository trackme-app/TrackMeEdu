import { ServiceResponse } from "@tme/shared-types";

export interface DummyUser {
    id: number;
    name: string;
    email: string;
    role: string;
}

export const getDummyUser = async (): Promise<ServiceResponse<DummyUser>> => {
    try {
        return {
            success: true,
            statusCode: 200,
            data: {
                id: 1,
                name: 'Dummy User',
                email: 'dummy@dummy.com',
                role: 'dummy'
            }
        };
    } catch (error) {
        return {
            success: false,
            statusCode: 500,
            error: "Failed to fetch dummy user"
        };
    }
};

export const getHealth = async (): Promise<ServiceResponse<{ status: string }>> => {
    return {
        success: true,
        statusCode: 200,
        data: { status: 'ok' }
    };
};
