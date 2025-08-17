CREATE TABLE IF NOT EXISTS patients (
  id SERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  cpf VARCHAR(11) UNIQUE,
  birth_date DATE,
  gender VARCHAR(1),
  phone VARCHAR(15),
  email TEXT,
  address TEXT,
  emergency_contact TEXT,
  allergies TEXT,
  chronic_conditions TEXT,
  current_medications TEXT,
  insurance_number VARCHAR(50),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
  created_by VARCHAR NOT NULL REFERENCES users(id)
);