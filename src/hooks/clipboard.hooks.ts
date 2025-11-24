import { useRef, useState } from "react";

type StatusCliboard = "idle" | "loading" | "success" | "error";

const STATUS_TIMEOUT = 1500;
export function useClipboard() {
  const [status, setStatus] = useState<StatusCliboard>("idle");

  const timeoutId = useRef<NodeJS.Timeout>(null);

  async function copyToClipboard(text: string) {
    if (timeoutId.current) {
      clearTimeout(timeoutId.current);
    }

    try {
      setStatus("loading");
      await navigator.clipboard.writeText(text);
      setStatus("success");
    } catch {
      setStatus("error");
    } finally {
      timeoutId.current = setTimeout(() => {
        setStatus("idle");
      }, STATUS_TIMEOUT);
    }
  }

  return { status, copyToClipboard };
}
