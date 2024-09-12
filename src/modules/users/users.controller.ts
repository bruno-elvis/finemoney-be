import { Controller, Get, Request } from '@nestjs/common';
import { UsersService } from './users.service';

@Controller('users')
export class UsersController {
	constructor(private readonly usersService: UsersService) {}

	@Get('/me')
	me(@Request() request: any) {
		console.log({ meUserId: request.userId });

		return this.usersService.getUserById('userId');
	}
}
