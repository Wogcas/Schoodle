const moodleClient = require('./clients/moodle.client');
const schoolSystemClient = require('./clients/schoolSystem.client');

async function testConnections() {
  try {
    const [moodleData, schoolData] = await Promise.all([
      moodleClient.getSiteInfo(),
      schoolSystemClient.getSystemInfo()
    ]);
    
    console.log('Conexiones exitosas:');
    console.log('Moodle:', moodleData);
    console.log('School System:', schoolData);
  } catch (error) {
    console.error('Error en conexiones:', error.message);
    process.exit(1);
  }
}

testConnections();