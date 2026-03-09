CREATE DATABASE crop_trading;

USE crop_trading;

-- Farmers Table
CREATE TABLE farmers (
    farmer_id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100),
    phone VARCHAR(15),
    location VARCHAR(100),
    password VARCHAR(255)
);

-- Salesmen Table
CREATE TABLE salesmen (
    salesman_id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100),
    phone VARCHAR(15),
    company VARCHAR(100),
    password VARCHAR(255)
);

-- Crops Table
CREATE TABLE crops (
    crop_id INT AUTO_INCREMENT PRIMARY KEY,
    farmer_id INT,
    crop_name VARCHAR(100),
    quantity INT,
    price DECIMAL(10,2),
    location VARCHAR(100),
    FOREIGN KEY (farmer_id) REFERENCES farmers(farmer_id)
);

-- Orders Table
CREATE TABLE orders (
    order_id INT AUTO_INCREMENT PRIMARY KEY,
    salesman_id INT,
    crop_id INT,
    quantity INT,
    order_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    status VARCHAR(50),
    FOREIGN KEY (salesman_id) REFERENCES salesmen(salesman_id),
    FOREIGN KEY (crop_id) REFERENCES crops(crop_id)
);

-- Payments Table
CREATE TABLE payments (
    payment_id INT AUTO_INCREMENT PRIMARY KEY,
    order_id INT,
    amount DECIMAL(10,2),
    payment_status VARCHAR(50),
    payment_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (order_id) REFERENCES orders(order_id)
);