const rabbitmqConfig = {
    host: process.env.RABBITMQ_HOST || 'localhost',
    port: parseInt(process.env.RABBITMQ_PORT || '5672', 10),
    username: process.env.RABBITMQ_USERNAME || 'guest',
    password: process.env.RABBITMQ_PASSWORD || 'guest',
    vhost: process.env.RABBITMQ_VHOST || '/',
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
            name: process.env.RABBITMQ_TASK_EVENTS_EXCHANGE || 'taskEvents',
            type: 'topic',
            options: {
                durable: true,
            },
        },
    },
};

console.log("Configuración de RabbitMQ:", rabbitmqConfig);


export default rabbitmqConfig;