"use client";

import * as React from "react";
import { Plus } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  POST_STATUS_LABELS,
  POST_STATUS_ORDER,
  POST_TYPE_LABELS,
  type Post,
  type PostStatus,
  type PostType,
} from "./types";

const POST_TYPE_ORDER: PostType[] = ["reel", "carousel", "story"];

interface NewPostDialogProps {
  onCreate: (post: Omit<Post, "id" | "createdAt">) => void;
}

export function NewPostDialog({ onCreate }: NewPostDialogProps) {
  const [open, setOpen] = React.useState(false);
  const [caption, setCaption] = React.useState("");
  const [type, setType] = React.useState<PostType>("reel");
  const [status, setStatus] = React.useState<PostStatus>("idea");
  const [scheduledDate, setScheduledDate] = React.useState("");
  const [error, setError] = React.useState<string | null>(null);

  function resetForm() {
    setCaption("");
    setType("reel");
    setStatus("idea");
    setScheduledDate("");
    setError(null);
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!caption.trim()) {
      setError("El caption no puede estar vacío.");
      return;
    }
    onCreate({
      caption: caption.trim(),
      type,
      status,
      scheduledDate: scheduledDate || null,
    });
    resetForm();
    setOpen(false);
  }

  return (
    <Dialog
      open={open}
      onOpenChange={(next) => {
        setOpen(next);
        if (!next) resetForm();
      }}
    >
      <DialogTrigger asChild>
        <Button className="gap-1.5">
          <Plus className="h-4 w-4" />
          Nueva publicación
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Nueva publicación</DialogTitle>
          <DialogDescription>
            Agrega una publicación al tablero del Gestor de Instagram.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div className="flex flex-col gap-2">
            <Label htmlFor="caption">Caption</Label>
            <Textarea
              id="caption"
              placeholder="Escribe el texto de la publicación..."
              value={caption}
              onChange={(e) => setCaption(e.target.value)}
              rows={4}
            />
            {error && <p className="text-xs text-destructive">{error}</p>}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="flex flex-col gap-2">
              <Label>Tipo de publicación</Label>
              <Select value={type} onValueChange={(v) => setType(v as PostType)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {POST_TYPE_ORDER.map((value) => (
                    <SelectItem key={value} value={value}>
                      {POST_TYPE_LABELS[value]}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="flex flex-col gap-2">
              <Label>Estado</Label>
              <Select
                value={status}
                onValueChange={(v) => setStatus(v as PostStatus)}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {POST_STATUS_ORDER.map((value) => (
                    <SelectItem key={value} value={value}>
                      {POST_STATUS_LABELS[value]}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="flex flex-col gap-2">
            <Label htmlFor="scheduledDate">Fecha programada (opcional)</Label>
            <Input
              id="scheduledDate"
              type="date"
              value={scheduledDate}
              onChange={(e) => setScheduledDate(e.target.value)}
            />
          </div>

          <DialogFooter>
            <Button type="submit">Agregar publicación</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
