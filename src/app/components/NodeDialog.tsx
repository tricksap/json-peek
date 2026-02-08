import {
    Dialog,
    DialogContent,
} from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { useNodeDialogStore } from '../store/useNodeDialogStore';

export function NodeDialog() {
    const { open, setOpen, selectedNode } = useNodeDialogStore();

    const valueObj = getNodeValue(selectedNode)

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogContent className="sm:max-w-md">
                <div className="grid gap-4">
                    <div className="grid gap-3">
                        <Label htmlFor="name-1">Content</Label>
                        <pre className="rounded-md bg-muted p-4 overflow-auto text-sm">
                            <code className="font-mono">
                                {valueObj ? renderJson(valueObj) : ''}
                            </code>
                        </pre>
                    </div>
                    <div className="grid gap-3">
                        <Label htmlFor="username-1">Path</Label>
                        <pre className="rounded-md bg-muted p-4 overflow-auto text-sm">
                            <code className="font-mono">
                                {JSON.stringify(selectedNode?.data?.fullPath, null, 2)}
                            </code>
                        </pre>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    )
}

function getNodeValue(node: any) {
    let valueObj: any = undefined;

    if (node?.data) {
        let label = node.data.label;
        let parsedLabel: any = undefined;
        if (typeof label === 'string' && (label.trim().startsWith('{') || label.trim().startsWith('['))) {
            parsedLabel = JSON.parse(label);
        } else if (typeof label === 'string' && label.includes(':')) {
            // Try to parse as key: value
            const match = label.match(/^\s*([\w-]+)\s*:\s*(.*)$/);
            if (match) {
                parsedLabel = { [match[1]]: JSON.parse(match[2]) };
            }
        }
        valueObj = parsedLabel;
    }
    return valueObj || null;
}

function renderJson(obj: any) {
    if (!obj) return

    if (obj === null) return <span className="text-muted-foreground">null</span>;
    if (typeof obj !== 'object') return <span>{String(obj)}</span>;
    if (Array.isArray(obj)) {
        return (
            <>
                [
                <div style={{ paddingLeft: 16 }}>
                    {obj.map((item, i) => (
                        <div key={i}>{renderJson(item)}{i < obj.length - 1 ? ',' : ''}</div>
                    ))}
                </div>
                ]
            </>
        );
    }
    return (
        <>
            {'{'}
            <div style={{ paddingLeft: 16 }}>
                {Object.entries(obj).map(([k, v], i, arr) => (
                    <div key={k}>
                        <span className="text-primary font-semibold">{k}</span>: {renderJson(v)}{i < arr.length - 1 ? ',' : ''}
                    </div>
                ))}
            </div>
            {'}'}
        </>
    );
}