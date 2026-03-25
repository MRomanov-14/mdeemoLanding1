import postgres from 'postgres';

let sql;

export const getDb = () => {
    if (sql) return sql;
    
    const url = import.meta.env.DATABASE_URL || import.meta.env.STGLANDING_POSTGRES_URL;
    if (!url) {
        throw new Error('DATABASE_URL or STGLANDING_POSTGRES_URL is not defined');
    }
    
    // In serverless environments, avoid creating a new pool for every request
    sql = postgres(url, { max: 1 });
    return sql;
};
