import type { ActionFunction } from "@remix-run/node";
import {
  Form,
  json,
  NavLink,
  Outlet,
  redirect,
  useFetcher,
  useNavigation,
} from "@remix-run/react";
import { api } from "convex/_generated/api";
import { useQuery } from "convex/react";
import { useEffect, useRef } from "react";
import { convex } from "utils/convex-client";
import { SiderButton, siderButtonList } from "~/data";
import DeleteIcon from "~/icons/deleteIcon.svg?react";

export const action: ActionFunction = async ({ request }) => {
  const formData = await request.formData();
  const title = formData.get("title");

  if (typeof title !== "string" || title.length === 0) {
    return json({ error: "Title is required" }, { status: 400 });
  }

  try {
    const id = await convex.mutation(api.Notes.createLocker, { title });
    return redirect(`/lockers/${id}`);
  } catch (error) {
    if (error instanceof Error) {
      return json({ error: error.message }, { status: 500 });
    }
    return json({ error: "An unknown error occurred" }, { status: 500 });
  }
};

export default function Index() {
  const data = useQuery(api.Notes.get);
  const inputRef = useRef<HTMLInputElement>(null);
  const navigation = useNavigation();
  const isSubmitting = navigation.state === "submitting";
  const deleteFetcher = useFetcher();

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if ((event.metaKey || event.ctrlKey) && event.key === "k") {
        event.preventDefault();
        inputRef.current?.focus();
      }
    };

    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, []);

  useEffect(() => {
    if (navigation.state === "idle" && inputRef.current) {
      inputRef.current.value = "";
    }
  }, [navigation.state]);

  return (
    <div className="h-full flex">
      {/* side 1 */}
      <div className="sider-1">
        {siderButtonList.buttons.map((button: SiderButton) => (
          <div className="btn-sider-1" key={button.systemName}>
            {button.displayName}
          </div>
        ))}
      </div>
      {/* side 2 */}
      <div className="sider-2">
        <Form method="post" className="flex">
          <input
            placeholder="cmd + k"
            ref={inputRef}
            className="input-sider-2"
            type="text"
            name="title"
            disabled={isSubmitting}
          />
          <button className="btn-sider-2" type="submit">
            {isSubmitting ? "..." : "+"}
          </button>
        </Form>
        {data === undefined
          ? "loading..."
          : data.map(({ _id, title }) => (
              <div
                className={`flex justify-between btn-sider-2 
              ${
                deleteFetcher.state === "submitting" &&
                deleteFetcher.formData?.get("id") === _id
                  ? "opacity-50"
                  : ""
              }
              `}
                key={_id}
              >
                <NavLink
                  className={({ isActive, isPending }) =>
                    isActive ? "underline" : isPending ? "opacity-50" : ""
                  }
                  to={`/lockers/${_id}`}
                >
                  {title}
                </NavLink>
                <deleteFetcher.Form method="post" action="/delete-locker">
                  <input type="hidden" name="id" value={_id} />
                  <button
                    type="submit"
                    disabled={deleteFetcher.state === "submitting"}
                  >
                    <DeleteIcon width={20} height={20} />
                  </button>
                </deleteFetcher.Form>
              </div>
            ))}
      </div>
      {/* content */}
      <div className="content">
        <Outlet />
      </div>
    </div>
  );
}
