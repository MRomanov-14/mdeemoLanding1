import { neon } from '@neondatabase/serverless';

export const getDb = () => {
    if (!import.meta.env.DATABASE_URL) {
        throw new Error('DATABASE_URL is not defined');
    }
    return neon(import.meta.env.DATABASE_URL);
};
