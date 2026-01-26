export interface PasswordPolicy {
    version: string;
    minLength: number;
    maxLength: number;
    minScore: number;
    minUppercase: number;
    minLowercase: number;
    minNumbers: number;
    minSpecial: number;
    noTripleRepeat: boolean;
    minUniqueRatio: number;
    charsets: {
        upper: string;
        lower: string;
        numbers: string;
        special: string;
    };
}