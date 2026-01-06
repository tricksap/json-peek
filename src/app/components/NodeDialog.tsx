import {
    Dialog,
    DialogContent,
} from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { useNodeDialogStore } from '../store/useNodeDialogStore';

export function NodeDialog() {
    const { open, setOpen, selectedNode } = useNodeDialogStore();

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogContent className="sm:max-w-md">
                <div className="grid gap-4">
                    <div className="grid gap-3">
                        <Label htmlFor="name-1">Content</Label>
                        <pre className="rounded-md bg-muted p-4 overflow-auto text-sm">
                            <code className="font-mono">
                                {JSON.stringify(selectedNode?.data?.label, null, 2)}
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
