const rabbitmqConfig = {
    host: process.env.RABBITMQ_HOST || 'localhost',
    port: parseInt(process.env.RABBITMQ_PORT || '5672', 10),
    username: process.env.RABBITMQ_USERNAME || 'guest',
    password: process.env.RABBITMQ_PASSWORD || 'guest',
    vhost: process.env.RABBITMQ_VHOST || '/',
    ssl: {
        enabled: process.env.RABBITMQ_SSL_ENABLED === 'true',
        caPath: process.env.RABBITMQ_CA_PATH,
        certPath: process.env.RABBITMQ_CERT_PATH,
        keyPath: process.env.RABBITMQ_KEY_PATH,
        passphrase: process.env.RABBITMQ_PASSPHRASE,
        rejectUnauthorized: process.env.RABBITMQ_REJECT_UNAUTHORIZED === 'true'
    },
    queues: {
        taskSubmissions: {
            name: process.env.RABBITMQ_TASK_SUBMISSIONS_QUEUE || 'taskSubmissions',
            options: {
                durable: true,
            },
        },
    },
    exchanges: {
        taskEvents: {
            name: process.env.RABBITMQ_TASK_EVENTS_EXCHANGE || 'tasksEvents',
            type: 'topic',
            options: {
                durable: true,
            },
        },
    },
};

console.log("Configuración de RabbitMQ:", rabbitmqConfig);


export default rabbitmqConfig;