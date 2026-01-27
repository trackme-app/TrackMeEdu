import crypto from 'crypto';
import { PasswordPolicy } from "@tme/shared-types";

/**
 * Default password policy (can be overridden per tenant)
 */
export const defaultPasswordPolicy: PasswordPolicy = {
    version: "default_v1",
    minLength: 12,
    maxLength: 18,
    minScore: 8,

    minUppercase: 1,
    minLowercase: 1,
    minNumbers: 1,
    minSpecial: 1,

    noTripleRepeat: true,
    minUniqueRatio: 0.7,

    charsets: {
        upper: 'ABCDEFGHIJKLMNOPQRSTUVWXYZ',
        lower: 'abcdefghijklmnopqrstuvwxyz',
        numbers: '0123456789',
        special: '!@#$%^&*()-_=+[]{}|;:,.<>?',
    },
};

/**
 * Scores a password out of 10
 */
export const scorePassword = (password: string) => {
    let score = 0;
    const length = password.length;

    // Length
    if (length >= 12) score += 2;
    if (length >= 14) score += 1;

    // Character presence
    if (/[A-Z]/.test(password)) score += 1;
    if (/[a-z]/.test(password)) score += 1;
    if (/\d/.test(password)) score += 1;
    if (/[^A-Za-z0-9]/.test(password)) score += 1;

    // Character distribution
    const counts = {
        upper: (password.match(/[A-Z]/g) || []).length,
        lower: (password.match(/[a-z]/g) || []).length,
        numbers: (password.match(/\d/g) || []).length,
        special: (password.match(/[^A-Za-z0-9]/g) || []).length,
    };

    if (Object.values(counts).every(c => c >= 3)) {
        score += 1;
    }

    // Repetition check
    if (!/(.)\1{2,}/.test(password)) {
        score += 1;
    }

    // Entropy heuristic
    const uniqueRatio = new Set(password).size / length;
    if (uniqueRatio > 0.7) score += 1;

    return Math.min(score, 10);
};

/**
 * Validates a password against a policy
 */
export const validatePassword = (password: string, policy: PasswordPolicy) => {
    const errors = [];

    if (typeof password !== 'string') {
        return { valid: false, score: 0, errors: ['Password must be a string'] };
    }

    const length = password.length;

    // Length
    if (length < policy.minLength) {
        errors.push(`Password must be at least ${policy.minLength} characters`);
    }
    if (length > policy.maxLength) {
        errors.push(`Password must be no more than ${policy.maxLength} characters`);
    }

    // Character counting
    const counts = {
        upper: 0,
        lower: 0,
        numbers: 0,
        special: 0,
    };

    for (const char of password) {
        if (policy.charsets.upper.includes(char)) counts.upper++;
        else if (policy.charsets.lower.includes(char)) counts.lower++;
        else if (policy.charsets.numbers.includes(char)) counts.numbers++;
        else if (policy.charsets.special.includes(char)) counts.special++;
    }

    // Minimum requirements
    if (counts.upper < policy.minUppercase) {
        errors.push(`At least ${policy.minUppercase} uppercase character(s) required`);
    }
    if (counts.lower < policy.minLowercase) {
        errors.push(`At least ${policy.minLowercase} lowercase character(s) required`);
    }
    if (counts.numbers < policy.minNumbers) {
        errors.push(`At least ${policy.minNumbers} number(s) required`);
    }
    if (counts.special < policy.minSpecial) {
        errors.push(`At least ${policy.minSpecial} special character(s) required`);
    }

    // Repetition
    if (policy.noTripleRepeat && /(.)\1{2,}/.test(password)) {
        errors.push('Password must not contain 3 or more repeated characters');
    }

    // Entropy
    const uniqueRatio = new Set(password).size / length;
    if (uniqueRatio < policy.minUniqueRatio) {
        errors.push('Password does not have enough character variety');
    }

    // Strength score
    const score = scorePassword(password);
    if (score < policy.minScore) {
        errors.push(`Password strength score ${score} is below minimum ${policy.minScore}`);
    }

    return {
        valid: errors.length === 0,
        score,
        errors,
        password: "" // Used to store generated password in call source
    };
};

/**
 * Generates a password that satisfies the given policy
 */
export const generatePassword = (policy: PasswordPolicy = defaultPasswordPolicy) => {
    let validation;

    do {
        const length = crypto.randomInt(
            policy.minLength,
            policy.maxLength + 1
        );

        const chars = [
            policy.charsets.upper[crypto.randomInt(policy.charsets.upper.length)],
            policy.charsets.lower[crypto.randomInt(policy.charsets.lower.length)],
            policy.charsets.numbers[crypto.randomInt(policy.charsets.numbers.length)],
            policy.charsets.special[crypto.randomInt(policy.charsets.special.length)],
        ];

        const allChars = Object.values(policy.charsets).join('');

        for (let i = chars.length; i < length; i++) {
            chars.push(allChars[crypto.randomInt(allChars.length)]);
        }

        // Fisher–Yates shuffle
        for (let i = chars.length - 1; i > 0; i--) {
            const j = crypto.randomInt(i + 1);
            [chars[i], chars[j]] = [chars[j], chars[i]];
        }

        const password = chars.join('');
        validation = validatePassword(password, policy);
        validation.password = password;

    } while (!validation.valid);

    return {
        password: validation.password,
        score: validation.score,
    };
};