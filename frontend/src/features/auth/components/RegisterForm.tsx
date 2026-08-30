import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

import { PillButton } from "@/components/primitives/PillButton";
import { TextField } from "@/components/primitives/TextField";
import { useRegister } from "@/features/auth/hooks/useRegister";

/* Mirrors the server contract in app/schemas/user.py so the caller
   sees the constraint before a round trip, not after a 422. */
const formSchema = z.object({
  name: z
    .string()
    .min(3, "Use at least 3 characters")
    .max(100, "Use 100 characters or fewer"),
  email: z.string().min(1, "Enter your email").email("Enter a valid email"),
  password: z
    .string()
    .min(8, "Use at least 8 characters")
    .max(72, "Use 72 characters or fewer"),
});

type FormValues = z.infer<typeof formSchema>;

export function RegisterForm() {
  const registerAccount = useRegister();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: { name: "", email: "", password: "" },
  });

  const onSubmit = handleSubmit((values) => registerAccount.mutate(values));

  return (
    <form onSubmit={onSubmit} className="flex flex-col gap-5" noValidate>
      <TextField
        label="Name"
        type="text"
        autoComplete="name"
        placeholder="Your full name"
        error={errors.name?.message ?? null}
        {...register("name")}
      />

      <TextField
        label="Email"
        type="email"
        autoComplete="email"
        placeholder="you@example.com"
        error={errors.email?.message ?? null}
        {...register("email")}
      />

      <TextField
        label="Password"
        type="password"
        autoComplete="new-password"
        placeholder="At least 8 characters"
        error={errors.password?.message ?? null}
        {...register("password")}
      />

      {registerAccount.error ? (
        <p role="alert" className="type-body-sm text-critical">
          {registerAccount.error.message}
        </p>
      ) : null}

      <PillButton
        type="submit"
        size="lg"
        disabled={registerAccount.isPending}
        className="w-full"
      >
        {registerAccount.isPending ? "Creating account…" : "Create account"}
      </PillButton>
    </form>
  );
}
