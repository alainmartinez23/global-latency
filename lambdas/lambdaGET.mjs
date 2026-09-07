import { pool } from './db.mjs';

export const handler = async (event) => {
    try {
        const params = event.queryStringParameters ?? {};

        const page = Math.max(
            Number.parseInt(params.page ?? '1', 10),
            1
        );

        const requestedLimit = Number.parseInt(
            params.limit ?? '20',
            10
        );

        const limit = Math.min(
            Math.max(requestedLimit, 1),
            100
        );

        const offset = (page - 1) * limit;

        const result = await pool.query(
            `
            SELECT
                id,
                title,
                description,
                status,
                created_at,
                updated_at
            FROM tasks
            ORDER BY created_at DESC, id DESC
            LIMIT $1
            OFFSET $2
            `,
            [limit, offset]
        );

        return {
            statusCode: 200,
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                page,
                limit,
                count: result.rows.length,
                tasks: result.rows
            })
        };

    } catch (error) {
        console.error(error);

        return {
            statusCode: 500,
            body: JSON.stringify({
                error: 'Internal server error'
            })
        };
    }
};