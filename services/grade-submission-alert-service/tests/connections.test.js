require('dotenv').config();
const MoodleAPI = require('../src/integrations/MoodleAPI');
const SchoolSystemAPI = require('../src/integrations/SchoolSystemAPI');

async function testMoodleAPI() {
    const moodleAPI = new MoodleAPI();
    const response = await moodleAPI.getSiteInfo();
    
    if (response.status === 200) {
        console.log('Moodle API is working correctly.');
        console.log('Response:', response.data);
    } else {
        console.error('Moodle API error:', response.error);
    }
}

async function testSchoolSystemAPI() {
    const schoolSystemAPI = new SchoolSystemAPI();
    const response = await schoolSystemAPI.getSystemInfo();
    
    if (response.status === 200) {
        console.log('School System API is working correctly.');
        console.log('Response:', response.data);
    } else {
        console.error('School System API error:', response.error);
    }
}
async function main() {
    console.log('Testing Moodle API...');
    await testMoodleAPI();
    
    console.log('Testing School System API...');
    await testSchoolSystemAPI();
}
main()
    .catch(error => {
        console.error('Error in main function:', error);
    });