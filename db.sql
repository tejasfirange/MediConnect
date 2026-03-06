CREATE TABLE users (
    email VARCHAR(255) PRIMARY KEY,
    role VARCHAR(50) NOT NULL,
    password VARCHAR(255) NOT NULL
);

-- 2. Patient Details Table
CREATE TABLE patient_details (
    id SERIAL PRIMARY KEY,
    email VARCHAR(255),
    name VARCHAR(100) NOT NULL,
    dob DATE,
    gender VARCHAR(10),
    contact_no VARCHAR(15),
    
    CONSTRAINT fk_patient_email
        FOREIGN KEY (email)
        REFERENCES users(email)
        ON DELETE CASCADE
);

-- 3. Doctor Details Table
CREATE TABLE doctor_details (
    d_id SERIAL PRIMARY KEY,
    email VARCHAR(255),
    name VARCHAR(100) NOT NULL,
    dob DATE,
    gender VARCHAR(10),
    contact_no VARCHAR(15),
    registration_no VARCHAR(100) UNIQUE,
    qualification VARCHAR(100),

    CONSTRAINT fk_doctor_email
        FOREIGN KEY (email)
        REFERENCES users(email)
        ON DELETE CASCADE
);

-- 4. Patient Reports Table
CREATE TABLE patient_reports (
    pr_id SERIAL PRIMARY KEY,
    email VARCHAR(255),
    report JSONB,
    is_verified BOOLEAN DEFAULT FALSE,

    CONSTRAINT fk_report_email
        FOREIGN KEY (email)
        REFERENCES users(email)
        ON DELETE CASCADE
);

//forgot password

CREATE TABLE password_reset_tokens (
    id SERIAL PRIMARY KEY,
    email VARCHAR(255) NOT NULL,
    token VARCHAR(255) NOT NULL,
    expires_at TIMESTAMP NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    CONSTRAINT fk_reset_email
    FOREIGN KEY (email)
    REFERENCES users(email)
    ON DELETE CASCADE
);