import { useState } from 'react';
import ToolsMultiSelect from '../ToolsMultiSelect';

export default function ToolsMultiSelectExample() {
  const [tools, setTools] = useState<string[]>([]);
  
  return (
    <div className="p-8 bg-background">
      <ToolsMultiSelect selectedTools={tools} onToolsChange={setTools} />
      <div className="mt-4">
        <p className="text-foreground">Selected: {tools.join(', ') || 'None'}</p>
      </div>
    </div>
  );
}
