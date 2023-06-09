import { z } from "zod";

export const SAMPLE_FORM = {
  FORM_1: [
    {
      type: "select",
      placeholder: "Select",
      options: [
        { name: "a", value: "A" },
        { name: "b", value: "B" },
      ],
      label: "Select",
      name: "select Test",
      placeholder: "Select",
      validation: z.string(),
    },
    {
      type: "text",
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
      type: "checkbox",
      label: "Show Message",
      name: "showMessage",
      validation: z.boolean(),
    },
    {
      type: "text",
      label: "Message",
      name: "Message",
      placeholder: "Enter your Message",
      showIf: "showMessage",
      validation: z.string(),
    },
    {
      type: "checkbox",
      label: "Show dates",
      name: "showDates",
      validation: z.boolean(),
    },
    {
      type: "block",
      name: "dates",

      validation: z.object({
        startingDate: z.coerce.date(),
        isEndingDate: z.boolean(),
        endingDate: z.coerce.date(),
        selectGender: z.enum(["M"]),
      }),
      data: [
        {
          showIf: "showDates",
          type: "date",
          label: "Starting Date",
          name: "startingDate",
        },
        {
          type: "checkbox",
          label: "Is Ending Date",
          name: "isEndingDate",
        },
        {
          showIf: "dates.isEndingDate",
          type: "date",
          label: "Ending Date",
          name: "endingDate",
        },
        {
          type: "select",
          placeholder: "Select",
          options: [
            { name: "male", value: "M" },
            { name: "female", value: "F" },
          ],
          label: "Select",
          name: "selectGender",
          placeholder: "Select",
        },
      ],
    },
    {
      type: "array",
      name: "students",
      validation: z
        .array(
          z
            .object({
              firstName: z.string().min(2),
              age: z.coerce.number().optional(),
              showAge: z.boolean().default(false),
              selectGender: z.enum(["M", "F"]),
            })
            .refine(
              (e) => {
                return e.showAge ? e.age > 18 : true;
              },
              {
                path: ["age"],
                message: "Age should be greater than 18",
              }
            )
        )
        .min(1),
      data: [
        {
          type: "select",
          options: [
            { name: "male", value: "M" },
            { name: "female", value: "F" },
          ],
          label: "Select",
          name: "selectGender",
        },
        {
          type: "text",
          label: "Name",
          name: "firstName",
        },
        {
          name: "showAge",
          type: "checkbox",
          label: "show age",
        },
        {
          type: "number",
          label: "age",
          name: "age",
          showIf: "showAge",
        },
      ],
    },
  ],
};
