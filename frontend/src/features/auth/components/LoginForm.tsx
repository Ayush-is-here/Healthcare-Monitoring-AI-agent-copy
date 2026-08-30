import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

import { PillButton } from "@/components/primitives/PillButton";
import { TextField } from "@/components/primitives/TextField";
import { useLogin } from "@/features/auth/hooks/useLogin";

const formSchema = z.object({
  email: z.string().min(1, "Enter your email").email("Enter a valid email"),
  password: z.string().min(1, "Enter your password"),
});

type FormValues = z.infer<typeof formSchema>;

export function LoginForm() {
  const login = useLogin();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: { email: "", password: "" },
  });

  const onSubmit = handleSubmit((values) => login.mutate(values));

  return (
    <form onSubmit={onSubmit} className="flex flex-col gap-5" noValidate>
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
        autoComplete="current-password"
        placeholder="••••••••"
        error={errors.password?.message ?? null}
        {...register("password")}
      />

      {login.error ? (
        <p role="alert" className="type-body-sm text-critical">
          {login.error.message}
        </p>
      ) : null}

      <PillButton
        type="submit"
        size="lg"
        disabled={login.isPending}
        className="w-full"
      >
        {login.isPending ? "Signing in…" : "Sign in"}
      </PillButton>
    </form>
  );
}
