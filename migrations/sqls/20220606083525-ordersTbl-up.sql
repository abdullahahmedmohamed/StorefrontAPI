-- Create Status Type
DO $$ BEGIN
    CREATE TYPE  order_status AS ENUM ('active', 'complete');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

create table if not exists orders (id Serial PRIMARY KEY,"userId" INTEGER NOT NULL,status order_status NOT NULL, CONSTRAINT fk_users FOREIGN KEY("userId") REFERENCES users(id));