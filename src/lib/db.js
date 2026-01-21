import postgres from 'postgres';

export const getDb = () => {
    const url = import.meta.env.DATABASE_URL || import.meta.env.STGLANDING_POSTGRES_URL;
    if (!url) {
        throw new Error('DATABASE_URL or STGLANDING_POSTGRES_URL is not defined');
    }
    return postgres(url);
};
