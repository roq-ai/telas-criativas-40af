import * as yup from 'yup';

export const artworkValidationSchema = yup.object().shape({
  name: yup.string().required(),
  description: yup.string().required(),
  dimensions: yup.string().required(),
  materials: yup.string().required(),
  artist_background: yup.string().required(),
  price: yup.number().integer().required(),
  vendor_id: yup.string().nullable(),
});
