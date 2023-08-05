import * as yup from "yup";

export const oneTimeJobSchemaCreate = yup.object().shape({
  code: yup.string().required(),
  timeoutMilliSeconds: yup.number().positive().integer().required(),
  userId: yup.number().required(),
});
