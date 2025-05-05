import amqlib from 'amqplib';

async function sendTestMessage() {
  const rabbitmqUrl = 'amqp://guest:guest@localhost:5672/';
  const exchangeName = 'notifications'; 
  const routingKey = '#';
  const testMessage = {
    type: 'test',
    content: 'Mensaje de prueba enviado desde testRabbitMQ.ts',
    timestamp: new Date().toISOString(),
  };

  let connection;
  let channel;

  try {
    connection = await amqlib.connect(rabbitmqUrl);
    channel = await connection.createChannel();

    await channel.assertExchange(exchangeName, 'topic', { durable: true });

    const messageBuffer = Buffer.from(JSON.stringify(testMessage));

    await channel.publish(exchangeName, routingKey, messageBuffer);
    console.log(
      `[x] Sent ${testMessage.content} to exchange ${exchangeName} with routing key ${routingKey}`,
    );
  } catch (error) {
    console.error('Error al enviar el mensaje:', error);
  } finally {
    if (channel) {
      await channel.close();
    }
    if (connection) {
      await connection.close();
    }
  }
}

sendTestMessage()
  .then(() => console.log('Script de prueba completado.'))
  .catch((error) => console.error('Script de prueba fallido:', error));