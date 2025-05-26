-- Create users table
CREATE TABLE users (
  id SERIAL PRIMARY KEY,
  email VARCHAR(255) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create freelancers table
CREATE TABLE freelancers (
  id SERIAL PRIMARY KEY,
  user_id INTEGER REFERENCES users(id),
  name VARCHAR(255) NOT NULL,
  title VARCHAR(255),
  rating DECIMAL(3,2) DEFAULT 0,
  location VARCHAR(255),
  education VARCHAR(255),
  description TEXT,
  about_me TEXT,
  hourly_rate DECIMAL(10,2),
  package_rate DECIMAL(10,2),
  profile_image VARCHAR(255),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create freelancer_skills table
CREATE TABLE freelancer_skills (
  id SERIAL PRIMARY KEY,
  freelancer_id INTEGER REFERENCES freelancers(id),
  skill VARCHAR(255) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create freelancer_languages table
CREATE TABLE freelancer_languages (
  id SERIAL PRIMARY KEY,
  freelancer_id INTEGER REFERENCES freelancers(id),
  language VARCHAR(255) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create portfolio_images table
CREATE TABLE portfolio_images (
  id SERIAL PRIMARY KEY,
  freelancer_id INTEGER REFERENCES freelancers(id),
  image_url VARCHAR(255) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create companies table
CREATE TABLE companies (
  id SERIAL PRIMARY KEY,
  user_id INTEGER REFERENCES users(id),
  company_name VARCHAR(255) NOT NULL,
  industry VARCHAR(255),
  company_size VARCHAR(50),
  description TEXT,
  location VARCHAR(255),
  website VARCHAR(255),
  logo VARCHAR(255),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create projects table
CREATE TABLE projects (
  id SERIAL PRIMARY KEY,
  company_id INTEGER REFERENCES companies(id),
  title VARCHAR(255) NOT NULL,
  description TEXT,
  budget_min DECIMAL(10,2),
  budget_max DECIMAL(10,2),
  status VARCHAR(50) DEFAULT 'open',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create project_skills table
CREATE TABLE project_skills (
  id SERIAL PRIMARY KEY,
  project_id INTEGER REFERENCES projects(id),
  skill VARCHAR(255) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
); 