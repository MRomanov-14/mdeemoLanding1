export const prerender = false; // Ensure this is SSR

import { getDb } from '../../lib/db';

export const POST = async ({ request }) => {
    try {
        const data = await request.json();
        const sql = getDb();

        const {
            firstName,
            lastName,
            companyName,
            email,
            phone,
            jobTitle,
            vacancyCount,
            location,
            description
        } = data;

        // Basic validation
        if (!firstName || !email || !companyName) {
            return new Response(JSON.stringify({ error: 'Faltan campos obligatorios' }), {
                status: 400,
                headers: { 'Content-Type': 'application/json' }
            });
        }

        await sql`
            INSERT INTO clicklandingpublic.companies (first_name, last_name, company_name, email, phone, job_title, vacancy_count, location, description)
            VALUES (${firstName}, ${lastName}, ${companyName}, ${email}, ${phone}, ${jobTitle}, ${vacancyCount}, ${location}, ${description})
        `;

        return new Response(JSON.stringify({ success: true, message: 'Solicitud guardada correctamente' }), {
            status: 200,
            headers: { 'Content-Type': 'application/json' }
        });

    } catch (error) {
        console.error('Database error:', error);
        return new Response(JSON.stringify({ error: 'Error interno del servidor', details: error.message }), {
            status: 500,
            headers: { 'Content-Type': 'application/json' }
        });
    }
};
