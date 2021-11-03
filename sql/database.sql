CREATE USER snackbooking WITH PASSWORD 1;
CREATE DATABASE snackbooking;
GRANT ALL PRIVILEGES ON DATABASE snackbooking to snackbooking;
CREATE TABLE "products" (
	id UUID PRIMARY KEY DEFAULT gen_random_uuid (),
	name TEXT NOT NULL,
	description TEXT,
	price NUMERIC(5,2) NOT NULL,
	deleted_at TIMESTAMP WITHOUT TIME ZONE DEFAULT (NOW() AT TIME ZONE 'utc')
);
CREATE TABLE "users" (
	id UUID PRIMARY KEY DEFAULT gen_random_uuid (),
	class_number INTEGER NOT NULL,
	section CHARACTER (1) NOT NULL,
    	admin BOOLEAN NOT NULL DEFAULT FALSE,
	email TEXT UNIQUE NOT NULL,
	password_digest BYTEA NOT NULL,
    	submitted_at TIMESTAMP WITHOUT TIME ZONE
);
CREATE TABLE "users_products" (
	id UUID PRIMARY KEY DEFAULT gen_random_uuid (),
	user_id UUID NOT NULL REFERENCES users (id) ON DELETE CASCADE,
    	product_id UUID NOT NULL REFERENCES products (id) ON DELETE CASCADE,
	quantity INTEGER NOT NULL,
	add_at TIMESTAMP WITHOUT TIME ZONE DEFAULT (NOW() AT TIME ZONE 'utc'),
	UNIQUE (product_id, user_id)
);
CREATE TABLE "sessions" (
	id UUID PRIMARY KEY DEFAULT gen_random_uuid (),
	user_id UUID REFERENCES users (id) ON DELETE CASCADE,
	created_at TIMESTAMP WITHOUT TIME ZONE DEFAULT (NOW() AT TIME ZONE 'utc'),
	expires_at TIMESTAMP WITHOUT TIME ZONE DEFAULT (NOW() AT TIME ZONE 'utc' + INTERVAL '30 days')
);
