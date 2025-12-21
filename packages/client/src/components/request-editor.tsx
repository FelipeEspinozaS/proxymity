import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { KeyValueTable } from "@/components/key-value-table"
import type { IRequestData } from "@proxymity/shared/src/types"


import Editor, { type BeforeMount } from "@monaco-editor/react"

interface RequestEditorProps {
  request: IRequestData
  onRequestChange: (request: IRequestData) => void
}

export function RequestEditor({ request, onRequestChange }: RequestEditorProps) {
    const handleEditorWillMount: BeforeMount = (monaco) => {
    monaco.editor.defineTheme('proxymity-dark', {
      base: 'vs-dark',
      inherit: true,
      rules: [],
      colors: {
        'editor.background': '#00000000', // Transparent background
      }
    });
  }


    return (
    <div className="flex h-full flex-col">
      <Tabs defaultValue="params" className="flex flex-1 flex-col">
        <TabsList className="w-full justify-start rounded-none border-b border-border bg-transparent px-6">
          <TabsTrigger value="params">Params</TabsTrigger>
          <TabsTrigger value="headers">Headers</TabsTrigger>
          <TabsTrigger value="body">Body</TabsTrigger>
        </TabsList>

        <TabsContent value="params" className="flex-1 overflow-auto p-6 mt-0">
          <KeyValueTable
            items={request.queryParams}
            onChange={(queryParams) => onRequestChange({ ...request, queryParams })}
            placeholder="Query Parameter"
          />
        </TabsContent>

        <TabsContent value="headers" className="flex-1 overflow-auto p-6 mt-0">
          <KeyValueTable
            items={request.headers}
            onChange={(headers) => onRequestChange({ ...request, headers })}
            placeholder="Header"
          />
        </TabsContent>

        <TabsContent value="body" className="flex-1 overflow-auto p-6 mt-0">
          <div className="flex h-full flex-col gap-2">
            
            <div className="relative flex-1 rounded-md border border-input bg-transparent shadow-sm focus-within:ring-1 focus-within:ring-ring transition-all overflow-hidden">
              <Editor
                height="100%"
                defaultLanguage="json"
                defaultValue={request.body}
                value={request.body}
                onChange={(value) => onRequestChange({ ...request, body: value || "" })}
                theme="proxymity-dark"
                beforeMount={handleEditorWillMount}
                options={{
                  minimap: { enabled: false },
                  fontSize: 14,
                  lineNumbers: "off",
                  scrollBeyondLastLine: false,
                  automaticLayout: true,
                  tabSize: 2,
                  formatOnPaste: true,
                  formatOnType: true,
                  fontFamily: 'var(--font-mono)',
                  renderLineHighlight: "none",
                  scrollbar: {
                    vertical: "auto",
                    horizontal: "auto",
                    verticalScrollbarSize: 10,
                  },
                  overviewRulerLanes: 0,
                  hideCursorInOverviewRuler: true,
                }}
              />
            </div>
            
            <p className="text-xs text-muted-foreground">
              Supports JSON format with syntax highlighting.
            </p>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}