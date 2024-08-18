import { ConvexClient } from "convex/browser";

const convex = new ConvexClient(process.env.CONVEX_URL!);

export { convex };
