export interface ApiResponse {
    success: boolean;
    status: number;
    data?: any; // Opcional en éxito
    error?: string; // Opcional en error
}