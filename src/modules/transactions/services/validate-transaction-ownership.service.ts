import { Injectable, NotFoundException } from '@nestjs/common';
import { TransactionsRepository } from 'src/shared/database/repositories/transactions.repositories';

@Injectable()
export class ValidateTransactionOwnershipService {
	constructor(private readonly transationsRepo: TransactionsRepository) {}

	async validate(userId: string, transactionId: string) {
		const isOwner = await this.transationsRepo.findFirst({
			where: { userId, id: transactionId },
		});

		if (!isOwner) throw new NotFoundException('Transaction not found.');
	}
}
