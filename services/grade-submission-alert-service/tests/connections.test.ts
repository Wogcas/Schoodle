// tests/connections.test.ts
import 'dotenv/config';
import MoodleAPI from '../src/clients/MoodleAPI.js'; // Nota el .js
import SchoolSystemAPI from '../src/clients/SchoolSystemAPI.js'; // Nota el .js
import rabbitmqClient from '../src/clients/rabbit.client.js'; // Nota el .js

async function testMoodleAPI() {
    const moodleAPI = new MoodleAPI();
    const response = await moodleAPI.getSiteInfo();

    if (response.success) { // Cambia a check de success
        console.log('Moodle API is working correctly.');
        console.log('Response:', response.data);
    } else {
        console.error('Moodle API error:', response.error);
    }
}

async function testSchoolSystemAPI() {
    const schoolSystemAPI = new SchoolSystemAPI();
    const response = await schoolSystemAPI.getSystemInfo();

    if (response.success) { // Cambia a check de success
        console.log('School System API is working correctly.');
        console.log('Response:', response.data);
    } else {
        console.error('School System API error:', response.error);
    }
}

async function testRabbitMQ() {
    try {
        console.log("Publicando mensaje de prueba en RabbitMQ...");
        await rabbitmqClient();
        console.log("Mensaje de prueba enviado correctamente.");
    } catch (error) {
        console.error("Error al probar RabbitMQ:", error);
    }
}

async function main() {
    console.log('Testing Moodle API...');
    await testMoodleAPI();

    console.log('Testing School System API...');
    await testSchoolSystemAPI();

    console.log('Testing RabbitMQ...');
    await testRabbitMQ();
}

main().catch(error => {
    console.error('Error in main function:', error);
});