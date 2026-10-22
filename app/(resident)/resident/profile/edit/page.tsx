"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { ArrowLeft, UserPen } from "lucide-react";
import { PageContainer, PageHeader } from "@/components/layout/PageHeader";
import { Field, FormError, Input, Spinner, primaryButtonClass, secondaryButtonClass } from "@/components/ui/form";
import { fetchCurrentUser, updateCurrentUser } from "@/features/users/actions";
import { profileSchema, type ProfileFormValues } from "@/features/users/schemas";

export default function EditResidentProfile() {
  const router = useRouter();
  const {
    register,
    handleSubmit,
    reset,
    setError,
    formState: { errors, isSubmitting, isDirty },
  } = useForm<ProfileFormValues>({
    resolver: zodResolver(profileSchema),
    defaultValues: { name: "", lastname: "", phone: "", email: "" },
  });

  const [dni, setDni] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);

  useEffect(() => {
    (async () => {
      const result = await fetchCurrentUser();
      if (result.ok) {
        const user = result.data;
        reset({ name: user.name, lastname: user.lastname, phone: user.phone, email: user.email });
        setDni(user.dni);
      } else {
        setLoadError(result.error);
      }
      setLoading(false);
    })();
  }, [reset]);

  const onSubmit = async (values: ProfileFormValues) => {
    const result = await updateCurrentUser(values);
    if (!result.ok) {
      setError("root", { message: result.error });
      return;
    }
    toast.success("Perfil actualizado.");
    router.push("/resident/profile");
    router.refresh();
  };

  return (
    <PageContainer size="narrow">
      <PageHeader
        icon={<UserPen size={24} aria-hidden />}
        title="Editar perfil"
        description="Actualizá tus datos de contacto."
        actions={
          <Link href="/resident/profile" className={secondaryButtonClass}>
            <ArrowLeft size={18} aria-hidden /> Volver
          </Link>
        }
      />

      {loading ? (
        <p className="animate-pulse text-muted-foreground">Cargando tus datos…</p>
      ) : loadError ? (
        <FormError message={loadError} />
      ) : (
        <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-5 rounded-3xl border border-border bg-card p-6 shadow-sm sm:p-8">
          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="Nombre" required error={errors.name?.message}>
              {({ id, describedBy, invalid }) => <Input id={id} aria-describedby={describedBy} invalid={invalid} autoComplete="given-name" {...register("name")} />}
            </Field>
            <Field label="Apellido" required error={errors.lastname?.message}>
              {({ id, describedBy, invalid }) => <Input id={id} aria-describedby={describedBy} invalid={invalid} autoComplete="family-name" {...register("lastname")} />}
            </Field>
          </div>
          <Field label="Email" required error={errors.email?.message}>
            {({ id, describedBy, invalid }) => <Input id={id} type="email" aria-describedby={describedBy} invalid={invalid} autoComplete="email" {...register("email")} />}
          </Field>
          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="Teléfono" required error={errors.phone?.message} hint="Solo números, sin espacios.">
              {({ id, describedBy, invalid }) => <Input id={id} inputMode="tel" aria-describedby={describedBy} invalid={invalid} autoComplete="tel" {...register("phone")} />}
            </Field>
            <Field label="DNI" hint="Lo modifica la administración.">
              {({ id, describedBy }) => <Input id={id} aria-describedby={describedBy} value={dni ?? ""} disabled readOnly />}
            </Field>
          </div>

          <FormError message={errors.root?.message} />

          <div className="flex flex-col-reverse gap-3 pt-2 sm:flex-row sm:justify-end">
            <Link href="/resident/profile" className={secondaryButtonClass}>
              Cancelar
            </Link>
            <button type="submit" disabled={isSubmitting || !isDirty} className={primaryButtonClass}>
              {isSubmitting ? (
                <>
                  <Spinner /> Guardando…
                </>
              ) : (
                "Guardar cambios"
              )}
            </button>
          </div>
        </form>
      )}
    </PageContainer>
  );
}
