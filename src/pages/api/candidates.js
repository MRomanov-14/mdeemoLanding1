export const prerender = false; // Ensure this is SSR

import { getDb } from '../../lib/db';

export const POST = async ({ request }) => {
    try {
        const data = await request.json();
        const sql = getDb();

        const {
            fullName,
            email,
            phone,
            areaInterest,
            experienceYears,
            // cvUrl handle file later
        } = data;

        if (!fullName || !email) {
            return new Response(JSON.stringify({ error: 'Faltan campos obligatorios' }), {
                status: 400,
                headers: { 'Content-Type': 'application/json' }
            });
        }

        await sql`
            INSERT INTO candidates (full_name, email, phone, area_interest, experience_years)
            VALUES (${fullName}, ${email}, ${phone}, ${areaInterest}, ${experienceYears})
        `;

        return new Response(JSON.stringify({ success: true, message: 'Postulación recibida' }), {
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
