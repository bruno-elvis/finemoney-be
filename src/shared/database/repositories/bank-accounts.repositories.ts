import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { Prisma } from '@prisma/client';

@Injectable()
export class BankAccountsRepository {
	constructor(private readonly prismaService: PrismaService) {}

	create(createDto: Prisma.BankAccountCreateArgs) {
		return this.prismaService.bankAccount.create(createDto);
	}

	findMany(userId: string) /*<T extends Prisma.BankAccountFindManyArgs>(
		findManyDto: Prisma.SelectSubset<T, Prisma.BankAccountFindManyArgs>,
	)*/ {
		return this.prismaService.$queryRaw`SELECT 
																					ba.id, 
																					ba.user_id, 
																					ba.name, 
																					ba.initial_balance,
																					ba.type,
																					ba.color,
																					(ba.initial_balance + transact.value) AS currentBalance
																				FROM 
																					bank_accounts ba
																				INNER JOIN 
																					(SELECT 
																						t.user_id,
																						SUM(CASE WHEN t.type = 'INCOME' THEN t.value WHEN t.type = 'EXPENSE' THEN -t.value END) AS value
																					FROM 
																						transactions t 
																					GROUP BY 
																						t.user_id) AS transact ON (transact.user_id = ba.user_id)
																				WHERE 
																					ba.user_id = ${userId}::uuid 
																				GROUP BY 
																					ba.id, ba.user_id, ba.name, ba.initial_balance, ba.color, transact.value;`;

		//return this.prismaService.bankAccount.findMany(findManyDto);
	}

	findFirst(findFirstDto: Prisma.BankAccountFindFirstArgs) {
		return this.prismaService.bankAccount.findFirst(findFirstDto);
	}

	update(updateDto: Prisma.BankAccountUpdateArgs) {
		return this.prismaService.bankAccount.update(updateDto);
	}

	delete(deleteDto: Prisma.BankAccountDeleteArgs) {
		return this.prismaService.bankAccount.delete(deleteDto);
	}
}
