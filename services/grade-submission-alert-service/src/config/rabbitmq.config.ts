export interface RabbitMQConfig {
    host: string;
    port: number;
    username: string;
    password: string;
    vhost: string;
    queues: Record<string, QueueConfig>;
    exchanges: Record<string, ExchangeConfig>;
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

// Configuración por defecto con mayor flexibilidad
const rabbitConfig: RabbitMQConfig = {
    host: process.env.RABBITMQ_HOST || 'localhost',
    port: parseInt(process.env.RABBITMQ_PORT || '5672', 10),
    username: process.env.RABBITMQ_USERNAME || 'guest',
    password: process.env.RABBITMQ_PASSWORD || 'guest',
    vhost: process.env.RABBITMQ_VHOST || '/',
    
    // Definir colas con configuraciones específicas
    queues: {
        default: {
            name: process.env.RABBITMQ_DEFAULT_QUEUE || 'default_queue',
            options: {
                durable: true,
                // Opcionalmente, puedes configurar cola de mensajes muertos
                deadLetterExchange: 'dlx.default',
                messageTtl: 86400000, // 24 horas en milisegundos
            }
        },
        // Añadir más colas según sea necesario
    },
    
    // Definir intercambios con configuraciones específicas
    exchanges: {
        default: {
            name: process.env.RABBITMQ_DEFAULT_EXCHANGE || 'default_exchange',
            type: 'topic',
            options: {
                durable: true,
                autoDelete: false
            }
        },
        dlx: {
            name: 'dlx.default',
            type: 'direct',
            options: {
                durable: true,
                autoDelete: false
            }
        }
        // Añadir más intercambios según sea necesario
    }
};

export default rabbitConfig;