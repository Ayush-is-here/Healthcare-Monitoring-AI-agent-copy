import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";

import { PillButton } from "@/components/primitives/PillButton";
import { ProfileFields } from "@/features/profile/components/ProfileFields";
import { useUpdateProfile } from "@/features/profile/hooks/useUpdateProfile";
import {
  profileFormSchema,
  toProfileFormValues,
  toProfilePatch,
  type ProfileFormValues,
} from "@/features/profile/profileFormSchema";
import type { PatientProfile } from "@/features/profile/types";

export interface ProfileEditFormProps {
  profile: PatientProfile;
}

/**
 * Editing an existing profile.
 *
 * Save stays disabled until something actually changes, and only the
 * changed fields are sent — a PATCH that carries untouched values
 * would silently rewrite them.
 */
export function ProfileEditForm({ profile }: ProfileEditFormProps) {
  const updateProfile = useUpdateProfile();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, dirtyFields, isDirty },
  } = useForm<ProfileFormValues>({
    resolver: zodResolver(profileFormSchema),
    defaultValues: toProfileFormValues(profile),
  });

  const onSubmit = handleSubmit((values) =>
    updateProfile.mutate(toProfilePatch(values, dirtyFields), {
      onSuccess: (saved) => {
        /* Re-baseline against what the server stored, so the form is
           clean again and a second save cannot resend a field that
           already landed. */
        reset(toProfileFormValues(saved));
        toast.success("Profile updated.");
      },
    }),
  );

  return (
    <form onSubmit={onSubmit} className="flex flex-col gap-5" noValidate>
      <ProfileFields register={register} errors={errors} />

      {updateProfile.error ? (
        <p role="alert" className="type-body-sm text-critical">
          {updateProfile.error.message}
        </p>
      ) : null}

      <PillButton
        type="submit"
        size="lg"
        disabled={!isDirty || updateProfile.isPending}
        className="w-full"
      >
        {updateProfile.isPending ? "Saving…" : "Save changes"}
      </PillButton>
    </form>
  );
}
