"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../ui/form";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { useRouter } from "next/navigation";

const talentSelectionFormSchema = z.object({
  email: z.string().min(1, "Add at least one email address."),
});

type TalentSelectionFormValues = z.infer<typeof talentSelectionFormSchema>;

// This can come from your database or API.
const defaultValues: Partial<TalentSelectionFormValues> = {
  email: "",
};

export function TalentSelectionForm() {
  const form = useForm<TalentSelectionFormValues>({
    resolver: zodResolver(talentSelectionFormSchema),
    defaultValues,
    mode: "onChange",
  });

  const router = useRouter();

  function onSubmit(data: TalentSelectionFormValues) {
    console.log(JSON.stringify(data, null, 2));

    router.push("/present-talent");
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email addresses</FormLabel>
              <FormControl>
                <Input placeholder="" {...field} />
              </FormControl>
              <FormDescription className="text-gray-100">
                A comma separated list of email addresses for talent
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button type="submit" variant="secondary">
          Submit
        </Button>
      </form>
    </Form>
  );
}
