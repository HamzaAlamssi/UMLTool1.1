CREATE TABLE IF NOT EXISTS templates (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    type VARCHAR(50) NOT NULL,
    diagram_json TEXT NOT NULL
);

-- Example insert (add more as needed)
INSERT INTO templates (name, type, diagram_json) VALUES
('Blank Class Diagram', 'customized', '{"classes":[],"relationships":[]}'),
('Singleton Pattern', 'design pattern', '{"classes":[{"name":"Singleton","attributes":[],"methods":[{"name":"getInstance"}]}],"relationships":[]}');
