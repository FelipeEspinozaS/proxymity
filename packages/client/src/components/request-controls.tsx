import { Play } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import type { IRequestData, HttpMethod } from "@proxymity/shared/src/types"

interface RequestControlsProps {
  request: IRequestData
  onRequestChange: (request: IRequestData) => void
  onSend: () => void
  isLoading: boolean
}

const METHOD_COLORS: Record<HttpMethod, string> = {
  GET: "text-blue-500",
  POST: "text-emerald-500",
  PUT: "text-amber-500",
  DELETE: "text-red-500",
  PATCH: "text-purple-500",
}

export function RequestControls({ request, onRequestChange, onSend, isLoading }: RequestControlsProps) {
  return (
    <div className="flex items-center gap-3 border-b border-border bg-card/50 px-6 py-4">
      <Select
        value={request.method}
        onValueChange={(value: HttpMethod) => onRequestChange({ ...request, method: value })}
      >
        <SelectTrigger className={`w-32 font-semibold ${METHOD_COLORS[request.method]}`}>
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
        value={request.url}
        onChange={(e) => onRequestChange({ ...request, url: e.target.value })}
        className="flex-1 font-mono text-sm"
      />

      <Button onClick={onSend} disabled={isLoading} className="gap-2" size="default">
        <Play className="h-4 w-4" />
        {isLoading ? "Sending..." : "Send"}
      </Button>
    </div>
  )
}