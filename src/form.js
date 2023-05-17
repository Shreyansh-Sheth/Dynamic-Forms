import { z } from "zod";

export const SAMPLE_FORM = {
  FORM_1: [
    {
      type: "number",
      label: "First Name",
      name: "firstName",
      placeholder: "Enter your first name",
      validation: z.string().min(3, { message: "min 3" }),
    },
    {
      type: "text",
      label: "Last Name",
      name: "lastName",
      placeholder: "Enter your last name",
      validation: z.string().min(3, { message: "min 3" }),
    },
    {
      type: "array",
      name: "p",
      validation: z.array(
        z.object({
          name: z.string().min(2),
        })
      ),
      data: [
        {
          type: "text",
          label: "Name",
          name: "name",
        },
      ],
    },
    {
      type: "array",
      name: "students",
      validation: z
        .array(
          z.object({
            firstName: z.string().min(2),
            age: z.coerce.number().min(18),
          })
        )
        .min(1),
      data: [
        {
          type: "text",
          label: "Name",
          name: "firstName",
        },
        {
          type: "text",
          label: "age",
          name: "age",
        },
      ],
    },
  ],
};
