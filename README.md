# Docker RabbitMQ Connectivity Verifier

A simple Docker-based utility to verify connectivity to a RabbitMQ server. This tool connects to a specified RabbitMQ server, creates a test exchange and queue, and sends a test message to verify that the connection is working properly.

## Overview

This project provides a containerized Node.js application that:

1. Connects to a RabbitMQ server using credentials you provide
2. Creates a test exchange and queue
3. Sends a test message with a timestamp
4. Reports success or failure

It's useful for:
- Verifying RabbitMQ server connectivity
- Testing credentials and permissions
- Validating TLS/SSL configurations
- Troubleshooting network connectivity issues

## Requirements

- Docker and Docker Compose
- Access to a RabbitMQ server
- RabbitMQ credentials with permissions to create exchanges and queues

## Setup

1. Clone this repository
2. Navigate to the `secrets` directory
3. Copy `rmq-verifier-template.conf` to `rmq-verifier.conf`
4. Edit `rmq-verifier.conf` with your RabbitMQ server details
5. If using SSL/TLS with a custom CA certificate, place your `ca.pem` file in the `secrets` directory

## Important: Secrets Configuration

This project requires proper configuration in the `secrets` directory. **Please refer to the [Secrets README](./secrets/README%20-%20secrets.md) for detailed instructions on configuring your RabbitMQ connection.**

The secrets configuration is critical for the proper functioning of this tool.

## Usage

After you have created your secrets configuration, you can run the RabbitMQ Connectivity Verifier using Docker Compose.

1. Open a terminal and navigate to the project directory.
2. Run the connectivity verifier with:

    ```bash
    docker compose up
    ```

The container will:
1. Start up
2. Connect to your RabbitMQ server
3. Create a test exchange and queue
4. Send a test message
5. Output the results to the console
6. Exit

### Example Output

Successful connection:
```
Loading configuration from /app/secrets/rmq-verifier.conf
Connecting as "admin" to "rabbitmq.example.com:5671"
No CA certificate found, using default TLS settings
Persistent message "Hello, the time is 2023-11-15T12:34:56.789Z" sent to exchange "rmq-conn-test" and queue "rmq-conn-test"
```

## How It Works

The application:
1. Loads RabbitMQ connection details from the configuration file
2. Optionally uses a CA certificate for secure connections
3. Connects to the RabbitMQ server using amqplib
4. Creates a test exchange and queue
5. Sends a message with the current timestamp
6. Reports the results

The Docker container is configured to run once and not restart automatically. To repeat your test, simply run the `docker compose up` command again.