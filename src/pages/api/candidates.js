export const prerender = false; // Ensure this is SSR

import { getDb } from '../../lib/db';

export const POST = async ({ request }) => {
    try {
        const data = await request.json();
        const sql = getDb();

        const {
            fullName,
            cedula,
            email,
            phone,
            areaInterest,
            experienceYears,
            cvUrl 
        } = data;

        if (!fullName || !email || !cedula) {
            return new Response(JSON.stringify({ error: 'Faltan campos obligatorios' }), {
                status: 400,
                headers: { 'Content-Type': 'application/json' }
            });
        }

        await sql`
            INSERT INTO clicklandingpublic.candidates (full_name, cedula, email, phone, area_interest, experience_years, cv_url)
            VALUES (${fullName}, ${cedula}, ${email}, ${phone}, ${areaInterest}, ${experienceYears}, ${cvUrl})
        `;

        return new Response(JSON.stringify({ success: true, message: 'Postulación recibida' }), {
            status: 200,
            headers: { 'Content-Type': 'application/json' }
        });

    } catch (error) {
        console.error('Database error:', error);
        
        // Handle unique constraint violation (duplicate application)
        if (error.code === '23505') {
             return new Response(JSON.stringify({ error: 'Duplicate', message: 'Ya tienes una postulación activa para este cargo.' }), {
                status: 409,
                headers: { 'Content-Type': 'application/json' }
            });
        }

        return new Response(JSON.stringify({ error: 'Error interno del servidor', details: error.message }), {
            status: 500,
            headers: { 'Content-Type': 'application/json' }
        });
    }
};

export const GET = async ({ request }) => {
    try {
        const url = new URL(request.url);
        const cedula = url.searchParams.get('cedula');

        if (!cedula) {
            return new Response(JSON.stringify({ error: 'Cedula requerida' }), {
                status: 400,
                headers: { 'Content-Type': 'application/json' }
            });
        }

        const sql = getDb();
        const results = await sql`
            SELECT area_interest 
            FROM clicklandingpublic.candidates 
            WHERE cedula = ${cedula}
        `;

        // Return just the array of strings
        const areas = results.map(r => r.area_interest);

        return new Response(JSON.stringify({ areas }), {
            status: 200,
            headers: { 'Content-Type': 'application/json' }
        });

    } catch (error) {
        console.error('Database error:', error);
        return new Response(JSON.stringify({ error: 'Error al consultar historial' }), {
            status: 500,
            headers: { 'Content-Type': 'application/json' }
        });
    }
};
