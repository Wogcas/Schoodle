export interface RabbitMQConfig {
    host: string;
    port: number;
    username: string;
    password: string;
    vhost: string;
    queues: Record<string, QueueConfig>;
    exchanges: Record<string, ExchangeConfig>;
    ssl?: { // Nuevas propiedades opcionales para SSL
        enabled: boolean;
        certPath?: string;
        keyPath?: string;
        passphrase?: string;
        rejectUnauthorized?: boolean;
    };
}

export interface QueueConfig {
    name: string;
    options: {
        durable: boolean;
        deadLetterExchange?: string;
        messageTtl?: number;
        maxLength?: number;
    };
}

export interface ExchangeConfig {
    name: string;
    type: 'direct' | 'topic' | 'fanout' | 'headers';
    options: {
        durable: boolean;
        autoDelete?: boolean;
    };
}

const rabbitConfig: RabbitMQConfig = {
    host: process.env.RABBITMQ_HOST || 'localhost',
    port: parseInt(process.env.RABBITMQ_PORT || '5672', 10),
    username: process.env.RABBITMQ_USERNAME || 'guest',
    password: process.env.RABBITMQ_PASSWORD || 'guest',
    vhost: process.env.RABBITMQ_VHOST || '/',
    queues: {
        default: {
            name: process.env.RABBITMQ_DEFAULT_QUEUE || 'default_queue',
            options: {
                durable: true,
                deadLetterExchange: 'dlx.default',
                messageTtl: 86400000,
            },
        },
        notifications: {
            name: process.env.RABBITMQ_NOTIFICATIONS_QUEUE || 'notifications_queue',
            options: {
                durable: true,
            },
        },
        tasks: {
            name: process.env.RABBITMQ_TASKS_QUEUE || 'taskSubmissions',
            options: {
                durable: true,
            },
        }
    },
    exchanges: {
        default: {
            name: process.env.RABBITMQ_DEFAULT_EXCHANGE || 'default_exchange',
            type: 'topic',
            options: {
                durable: true,
                autoDelete: false,
            },
        },
        dlx: {
            name: 'dlx.default',
            type: 'direct',
            options: {
                durable: true,
                autoDelete: false,
            },
        },
        notifications: {
            name: process.env.RABBITMQ_NOTIFICATIONS_EXCHANGE || 'notifications',
            type: 'topic',
            options: {
                durable: true,
                autoDelete: false,
            },
        },
        tasks: {
            name: process.env.RABBITMQ_TASKS_EXCHANGE || 'tasksEvents',
            type: 'topic',
            options: {
                durable: true,
                autoDelete: false,
            },
        }
    },
};

export default rabbitConfig;