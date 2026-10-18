
CREATE TABLE IF NOT EXISTS projects (
    id INTEGER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    title VARCHAR(150) NOT NULL,
    category VARCHAR(80) NOT NULL,
    description TEXT NOT NULL,
    tools TEXT NOT NULL,
    github_url TEXT,
    demo_url TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS skills (
    id INTEGER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    name VARCHAR(100) NOT NULL UNIQUE,
    category VARCHAR(100) NOT NULL,
    proficiency VARCHAR(50)
);

CREATE TABLE IF NOT EXISTS contact_messages (
    id INTEGER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(254) NOT NULL,
    subject VARCHAR(150) NOT NULL,
    message TEXT NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP
);

INSERT INTO skills (name, category, proficiency)
VALUES
    ('Python', 'Programming', 'Learning'),
    ('SQL', 'Database', 'Learning'),
    ('Statistics', 'Data Science', 'Learning'),
    ('Power BI', 'Visualization', 'Learning'),
    ('Machine Learning', 'AI and ML', 'Learning')
ON CONFLICT (name) DO NOTHING;
