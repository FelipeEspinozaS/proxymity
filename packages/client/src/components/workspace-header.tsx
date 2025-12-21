import { Users } from "lucide-react"
import { Badge } from "@/components/ui/badge"

interface WorkspaceHeaderProps {
	roomId: string;
	activeUsers: number;
}

export function WorkspaceHeader({ roomId, activeUsers }: WorkspaceHeaderProps) {
	return (
		<header className="flex items-center justify-between border-b border-border bg-card px-6 py-3">
			<div className="flex items-center gap-4">
				<h1 className="text-xl font-semibold text-foreground">Proxymity</h1>
				<Badge variant="secondary" className="font-mono text-xs rounded-md">
				{roomId}
				</Badge>
			</div>

			<div className="flex items-center gap-2">
				<div className="flex items-center gap-2 rounded-md bg-emerald-500/10 px-3 py-1.5">
				<div className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
				<Users className="h-4 w-4 text-emerald-500" />
				<span className="text-sm font-medium text-emerald-500">{activeUsers}</span>
				</div>
			</div>
		</header>
	)
}