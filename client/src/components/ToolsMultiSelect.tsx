import { useState } from 'react';
import { Check } from 'lucide-react';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';

const AVAILABLE_TOOLS = [
  'Google',
  'Google Calendar',
  'Google Tasks',
  'Google Keep',
  'Zoho Books',
  'Zoho Expenses',
  'Zoho Cliq',
  'Emails',
  'Notes',
  'Notion',
  'MS Office',
  'Excel',
  'Word',
  'Outlook',
  'PowerPoint',
  'Web Browser',
  'Safari',
  'Firefox',
  'Chrome',
  'MS Teams',
  'Canva',
  'Calls/Phone',
  'Meeting with Teams',
  'Meeting with Others',
  'ChatGPT',
  'Gemini'
];

interface ToolsMultiSelectProps {
  selectedTools: string[];
  onToolsChange: (tools: string[]) => void;
}

export default function ToolsMultiSelect({ selectedTools, onToolsChange }: ToolsMultiSelectProps) {
  const [open, setOpen] = useState(false);

  const toggleTool = (tool: string) => {
    if (selectedTools.includes(tool)) {
      onToolsChange(selectedTools.filter(t => t !== tool));
    } else {
      onToolsChange([...selectedTools, tool]);
    }
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          data-testid="button-tools-selector"
          className="w-full justify-between bg-black/30 border-blue-500/40 hover:border-blue-500 hover:bg-black/50"
        >
          <span className="text-muted-foreground">
            {selectedTools.length === 0 ? 'Select tools...' : `${selectedTools.length} tool(s) selected`}
          </span>
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-80 p-0 bg-card/95 backdrop-blur-xl border-blue-500/30" align="start">
        <ScrollArea className="h-72">
          <div className="p-4 space-y-1">
            {AVAILABLE_TOOLS.map((tool) => (
              <div
                key={tool}
                data-testid={`tool-option-${tool.toLowerCase().replace(/[\/\s]/g, '-')}`}
                onClick={() => toggleTool(tool)}
                className="flex items-center gap-2 px-3 py-2 rounded-md cursor-pointer hover-elevate active-elevate-2 transition-colors"
              >
                <div className={`w-4 h-4 rounded border ${
                  selectedTools.includes(tool)
                    ? 'bg-blue-500 border-blue-500'
                    : 'border-blue-500/40'
                } flex items-center justify-center`}>
                  {selectedTools.includes(tool) && (
                    <Check className="h-3 w-3 text-black" />
                  )}
                </div>
                <span className="text-sm text-foreground">{tool}</span>
              </div>
            ))}
          </div>
        </ScrollArea>
      </PopoverContent>
    </Popover>
  );
}
