import * as yup from 'yup';

export const complaintValidationSchema = yup.object().shape({
  description: yup.string().required(),
  status: yup.string().required(),
  user_id: yup.string().nullable().required(),
  booking_id: yup.string().nullable().required(),
});
