import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { PillButton } from "@/components/primitives/PillButton";
import { ProfileFields } from "@/features/profile/components/ProfileFields";
import { useCreateProfile } from "@/features/profile/hooks/useCreateProfile";
import {
  EMPTY_PROFILE_FORM,
  profileFormSchema,
  toProfilePayload,
  type ProfileFormValues,
} from "@/features/profile/profileFormSchema";

/** Onboarding. Every field is required, so nothing is optional here. */
export function ProfileForm() {
  const createProfile = useCreateProfile();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ProfileFormValues>({
    resolver: zodResolver(profileFormSchema),
    defaultValues: EMPTY_PROFILE_FORM,
  });

  const onSubmit = handleSubmit((values) =>
    createProfile.mutate(toProfilePayload(values)),
  );

  return (
    <form onSubmit={onSubmit} className="flex flex-col gap-5" noValidate>
      <ProfileFields register={register} errors={errors} />

      {createProfile.error ? (
        <p role="alert" className="type-body-sm text-critical">
          {createProfile.error.message}
        </p>
      ) : null}

      <PillButton
        type="submit"
        size="lg"
        disabled={createProfile.isPending}
        className="w-full"
      >
        {createProfile.isPending ? "Saving…" : "Continue"}
      </PillButton>
    </form>
  );
}
