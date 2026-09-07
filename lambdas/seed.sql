CREATE TABLE tasks (
    id BIGSERIAL PRIMARY KEY,
    title VARCHAR(150) NOT NULL,
    description TEXT,
    status VARCHAR(20) NOT NULL DEFAULT 'pending',
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    CONSTRAINT valid_status
        CHECK (status IN ('pending', 'in_progress', 'completed'))
);

CREATE INDEX idx_tasks_created_at_id
ON tasks (created_at DESC, id DESC);

INSERT INTO tasks (
    title,
    description,
    status,
    created_at,
    updated_at
)
SELECT
    'Task ' || i,
    'Description for task number ' || i,
    CASE
        WHEN i % 3 = 0 THEN 'completed'
        WHEN i % 3 = 1 THEN 'pending'
    ELSE 'in_progress'
END,
    NOW() - (i || ' minutes')::INTERVAL,
    NOW() - (i || ' minutes')::INTERVAL
FROM generate_series(1, 10000) AS s(i);