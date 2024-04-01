CREATE VIEW logs_view AS
SELECT
    logs.id AS log_id,
    logs.timestamp,
    users.id AS user_id,
    users.role,
    users.email,
    users.first,
    users.last,
    users.discord,
    users.image
FROM logs
INNER JOIN users ON logs.user_id = users.id
ORDER BY logs.timestamp DESC