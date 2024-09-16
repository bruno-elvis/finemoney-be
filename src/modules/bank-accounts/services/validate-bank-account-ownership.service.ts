import { Injectable, NotFoundException } from '@nestjs/common';
import { BankAccountsRepository } from 'src/shared/database/repositories/bank-accounts.repositories';

@Injectable()
export class ValidateBankAccountOwnershipService {
	constructor(private readonly repoBankAccounts: BankAccountsRepository) {}

	async validate(userId: string, bankAccountId: string) {
		const isOwner = await this.repoBankAccounts.findFirst({
			where: { userId, id: bankAccountId },
		});

		if (!isOwner) throw new NotFoundException('Bank account not found.');
	}
}
