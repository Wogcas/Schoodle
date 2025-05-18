import app from './app';
import { SERVER_PORT, SERVER_HOST } from './config/constants';

app.listen(SERVER_PORT, SERVER_HOST, () => {
    console.log(`Server is running on http://${SERVER_HOST}:${SERVER_PORT}`);
});