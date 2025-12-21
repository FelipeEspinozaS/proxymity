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
  GET: "text-blue-500 bg-blue-500/10",
  POST: "text-emerald-500 bg-emerald-500/10",
  PUT: "text-amber-500 bg-amber-500/10",
  DELETE: "text-red-500 bg-red-500/10",
  PATCH: "text-purple-500 bg-purple-500/10",
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
          <SelectItem value="GET" className="font-semibold text-blue-500">
            GET
          </SelectItem>
          <SelectItem value="POST" className="font-semibold text-emerald-500">
            POST
          </SelectItem>
          <SelectItem value="PUT" className="font-semibold text-amber-500">
            PUT
          </SelectItem>
          <SelectItem value="DELETE" className="font-semibold text-red-500">
            DELETE
          </SelectItem>
          <SelectItem value="PATCH" className="font-semibold text-purple-500">
            PATCH
          </SelectItem>
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