"use client";

import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface RegistrationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onRegister: (data: { user_id: number }) => void;
}

export function RegistrationModal({ isOpen, onClose, onRegister }: RegistrationModalProps) {
  const [nombre, setNombre] = useState("");
  const [universidad, setUniversidad] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!universidad) return;

    setLoading(true);
    try {
      const response = await fetch("/api/user", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ nombre, universidad }),
      });
      const data = await response.json();
      if (response.ok) {
        onRegister(data);
      }
    } catch (error) {
      console.error("Error registrando usuario:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px] rounded-2xl bg-white border-2 shadow-xl">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-primary">¡Casi listo!</DialogTitle>
          <DialogDescription className="text-lg">
            Dinos quién eres para guardar tu progreso académico.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-6 pt-4">
          <div className="space-y-2">
            <Label htmlFor="name" className="text-sm font-bold uppercase tracking-wider text-muted-foreground">
              Nombre (Opcional)
            </Label>
            <Input
              id="name"
              placeholder="¿Cómo te llamas?"
              value={nombre}
              onChange={(e) => setNombre(e.target.value)}
              className="h-12 rounded-xl border-2 focus-visible:ring-primary"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="university" className="text-sm font-bold uppercase tracking-wider text-muted-foreground">
              Universidad *
            </Label>
            <Input
              id="university"
              placeholder="Tu institución educativa"
              value={universidad}
              onChange={(e) => setUniversidad(e.target.value)}
              required
              className="h-12 rounded-xl border-2 focus-visible:ring-primary"
            />
          </div>
          <DialogFooter>
            <Button type="submit" disabled={loading} className="btn-duo btn-duo-primary w-full h-14 text-lg">
              {loading ? "Registrando..." : "¡Empezar Partida!"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
