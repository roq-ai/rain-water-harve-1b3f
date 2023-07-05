import * as yup from 'yup';

export const calculatorValidationSchema = yup.object().shape({
  parameters: yup.string().required(),
  results: yup.string().required(),
  organization_id: yup.string().nullable(),
});
