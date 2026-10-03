import * as bcrypt from 'bcrypt';

export class PasswordUtil {
    private static readonly SALT_ROUNDS = 10;

    /**
     * Hash a plain text password
     * @param password Plain text password to hash
     * @returns Hashed password
     */
    static async hash(password: string): Promise<string> {
        return bcrypt.hash(password, this.SALT_ROUNDS);
    }

    /**
     * Compare plain text password with hashed password
     * @param password Plain text password to verify
     * @param hashedPassword Hashed password from database
     * @returns True if passwords match, false otherwise
     */
    static async compare(password: string, hashedPassword: string): Promise<boolean> {
        return bcrypt.compare(password, hashedPassword);
    }

    /**
     * Validate password strength
     * @param password Password to validate
     * @returns Object with validation result and error message if invalid
     */
    static validateStrength(password: string): { isValid: boolean; message?: string } {
        if (password.length < 8) {
            return { isValid: false, message: 'Password must be at least 8 characters long' };
        }

        if (!/[A-Z]/.test(password)) {
            return { isValid: false, message: 'Password must contain at least one uppercase letter' };
        }

        if (!/[a-z]/.test(password)) {
            return { isValid: false, message: 'Password must contain at least one lowercase letter' };
        }

        if (!/[0-9]/.test(password)) {
            return { isValid: false, message: 'Password must contain at least one number' };
        }

        if (!/[!@#$%^&*]/.test(password)) {
            return { isValid: false, message: 'Password must contain at least one special character (!@#$%^&*)' };
        }

        return { isValid: true };
    }
}
