import { ActionFunction, json, redirect } from "@remix-run/node";
import { api } from "convex/_generated/api";
import { Id } from "convex/_generated/dataModel";
import { convex } from "utils/convex-client";

export const action: ActionFunction = async ({ request }) => {
  const formData = await request.formData();
  const id = formData.get("id");

  if (typeof id !== "string") {
    return json({ error: "Invalid ID" }, { status: 400 });
  }

  try {
    await convex.mutation(api.Notes.deleteLocker, {
      id: id as Id<"Notes">,
    });
    return redirect("/lockers");
  } catch (error) {
    return json({ error: error.message }, { status: 500 });
  }
};
