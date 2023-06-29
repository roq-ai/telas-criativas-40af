import AppLayout from 'layout/app-layout';
import React, { useState } from 'react';
import {
  FormControl,
  FormLabel,
  Input,
  Button,
  Text,
  Box,
  Spinner,
  FormErrorMessage,
  Switch,
  NumberInputStepper,
  NumberDecrementStepper,
  NumberInputField,
  NumberIncrementStepper,
  NumberInput,
} from '@chakra-ui/react';
import { useFormik, FormikHelpers } from 'formik';
import * as yup from 'yup';
import DatePicker from 'react-datepicker';
import { FiEdit3 } from 'react-icons/fi';
import { useRouter } from 'next/router';
import { createArtwork } from 'apiSdk/artworks';
import { Error } from 'components/error';
import { artworkValidationSchema } from 'validationSchema/artworks';
import { AsyncSelect } from 'components/async-select';
import { ArrayFormField } from 'components/array-form-field';
import { AccessOperationEnum, AccessServiceEnum, requireNextAuth, withAuthorization } from '@roq/nextjs';
import { compose } from 'lib/compose';
import { VendorInterface } from 'interfaces/vendor';
import { getVendors } from 'apiSdk/vendors';
import { ArtworkInterface } from 'interfaces/artwork';

function ArtworkCreatePage() {
  const router = useRouter();
  const [error, setError] = useState(null);

  const handleSubmit = async (values: ArtworkInterface, { resetForm }: FormikHelpers<any>) => {
    setError(null);
    try {
      await createArtwork(values);
      resetForm();
      router.push('/artworks');
    } catch (error) {
      setError(error);
    }
  };

  const formik = useFormik<ArtworkInterface>({
    initialValues: {
      name: '',
      description: '',
      dimensions: '',
      materials: '',
      artist_background: '',
      price: 0,
      vendor_id: (router.query.vendor_id as string) ?? null,
    },
    validationSchema: artworkValidationSchema,
    onSubmit: handleSubmit,
    enableReinitialize: true,
    validateOnChange: false,
    validateOnBlur: false,
  });

  return (
    <AppLayout>
      <Box bg="white" p={4} rounded="md" shadow="md">
        <Box mb={4}>
          <Text as="h1" fontSize="2xl" fontWeight="bold">
            Create Artwork
          </Text>
        </Box>
        {error && (
          <Box mb={4}>
            <Error error={error} />
          </Box>
        )}
        <form onSubmit={formik.handleSubmit}>
          <FormControl id="name" mb="4" isInvalid={!!formik.errors?.name}>
            <FormLabel>Name</FormLabel>
            <Input type="text" name="name" value={formik.values?.name} onChange={formik.handleChange} />
            {formik.errors.name && <FormErrorMessage>{formik.errors?.name}</FormErrorMessage>}
          </FormControl>
          <FormControl id="description" mb="4" isInvalid={!!formik.errors?.description}>
            <FormLabel>Description</FormLabel>
            <Input type="text" name="description" value={formik.values?.description} onChange={formik.handleChange} />
            {formik.errors.description && <FormErrorMessage>{formik.errors?.description}</FormErrorMessage>}
          </FormControl>
          <FormControl id="dimensions" mb="4" isInvalid={!!formik.errors?.dimensions}>
            <FormLabel>Dimensions</FormLabel>
            <Input type="text" name="dimensions" value={formik.values?.dimensions} onChange={formik.handleChange} />
            {formik.errors.dimensions && <FormErrorMessage>{formik.errors?.dimensions}</FormErrorMessage>}
          </FormControl>
          <FormControl id="materials" mb="4" isInvalid={!!formik.errors?.materials}>
            <FormLabel>Materials</FormLabel>
            <Input type="text" name="materials" value={formik.values?.materials} onChange={formik.handleChange} />
            {formik.errors.materials && <FormErrorMessage>{formik.errors?.materials}</FormErrorMessage>}
          </FormControl>
          <FormControl id="artist_background" mb="4" isInvalid={!!formik.errors?.artist_background}>
            <FormLabel>Artist Background</FormLabel>
            <Input
              type="text"
              name="artist_background"
              value={formik.values?.artist_background}
              onChange={formik.handleChange}
            />
            {formik.errors.artist_background && <FormErrorMessage>{formik.errors?.artist_background}</FormErrorMessage>}
          </FormControl>
          <FormControl id="price" mb="4" isInvalid={!!formik.errors?.price}>
            <FormLabel>Price</FormLabel>
            <NumberInput
              name="price"
              value={formik.values?.price}
              onChange={(valueString, valueNumber) =>
                formik.setFieldValue('price', Number.isNaN(valueNumber) ? 0 : valueNumber)
              }
            >
              <NumberInputField />
              <NumberInputStepper>
                <NumberIncrementStepper />
                <NumberDecrementStepper />
              </NumberInputStepper>
            </NumberInput>
            {formik.errors.price && <FormErrorMessage>{formik.errors?.price}</FormErrorMessage>}
          </FormControl>
          <AsyncSelect<VendorInterface>
            formik={formik}
            name={'vendor_id'}
            label={'Select Vendor'}
            placeholder={'Select Vendor'}
            fetcher={getVendors}
            renderOption={(record) => (
              <option key={record.id} value={record.id}>
                {record?.name}
              </option>
            )}
          />
          <Button isDisabled={formik?.isSubmitting} colorScheme="blue" type="submit" mr="4">
            Submit
          </Button>
        </form>
      </Box>
    </AppLayout>
  );
}

export default compose(
  requireNextAuth({
    redirectTo: '/',
  }),
  withAuthorization({
    service: AccessServiceEnum.PROJECT,
    entity: 'artwork',
    operation: AccessOperationEnum.CREATE,
  }),
)(ArtworkCreatePage);
