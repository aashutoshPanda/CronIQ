import * as yup from "yup";
import cronParser from "cron-parser";

const commonSchema = {
  code: yup.string().required(),
  timeoutMilliSeconds: yup.number().positive().integer().required(),
  cron: yup
    .string()
    .required()
    .test("valid-cron", "Invalid cron string", (value) => {
      try {
        cronParser.parseExpression(value);
        return true;
      } catch (error) {
        return false;
      }
    }),
  endTime: yup.date().required().min(new Date(), "End time should be greater than current time"),
};

export const cronJobSchemaCreate = yup.object().shape({
  code: yup.string().required(),
  timeoutMilliSeconds: yup.number().positive().integer().required(),
  cron: yup
    .string()
    .required()
    .test("valid-cron", "Invalid cron string", (value) => {
      try {
        cronParser.parseExpression(value);
        return true;
      } catch (error) {
        return false;
      }
    }),
  endTime: yup.date().required().min(new Date(), "End time should be greater than current time"),
  userId: yup.number().required(),
});

export const cronJobSchemaUpdate = yup.object().shape({
  code: yup.string(),
  timeoutMilliSeconds: yup.number().positive().integer(),
  cron: yup.string().test("valid-cron", "Invalid cron string", (value) => {
    try {
      if (value && cronParser.parseExpression(value)) {
        return false;
      }
      return true;
    } catch (error) {
      return false;
    }
  }),
  endTime: yup.date().min(new Date(), "End time should be greater than current time"),
  userId: yup.number().required(),
});
