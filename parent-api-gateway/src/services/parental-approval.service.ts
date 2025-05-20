import { Inject, Injectable, OnModuleInit } from '@nestjs/common';
import { ClientGrpc } from '@nestjs/microservices';

@Injectable()
export class ParentalApprovalService implements OnModuleInit {
    private parentalApprovalService;

    constructor(
        @Inject('PARENTAL_APPROVAL_SERVICE') private client: ClientGrpc,
    ) { }

    onModuleInit() {
        this.parentalApprovalService = this.client.getService('ParentalApprovalManagementGrpcService');
    }

    getHello(): string {
        return 'Hello World!';
    }
}