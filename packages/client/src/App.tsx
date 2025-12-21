import { useState } from "react"
import { WorkspaceHeader } from "@/components/workspace-header"
import { RequestControls } from "@/components/request-controls"
import { RequestEditor } from "@/components/request-editor"
import { ResponseViewer } from "@/components/response-viewer"
import type { IRequestData, IResponseData } from "@proxymity/shared/src/types"

function App() {
  const [roomId] = useState<string>("example-room-id");
  const [activeUsers] = useState<number>(3);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const [request, setRequest] = useState<IRequestData>({
    method: "GET",
    url: "https://api.example.com/users",
    headers: [],
    queryParams: [],
    body: "",
  })

  const [response, setResponse] = useState<IResponseData | null>(null)

  const handleSendRequest = async () => {
    setIsLoading(true)
    // Simulate API call
    setTimeout(() => {
      setResponse({
        status: 200,
        statusText: "OK",
        data: {
          users: [
            { id: 1, name: "John Doe", email: "john@example.com" },
            { id: 2, name: "Jane Smith", email: "jane@example.com" },
          ],
        },
        headers: {
          "content-type": "application/json",
          "cache-control": "no-cache",
        },
        time: 145,
        size: 2048,
        timestamp: Date.now(),
      })
      setIsLoading(false)
    }, 1000)
  }


  return (
    <div className="flex h-screen flex-col bg-background">
      <WorkspaceHeader roomId={roomId} activeUsers={activeUsers} />

      <div className="flex flex-1 flex-col overflow-hidden">
        <RequestControls
          request={request}
          onRequestChange={setRequest}
          onSend={handleSendRequest}
          isLoading={isLoading}
        />

        <div className="flex flex-1 overflow-hidden">
          <div className="w-1/2 border-r border-border overflow-hidden">
            <RequestEditor request={request} onRequestChange={setRequest} />
          </div>

          <div className="w-1/2 overflow-hidden">
            <ResponseViewer response={response} isLoading={isLoading} />
          </div>
        </div>
      </div>
    </div>
  )
}

export default App;