import { LoaderFunction } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import { api } from "convex/_generated/api";
import { useMutation } from "convex/react";
import { useCallback, useEffect, useRef } from "react";
import { convex } from "utils/convex-client";

export const loader: LoaderFunction = async ({ params }) => {
  const data = await convex.query(api.Notes.getById, {
    id: params.lockerId,
  });
  return {
    init_content: data.content,
    lockerId: params.lockerId,
    title: data.title,
  };
};

export default function Locker() {
  const { init_content, lockerId, title } = useLoaderData<typeof loader>();

  const editorRef = useRef<HTMLDivElement>(null);
  const saveData = useMutation(api.Notes.updateLocker);

  // Debounce function to limit how often we save
  const debounce = (func, delay: number) => {
    let timeoutId: NodeJS.Timeout;
    return (...args) => {
      clearTimeout(timeoutId);
      timeoutId = setTimeout(() => func(...args), delay);
    };
  };

  // Debounced save function
  const debouncedSave = useCallback(
    debounce((id, content: string, title: string) => {
      console.log("before save is called to:", title, "with content", content);
      saveData({ id, content });
    }, 500),
    []
  );

  const handleChange = useCallback(() => {
    if (editorRef.current) {
      debouncedSave(lockerId, editorRef.current.innerHTML, title);
    }
  }, [lockerId, debouncedSave]);

  useEffect(() => {
    const editor = editorRef.current;
    if (editor) {
      editor.addEventListener("input", handleChange);
      return () => {
        editor.removeEventListener("input", handleChange);
      };
    }
  }, [handleChange]);

  // Effect to set initial content
  useEffect(() => {
    console.log("init_content of ", title, "is", init_content);
    if (editorRef.current) {
      editorRef.current.innerHTML = init_content;
    }
  }, [init_content]);

  return (
    <div className="flex justify-center items-center h-screen">
      <div ref={editorRef} className="editor" contentEditable="true"></div>
    </div>
  );
}
