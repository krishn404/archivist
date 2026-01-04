import { db, eq } from "@quarter/db";
import { user } from "@quarter/db/schema/auth";
import type { Request, Response } from "express";
import type { UpdateNameInput } from "../validators/users.validator";

export const updateName = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { name } = req.body as UpdateNameInput;
    const userId = req.user?.id;

    if (!userId) {
      res.status(401).json({
        message: "Authentication required",
      });
      return;
    }

    const [updatedUser] = await db
      .update(user)
      .set({ name })
      .where(eq(user.id, userId))
      .returning({
        id: user.id,
        name: user.name,
        email: user.email,
        image: user.image,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt,
      });

    if (!updatedUser) {
      res.status(404).json({
        message: "User not found",
      });
      return;
    }

    res.status(200).json({
      message: "Name updated successfully",
      user: updatedUser,
    });
  } catch (error) {
    res.status(500).json({
      message: "An error occurred while updating your name",
    });
  }
};
