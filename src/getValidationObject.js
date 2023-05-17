import { z } from "zod";

export const getValidationObject = (formName) => {
  let validaitonObj = {};

  formName.map((e) => {
    validaitonObj[e.name] = e.validation;
  });
  return z.object(validaitonObj);
};
