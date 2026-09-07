import { pool } from './db.mjs';

export const handler = async (event) => {
    try {
        const id = Number.parseInt(
            event.pathParameters?.id,
            10
        );

        if (!Number.isInteger(id) || id <= 0) {
            return {
                statusCode: 400,
                body: JSON.stringify({
                    error: 'Invalid task id'
                })
            };
        }

        const result = await pool.query(
            `
            DELETE FROM tasks
            WHERE id = $1
            RETURNING id
            `,
            [id]
        );

        if (result.rowCount === 0) {
            return {
                statusCode: 404,
                body: JSON.stringify({
                    error: 'Task not found'
                })
            };
        }

        return {
            statusCode: 200,
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                deleted: true,
                id
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