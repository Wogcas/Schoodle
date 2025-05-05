module.exports = {
    MOODLE_URL: process.env.MOODLE_API_URL || 'http://localhost:8080/api/moodle/rest',
    SCHOOL_SYSTEM_URL: process.env.SCHOOL_SYSTEM_API_URL || 'http://localhost:8081/api/school-system',
    RETRY_INTERVAL: 300000 // 5 minutos
  };