import { Play, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import type { HttpMethod } from "@proxymity/shared/src/types"
import { useAppStore } from "@proxymity/client/src/store/useAppStore"

interface RequestControlsProps {
  onSend: () => void
}

const METHOD_COLORS: Record<HttpMethod, string> = {
  GET: "text-blue-500",
  POST: "text-emerald-500",
  PUT: "text-amber-500",
  DELETE: "text-red-500",
  PATCH: "text-purple-500",
}


export function RequestControls({ onSend }: RequestControlsProps) {
  const url = useAppStore((state) => state.request.url);
  const method = useAppStore((state) => state.request.method);
  const isLoading = useAppStore((state) => state.isLoading);
  const setUrl = useAppStore((state) => state.setUrl);
  const setMethod = useAppStore((state) => state.setMethod);

  return (
    <div className="flex items-center gap-3 border-b border-border bg-card/50 px-6 py-4">
      <Select
        value={method}
        onValueChange={(value: HttpMethod) => setMethod(value)}
      >
        <SelectTrigger className={`w-32 font-semibold ${METHOD_COLORS[method]}`}>
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          {
            Object.keys(METHOD_COLORS).map((method) => (
              <SelectItem
                key={method}
                value={method}
                className={`font-semibold ${METHOD_COLORS[method as HttpMethod]}`}
              >
                {method}
              </SelectItem>
            ))
          }
        </SelectContent>
      </Select>

      <Input
        type="url"
        placeholder="https://api.example.com/endpoint"
        value={url}
        onChange={(e) => setUrl(e.target.value)}
        className="flex-1 font-mono text-sm"
      />

      <Button onClick={onSend} disabled={isLoading} className="gap-2 min-w-28" size="default">
        {isLoading ? (
          <Loader2 className="h-4 w-4 animate-spin" /> // Spinner girando
        ) : (
          <Play className="h-4 w-4" /> // Play normal
        )}
        {isLoading ? "Sending..." : "Send"}
      </Button>
    </div>
  )
}