import bcrypt from "bcryptjs";
import { eq, getColumns } from "drizzle-orm";
import { withTransactionBuilder } from "$libs/db";
import type { TInsertUser } from "$types/auth";
import { account, user } from "~drizzle/schemas";

export const mutateUserById = (
	id: string,
	userData: Omit<TInsertUser, "id" | "role">,
) =>
	withTransactionBuilder(async (db) => {
		const { name, username, email, image } = getColumns(user);

		const [updatedUser] = await db
			.update(user)
			.set(userData)
			.where(eq(user.id, id))
			.returning({
				name,
				username,
				email,
				image,
			});

		return updatedUser;
	});

export const mutatePasswordByUserId = (userId: string, newPassword: string) =>
	withTransactionBuilder(async (db) => {
		const salt = await bcrypt.genSalt();
		const encrypted = await bcrypt.hash(newPassword, salt);

		await db
			.update(account)
			.set({ password: encrypted })
			.where(eq(account.userId, userId));
	});
