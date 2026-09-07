import { pool } from './db.mjs';

const VALID_STATUSES = new Set([
    'pending',
    'in_progress',
    'completed'
]);

export const handler = async (event) => {
    try {
        const body = JSON.parse(event.body ?? '{}');

        const {
            title,
            description = null,
            status = 'pending'
        } = body;

        if (
            typeof title !== 'string' ||
            title.trim().length === 0 ||
            title.length > 150
        ) {
            return {
                statusCode: 400,
                body: JSON.stringify({
                    error: 'Invalid title'
                })
            };
        }

        if (!VALID_STATUSES.has(status)) {
            return {
                statusCode: 400,
                body: JSON.stringify({
                    error: 'Invalid status'
                })
            };
        }

        const result = await pool.query(
            `
            INSERT INTO tasks (
                title,
                description,
                status
            )
            VALUES ($1, $2, $3)
            RETURNING
                id,
                title,
                description,
                status,
                created_at,
                updated_at
            `,
            [
                title.trim(),
                description,
                status
            ]
        );

        return {
            statusCode: 201,
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(result.rows[0])
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