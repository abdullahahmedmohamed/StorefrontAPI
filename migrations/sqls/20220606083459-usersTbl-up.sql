create table if not exists users (id Serial PRIMARY KEY,"userName" VARCHAR(50) UNIQUE NOT NULL,"password" VARCHAR NOT NULL,"firstName" VARCHAR(50) NOT NULL,"lastName" VARCHAR(50));