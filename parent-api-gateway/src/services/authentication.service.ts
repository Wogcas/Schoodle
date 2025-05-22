import { HttpService } from "@nestjs/axios";
import { HttpException, Injectable } from "@nestjs/common";
import { firstValueFrom } from "rxjs";

@Injectable()
export class AuthenticationService {

    constructor(
        private readonly httpService: HttpService
    ) { }

     async login(email: string, password: string): Promise<any> {
        try {
            const info = { email, password };
            const response = await firstValueFrom(
                this.httpService.post('login', info)
            );
            return response.data; 
        } catch (error) {
            // Mejor manejo de errores (opcional)
            const errorMessage = error.response?.data?.message || error.message;
            throw new HttpException(
                'Error during login: ' + errorMessage,
                error.response?.status || 500,
            );
        }
    }

}