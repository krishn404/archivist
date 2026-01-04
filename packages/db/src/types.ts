import type { InferSelectModel } from "drizzle-orm";
import * as schema from "./schema";


export type User = InferSelectModel<typeof schema.user>;