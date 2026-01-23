import type { User } from "@tme/shared-types";

export const userService = {
    fetchUsers: async (): Promise<User[]> => {
        const response = await fetch('/api/v1/user', {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'x-tenant-id': 'dc1dcb5e-11f9-4074-be2b-91f73e843cc5',
            },
        });

        if (!response.ok) {
            throw new Error(`Failed to fetch users: ${response.statusText}`);
        }

        return response.json();
    },
};
