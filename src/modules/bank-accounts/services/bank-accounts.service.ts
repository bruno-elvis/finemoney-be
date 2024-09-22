import { Injectable } from '@nestjs/common';
import { CreateBankAccountDto } from '../dto/create-bank-account.dto';
import { UpdateBankAccountDto } from '../dto/update-bank-account.dto';
import { BankAccountsRepository } from 'src/shared/database/repositories/bank-accounts.repositories';
import { ValidateBankAccountOwnershipService } from './validate-bank-account-ownership.service';

@Injectable()
export class BankAccountsService {
	constructor(
		private readonly repoBankAccounts: BankAccountsRepository,
		private readonly validateBankAccountOwnershipService: ValidateBankAccountOwnershipService,
	) {}

	create(userId: string, createBankAccountDto: CreateBankAccountDto) {
		const { name, initialBalance, type, color } = createBankAccountDto;

		return this.repoBankAccounts.create({
			data: {
				userId,
				name,
				initialBalance,
				type,
				color,
			},
		});
	}

	async findAllByUserId(userId: string) {
		const bankAccountAccountQuery = await this.repoBankAccounts.findMany({
			where: { userId },
			include: { transactions: { select: { value: true, type: true } } },
		});

		return bankAccountAccountQuery.map(({ transactions, ...bankAccount }) => {
			const totalTransactions = transactions.reduce(
				(acc, transaction) =>
					acc + (transaction.type === 'INCOME' ? transaction.value : -transaction.value),
				0,
			);

			const currentBalance = bankAccount.initialBalance + totalTransactions;

			return { ...bankAccount, currentBalance, transactions };
		});
	}

	async update(userId: string, bankAccountId: string, updateBankAccountDto: UpdateBankAccountDto) {
		const { name, initialBalance, type, color } = updateBankAccountDto;

		await this.validateBankAccountOwnershipService.validate(userId, bankAccountId);

		return this.repoBankAccounts.update({
			where: {
				id: bankAccountId,
			},
			data: {
				name,
				initialBalance,
				type,
				color,
			},
		});
	}

	async remove(userId: string, bankAccountId: string) {
		await this.validateBankAccountOwnershipService.validate(userId, bankAccountId);

		await this.repoBankAccounts.delete({
			where: { id: bankAccountId },
		});
	}
}
