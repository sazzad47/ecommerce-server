CREATE TYPE ecommerce.ORDER_STATUS AS ENUM('DELIVERED','PENDING','DELIVERING','CANCELED');
CREATE TYPE ecommerce.PROPERTY_TYPES AS ENUM('COLOR','TEXT','FROM_TO','SLIDER');

/* ECOMMERCE */
CREATE TABLE ecommerce.user(
	id SERIAL PRIMARY KEY,
	first_name varchar NOT NULL,
	last_name varchar NOT NULL,
	email varchar NOT NULL,
	phone varchar NOT NULL,
	password varchar NOT NULL,
	created_at TIMESTAMP,
	updated_at TIMESTAMP
);

/* ADMINS */
CREATE TABLE ecommerce.admins(
 id serial primary key,
 name varchar not null,
 email varchar not null,
  password varchar not null,
  created_at TIMESTAMP,
  updated_at TIMESTAMP
);


/* ADDRESS */
CREATE TABLE ecommerce.address(
	id SERIAL PRIMARY KEY,
	user_id integer NOT NULL,
   address varchar NOT NULL,
	city varchar NOT NULL,
	postal_code varchar NOT NULL,
	created_at TIMESTAMP,
	updated_at TIMESTAMP
);




/* CATEGORY */
CREATE TABLE ecommerce.category(
	id SERIAL PRIMARY KEY,
	title varchar NOT NULL,
	image_url varchar default '',
	banner_url varchar default '',
	created_at TIMESTAMP,
	updated_at TIMESTAMP
);

/* PROPERTY_VALUE */
CREATE TABLE ecommerce.property_values(
	id SERIAL PRIMARY KEY,
	property_id INTEGER NOT NULL,
	value varchar NOT NULL,
	created_at TIMESTAMP,
	updated_at TIMESTAMP
);

/* PROPERTY */
CREATE TABLE ecommerce.property(
	id SERIAL PRIMARY KEY,
	name varchar NOT NULL,
	type ecommerce.PROPERTY_TYPES,
	created_at TIMESTAMP,
	updated_at TIMESTAMP
);


/* SLIDER_IMAGES */
CREATE TABLE ecommerce.slider_images(
	id SERIAL PRIMARY KEY,
	url varchar NOT NULL,
	created_at TIMESTAMP,
	updated_at TIMESTAMP
);

/* SITES_PAGES */

CREATE TABLE ecommerce.site_pages(
	id SERIAL PRIMARY KEY,
	terms varchar NOT NULL,
	privacy varchar NOT NULL,
	about varchar NOT NULL,
	created_at TIMESTAMP,
	updated_at TIMESTAMP
);


-- Important to excute this 
INSERT into ecommerce.site_pages(terms , privacy , about) values ('' , '' , '');

-- Important to excute this 
ALTER TABLE ecommerce.property
ADD CONSTRAINT name_uk UNIQUE (name);


/* CATEGORIES PROPERTIES  */
CREATE TABLE ecommerce.categories_properties(
	id SERIAL PRIMARY KEY,
	category_id integer NOT NULL,
	property_id integer NOT NULL,
	created_at TIMESTAMP,
	updated_at TIMESTAMP
);

/* PRODUCT */
CREATE TABLE ecommerce.product(
	id SERIAL PRIMARY KEY,
	category_id integer NOT NULL,
	name varchar NOT NULL,
	price real NOT NULL,
	stock real NOT NULL,
	is_real BOOLEAN NOT NULL,
	description varchar NOT NULL,
	short_description varchar NOT NULL,
	views integer NOT NULL,
	discount real NOT NULL,
	max_order integer default 1,
	min_order integer default 1,
	created_at TIMESTAMP,
	updated_at TIMESTAMP
);


/* PRODUCT_PROPERTIES */
CREATE TABLE ecommerce.product_properties(
	id SERIAL PRIMARY KEY,
	property_id integer NOT NULL,
	property_value_id integer NOT NULL,
	product_id integer NOT NULL,
	created_at TIMESTAMP,
	updated_at TIMESTAMP
);

CREATE TABLE ecommerce.recommendations(
	id SERIAL PRIMARY KEY,
	user_id integer NOT NULL,
	value varchar NOT NULL,
	created_at TIMESTAMP default now(),
	updated_at TIMESTAMP default now()
);


/* PRODUCT_IMAGES */
CREATE TABLE ecommerce.product_images(
id SERIAL PRIMARY KEY,
	product_id INTEGER NOT NULL,
	image_url varchar NOT NULL,
	created_at TIMESTAMP,
	updated_at TIMESTAMP
);


