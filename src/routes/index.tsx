import { createFileRoute, Link } from "@tanstack/react-router";

import { Editor } from "@monaco-editor/react";

import { DBML_LANGUAGE, getEditorProps } from "@/components/monaco-dbml.components";
import { Button } from "@/components/ui/button";
import { defaultDrizzleSchema } from "@/constants/default-value-drizzle";
import { useClipboard } from "@/hooks/clipboard.hooks";
import { cn } from "@/lib/utils";
import { parseDrizzle } from "@/packages/drizzle-to-dbml/drizzle-to-dbml";
import { Check, Copy } from "lucide-react";
import { useState } from "react";
import { seo } from "@/utils/seo";
import previewWeb from "/preview-web.png?url";

export const Route = createFileRoute("/")({
  component: AddressForm,
  head: () => ({
    meta: seo({
      title: "Drizzle Schema to DBML Converter — Fully Client-Side",
      description:
        "Free online Drizzle ORM schema to DBML converter. Runs fully client-side with no server code. Secure, instant, and private.",
      keywords:
        "drizzle schema converter, drizzle to dbml, dbml tool, drizzle orm, sqlite, postgres, schema generator, client side tool, wasm converter",
      image: previewWeb,
      url: process.env.BASE_URL,
    }),
  }),
});

function AddressForm() {
  const [dbml, setDbml] = useState("");

  function onEditorChange(value: string | undefined) {
    if (!value) {
      return;
    }

    try {
      setDbml(parseDrizzle(value));
    } catch (error) {
      console.error(error);
    }
  }

  const { copyToClipboard, status } = useClipboard();

  const dbDiagramQueryParam = encodeURIComponent(
    btoa(decodeURIComponent(encodeURIComponent(dbml))),
  );

  const dbDiagramLink = `https://dbdiagram.io/embed?c=${dbDiagramQueryParam}`;
  return (
    <div className="flex justify-center min-h-screen bg-slate-900 p-4 text-white">
      <div className="grid grid-cols-2 w-full gap-x-6">
        <MonacoContainer>
          <MonacoHeader>
            <MonacoTitle>JavaScript</MonacoTitle>
          </MonacoHeader>

          <Editor
            {...getEditorProps({
              defaultValue: defaultDrizzleSchema,
              onChange: onEditorChange,
              onMount: (monaco) => {
                onEditorChange(monaco.getValue());
              },
            })}
          />
        </MonacoContainer>

        <MonacoContainer>
          <MonacoHeader className="flex justify-between items-center">
            <MonacoTitle>DBML</MonacoTitle>
            <div className="flex gap-2 items-center">
              <Button
                className="animate-in fade-in duration-500 fade-out"
                onClick={() => copyToClipboard(dbml)}
              >
                {status === "success" || status === "loading" ? (
                  <Check className="animate-in fade-in duration-500 fade-out" />
                ) : (
                  <Copy className="animate-in fade-in duration-500 fade-out" />
                )}
              </Button>
              <Button asChild>
                <Link to={dbDiagramLink} target="_blank" rel="noopener noreferrer">
                  Open in DBDiagram
                </Link>
              </Button>
            </div>
          </MonacoHeader>
          <Editor
            {...getEditorProps({
              value: dbml,
              options: {
                readOnly: true,
              },
              language: DBML_LANGUAGE,
            })}
          />
        </MonacoContainer>
      </div>
    </div>
  );
}

interface MonacoContainerProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
}
function MonacoContainer({ className, ...props }: MonacoContainerProps) {
  return (
    <div
      className={cn(
        "border border-gray-700 grid row-span-2 grid-rows-subgrid rounded h-full",
        className,
      )}
      {...props}
    />
  );
}

function MonacoTitle({ children }: { children: React.ReactNode }) {
  return <h2 className="text-white font-semibold">{children}</h2>;
}

interface MonacoHeaderProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
}
function MonacoHeader({ className, ...props }: MonacoHeaderProps) {
  return (
    <div className={cn("bg-gray-800 px-4 py-2 border-b border-gray-700", className)} {...props} />
  );
}
