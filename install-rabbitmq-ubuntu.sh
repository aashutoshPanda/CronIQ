#!/bin/bash

# Step 1: Update the package index and install prerequisites
sudo apt update
sudo apt install -y curl gnupg2

# Step 2: Add RabbitMQ signing key
curl -fsSL https://github.com/rabbitmq/signing-keys/releases/download/2.0/rabbitmq-release-signing-key.asc | sudo gpg --dearmor > /etc/apt/trusted.gpg.d/rabbitmq-archive-keyring.gpg

# Step 3: Enable the RabbitMQ package repository
echo "deb https://dl.bintray.com/rabbitmq-erlang/debian $(lsb_release -sc) erlang" | sudo tee /etc/apt/sources.list.d/rabbitmq.list

# Step 4: Install RabbitMQ server
sudo apt update
sudo apt install -y rabbitmq-server

# Step 5: Start and enable RabbitMQ
sudo systemctl start rabbitmq-server
sudo systemctl enable rabbitmq-server

# Step 6: Check the status of RabbitMQ
sudo systemctl status rabbitmq-server

# Step 7: Set up RabbitMQ management plugin (optional)
sudo rabbitmq-plugins enable rabbitmq_management

echo "RabbitMQ is now installed and running!"
echo "You can access the management web interface at http://localhost:15672/"
echo "Default login credentials: Username: guest, Password: guest"