/* CART */
CREATE TABLE ecommerce.cart(
	id SERIAL PRIMARY KEY,
	user_id INTEGER NOT NULL,
	created_at TIMESTAMP,
	updated_at TIMESTAMP
);


/* CART_ITEMS */
CREATE TABLE ecommerce.cart_items(
id SERIAL PRIMARY KEY,
	product_id INTEGER NOT NULL,
	cart_id INTEGER NOT NULL,
	quantity REAL default 1.0,
	created_at TIMESTAMP,
	updated_at TIMESTAMP
);

/* ORDER_ITEMS */
CREATE TABLE ecommerce.order_items(
   id SERIAL PRIMARY KEY,
	product_id INTEGER NOT NULL,
	order_id INTEGER NOT NULL,
	quantity REAL default 1.0,
	total_price real NOT NULL,
	created_at TIMESTAMP,
	updated_at TIMESTAMP
);

/* ORDERS */
CREATE TABLE ecommerce.order(
id SERIAL PRIMARY KEY,
	user_id INTEGER NOT NULL,
	address_id INTEGER NOT NULL,
	total INTEGER NOT NULL,
	status ecommerce.ORDER_STATUS NOT NULL,
	recived_time TIMESTAMP,
	created_at TIMESTAMP,
	updated_at TIMESTAMP,
	delevried_time INT GENERATED ALWAYS AS ((EXTRACT(EPOCH FROM ecommerce.order.recived_time) - 
	EXTRACT(EPOCH FROM ecommerce.order.created_at))/60 ) STORED
);

---------------------------------------------------------------------------------------------

/* ADDRESS CONSTRAINTS */
ALTER TABLE ecommerce.address 
	ADD CONSTRAINT fk_user FOREIGN KEY(user_id) REFERENCES ecommerce.user(id) ON DELETE CASCADE;	


	
/* PROPERTY_VALUE CONSTRAINTS */
ALTER TABLE ecommerce.property_values
	ADD CONSTRAINT fk_propertry FOREIGN KEY(property_id) REFERENCES ecommerce.property(id) ON DELETE CASCADE;
	

/* PRODUCT_IMAGES CONSTRAINTS */
ALTER TABLE ecommerce.product_images
	ADD CONSTRAINT fk_product FOREIGN KEY(product_id) REFERENCES ecommerce.product(id) ON DELETE CASCADE;

/* PRODUCT_POPERTIES */
ALTER TABLE ecommerce.product_properties
	ADD CONSTRAINT fk_property FOREIGN KEY(property_id) REFERENCES ecommerce.property(id),
	ADD CONSTRAINT fk_property_value FOREIGN KEY(property_value_id) REFERENCES ecommerce.property_values(id),
	ADD CONSTRAINT fk_product FOREIGN KEY(product_id) REFERENCES ecommerce.product(id) ON DELETE CASCADE;

ALTER TABLE ecommerce.categories_properties
	ADD CONSTRAINT fk_property FOREIGN KEY(property_id) REFERENCES ecommerce.property(id);


/* CART CONSTRAINTS */
ALTER TABLE ecommerce.cart 
	ADD CONSTRAINT fk_user FOREIGN KEY(user_id) REFERENCES ecommerce.user(id) ON DELETE CASCADE;	


/* CART_PRODUCTS CONSTRAINTS */
ALTER TABLE ecommerce.cart_items 
	ADD CONSTRAINT fk_product FOREIGN KEY(product_id) REFERENCES ecommerce.product(id) ON DELETE CASCADE,
	ADD CONSTRAINT fk_cart FOREIGN KEY(cart_id) REFERENCES ecommerce.cart(id) ON DELETE CASCADE;

/* ORDER CONSTRAINTS */
ALTER TABLE ecommerce.order 
	ADD CONSTRAINT fk_user FOREIGN KEY(user_id) REFERENCES ecommerce.user(id),	
	ADD CONSTRAINT fk_address FOREIGN KEY(address_id) REFERENCES ecommerce.address(id);
	

/* ORDER_ITEMS CONSTRAINTS */

ALTER TABLE ecommerce.order_items
	ADD CONSTRAINT fk_product FOREIGN KEY(product_id) REFERENCES ecommerce.product(id);
	

ALTER TABLE ecommerce.recommendations
	ADD CONSTRAINT fk_user FOREIGN KEY(user_id) REFERENCES ecommerce.user(id);


-- password is : 99059459Mm@

insert into ecommerce.admins(email,password,name)
values('adamoswald789@gmail.com' , '$2a$10$.sSJnV.aC1J3kbJrgeUmO.TUS08c4jByqpLiXPnU.5BbxuqTAOTwK' , 'adam' );