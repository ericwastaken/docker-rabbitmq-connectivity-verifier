# Secrets Directory

This directory is used to store sensitive configuration files needed for the RabbitMQ Connectivity Verifier.

## Required Files

### 1. RabbitMQ Configuration File (`rmq-verifier.conf`)

This file should contain the RabbitMQ connection details in environment variable syntax (key-value pairs):

```
RABBITMQ_HOST=your-rabbitmq-host
RABBITMQ_PORT=your-rabbitmq-port
RABBITMQ_USERNAME=your-rabbitmq-username
RABBITMQ_PASSWORD=your-rabbitmq-password
```

Example:
```
RABBITMQ_HOST=rabbitmq.example.com
RABBITMQ_PORT=5671
RABBITMQ_USERNAME=admin
RABBITMQ_PASSWORD=secretpassword
```

An example `rmq-verifier-template.conf` file is provided in the `secrets` directory. You can copy it to `rmq-verifier.conf` then modify it with your RabbitMQ server details.

### 2. CA Certificate (Optional)

If your RabbitMQ server uses SSL/TLS with a custom Certificate Authority (or self-signed cert), you can place the CA certificate in this directory as:

```
ca.pem
```

## Usage

When you run the Docker container using the provided compose.yml file, these files will be automatically mounted and used by the application.

The application will:
1. Read the RabbitMQ connection details from the `rmq-verifier.conf` file
2. Use the CA certificate (`ca.pem`) if present for secure connections
3. Attempt to connect to the RabbitMQ server and verify connectivity

## Security Notes

- This directory is mounted into the Docker container at runtime
- These files contain sensitive information and should not be committed to version control
- Ensure proper file permissions are set to restrict access to these files
