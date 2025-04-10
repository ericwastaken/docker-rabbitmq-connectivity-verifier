const amqp = require('amqplib');
const fs = require('fs');
const path = require('path');
const dotenv = require('dotenv');

// Validate required environment variables
function validateEnvironmentVariables() {
  const requiredVars = ['RABBITMQ_HOST', 'RABBITMQ_PORT', 'RABBITMQ_USERNAME', 'RABBITMQ_PASSWORD'];
  const missingVars = requiredVars.filter(varName => !process.env[varName]);

  if (missingVars.length > 0) {
    console.error(`Error: The following required environment variables are missing: ${missingVars.join(', ')}`);
    process.exit(1);
  }
}

// Load environment variables from rmq-verifier.conf if it exists
const configPath = path.join('/app/secrets', 'rmq-verifier.conf');
if (fs.existsSync(configPath)) {
  console.log(`Loading configuration from ${configPath}`);
  dotenv.config({ path: configPath });
} else {
  console.log('No rmq-verifier.conf file found, using environment variables directly');
}

// Validate environment variables at the start
validateEnvironmentVariables();

async function sendMessage() {
  const rabbitmqHost = process.env.RABBITMQ_HOST;
  const rabbitmqPort = process.env.RABBITMQ_PORT;
  const rabbitmqUsername = process.env.RABBITMQ_USERNAME;
  const rabbitmqPassword = process.env.RABBITMQ_PASSWORD;

  console.log(`Connecting as "${rabbitmqUsername}" to "${rabbitmqHost}:${rabbitmqPort}"`);
  const amqpURL = `amqps://${rabbitmqUsername}:${rabbitmqPassword}@${rabbitmqHost}:${rabbitmqPort}`;

  // Connection options
  const connectionOptions = {};

  // Check for CA certificate in the secrets directory
  const caCertPath = path.join('/app/secrets', 'ca.pem');

  if (fs.existsSync(caCertPath)) {
    console.log(`Using CA certificate from secrets directory: ${caCertPath}`);
    const caCert = fs.readFileSync(caCertPath);
    connectionOptions.ca = [caCert];
  } else {
    console.log('No CA certificate found, using default TLS settings');
  }

  const connection = await amqp.connect(amqpURL, connectionOptions);

  const channel = await connection.createChannel();

  const exchange = 'rmq-conn-test';
  const queue = 'rmq-conn-test';
  const message = `Hello, the time is ${new Date().toISOString()}`;

  await channel.assertExchange(exchange, 'direct', { durable: true });
  await channel.assertQueue(queue, { durable: true });
  await channel.bindQueue(queue, exchange, '');
  await channel.publish(exchange, '', Buffer.from(message), { persistent: true });
  console.log(`Persistent message "${message}" sent to exchange "${exchange}" and queue "${queue}"`);

  await channel.close();
  await connection.close();
}

sendMessage().catch((err) => {
  console.error('Error:', err);
});
