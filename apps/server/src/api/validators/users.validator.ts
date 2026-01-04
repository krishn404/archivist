import { z } from "zod";
import type { Request, Response, NextFunction } from "express";

export const updateNameSchema = z.object({
  name: z
    .string()
    .min(2, "Name must be at least 2 characters long")
    .max(50, "Name must be at most 50 characters long")
    .regex(
      /^[a-zA-Z0-9\s]+$/,
      "Name can only contain alphanumeric characters and spaces"
    ),
});

export type UpdateNameInput = z.infer<typeof updateNameSchema>;

export const validateUpdateName = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const validatedData = updateNameSchema.parse(req.body);
    req.body = validatedData;
    next();
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({
        message: "Validation failed",
        errors: error.issues.map((issue) => ({
          field: issue.path.join("."),
          message: issue.message,
        })),
      });
    }
    return res.status(400).json({
      message: "Invalid request data",
    });
  }
};
