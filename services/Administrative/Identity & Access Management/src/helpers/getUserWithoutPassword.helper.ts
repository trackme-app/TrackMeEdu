import { User } from "@tme/shared-types";

export function getUsersWithoutPassword(users: User[]): Omit<User, "password">[] {
    return users.map(user => getUserWithoutPassword(user));
}

export function getUserWithoutPassword(user: User): Omit<User, "password"> {
    const { password, ...rest } = user;
    return rest;
}