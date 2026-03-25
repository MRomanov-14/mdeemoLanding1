export const prerender = false;

export const GET = async () => {
    return new Response(JSON.stringify({
        DATABASE_URL: import.meta.env.DATABASE_URL,
        PUBLIC_SUPABASE_URL: import.meta.env.PUBLIC_SUPABASE_URL,
        PUBLIC_SUPABASE_ANON_KEY: import.meta.env.PUBLIC_SUPABASE_ANON_KEY
    }), {
        status: 200,
        headers: {
            'Content-Type': 'application/json'
        }
    });
};
