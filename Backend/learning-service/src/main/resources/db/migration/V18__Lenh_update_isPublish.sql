UPDATE topics   SET is_published = TRUE WHERE is_delete = 0;
UPDATE parts    SET is_published = TRUE WHERE is_delete = 0;
UPDATE sessions SET is_published = TRUE, has_draft = FALSE, version = 1 WHERE is_delete = 0;