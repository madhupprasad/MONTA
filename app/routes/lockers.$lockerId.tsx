import { LoaderFunction } from "@remix-run/node";
import { useLoaderData, useParams } from "@remix-run/react";
import { api } from "convex/_generated/api";
import { useMutation } from "convex/react";
import { useCallback, useEffect, useRef, useState } from "react";
import { convex } from "utils/convex-client";

export const loader: LoaderFunction = async ({ params }) => {
  const data = await convex.query(api.Notes.getById, {
    id: params.lockerId,
  });
  return { init_content: data.content };
};

export default function Locker() {
  const { init_content } = useLoaderData<typeof loader>();
  const editorRef = useRef<HTMLDivElement>(null);
  const [content, setContent] = useState(init_content);
  const saveData = useMutation(api.Notes.updateLocker);
  const { lockerId } = useParams();

  const handleChange = useCallback(() => {
    if (editorRef.current) {
      setContent(editorRef.current.innerHTML);
    }
  }, []);

  useEffect(() => {
    const editor = editorRef.current;
    if (editor) {
      editor.addEventListener("input", handleChange);
      return () => {
        editor.removeEventListener("input", handleChange);
      };
    }
  }, [handleChange]);

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
    debounce((content: string) => {
      console.log("Saving content:", content);
      //   save
      saveData({ id: lockerId, content });
    }, 500),
    []
  );

  // Effect to trigger save when content changes
  useEffect(() => {
    debouncedSave(content);
  }, [content, debouncedSave]);

  // Effect to set initial content
  useEffect(() => {
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
