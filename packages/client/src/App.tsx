import { useState } from "react"
import { WorkspaceHeader } from "@/components/workspace-header"
import { RequestControls } from "@/components/request-controls"
import { RequestEditor } from "@/components/request-editor"
import { ResponseViewer } from "@/components/response-viewer"
import { useAppStore } from "@proxymity/client/src/store/useAppStore"

function App() {
  const [roomId] = useState<string>("example-room-id");
  const [activeUsers] = useState<number>(3);

  const setResponse = useAppStore((state) => state.setResponse);
  const setLoading = useAppStore((state) => state.setLoading);

  const handleSendRequest = async () => {
    const currentRequest = useAppStore.getState().request;
    console.log("Sending request:", currentRequest);
    setLoading(true)
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
      setLoading(false)
    }, 1000)
  }


  return (
    <div className="flex h-screen flex-col bg-background">
      <WorkspaceHeader roomId={roomId} activeUsers={activeUsers} />

      <div className="flex flex-1 flex-col overflow-hidden">
        <RequestControls
          onSend={handleSendRequest}
        />

        <div className="flex flex-1 overflow-hidden">
          <div className="w-1/2 border-r border-border overflow-hidden">
            <RequestEditor/>
          </div>

          <div className="w-1/2 overflow-hidden">
            <ResponseViewer/>
          </div>
        </div>
      </div>
    </div>
  )
}

export default App;