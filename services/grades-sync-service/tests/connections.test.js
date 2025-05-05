const moodleClient = require('../src/clients/moodle.client');
const schoolSystemClient = require('../src/clients/schoolSystem.client');

async function testMoodleConnection() {
    try {
        const response = await moodleClient.getSiteInfo();
        console.log('Conexión a Moodle exitosa:', response);
    } catch (error) {
        console.error('Error en la conexión a Moodle:', error.message);
    }
}

async function testSchoolSystemConnection() {
    try {
        const response = await schoolSystemClient.getInfo();
        console.log('Conexión al sistema escolar exitosa:', response);
    } catch (error) {
        console.error('Error en la conexión al sistema escolar:', error.message);
    }
}

async function testConnections() {
    console.log('Iniciando pruebas de conexión...');
    
    await testMoodleConnection();
    await testSchoolSystemConnection();
    
    console.log('Pruebas de conexión finalizadas.');
    process.exit(0);
}

testConnections();
