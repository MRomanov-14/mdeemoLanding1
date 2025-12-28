
import pg from 'pg';
import 'dotenv/config';

const { Client } = pg;

const client = new Client({
    connectionString: process.env.DATABASE_URL,
    ssl: { rejectUnauthorized: false }
});

async function check() {
    try {
        await client.connect();
        const res = await client.query('SELECT count(*) FROM companies');
        console.log('Verified companies table. Count:', res.rows[0].count);

        const res2 = await client.query('SELECT count(*) FROM candidates');
        console.log('Verified candidates table. Count:', res2.rows[0].count);
    } catch (e) {
        console.error('Verify failed:', e);
        process.exit(1);
    } finally {
        await client.end();
    }
}
check();
