"use client";

import * as React from "react";
import { Plus } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface AddCompetitorDialogProps {
  onAdd: (handle: string) => void;
}

export function AddCompetitorDialog({ onAdd }: AddCompetitorDialogProps) {
  const [open, setOpen] = React.useState(false);
  const [handle, setHandle] = React.useState("");
  const [error, setError] = React.useState<string | null>(null);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!handle.trim()) {
      setError("Escribí un handle, por ejemplo @competidor.");
      return;
    }
    onAdd(handle);
    setHandle("");
    setError(null);
    setOpen(false);
  }

  return (
    <Dialog
      open={open}
      onOpenChange={(next) => {
        setOpen(next);
        if (!next) {
          setHandle("");
          setError(null);
        }
      }}
    >
      <DialogTrigger asChild>
        <Button className="gap-1.5">
          <Plus className="h-4 w-4" />
          Agregar competidor
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Agregar competidor</DialogTitle>
          <DialogDescription>
            Agregá el handle de Instagram que querés seguir. Las estadísticas son
            de ejemplo por ahora.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div className="flex flex-col gap-2">
            <Label htmlFor="handle">Handle</Label>
            <Input
              id="handle"
              placeholder="@competidor"
              value={handle}
              onChange={(e) => setHandle(e.target.value)}
            />
            {error && <p className="text-xs text-destructive">{error}</p>}
          </div>
          <DialogFooter>
            <Button type="submit">Agregar</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
