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
  Center,
} from '@chakra-ui/react';
import * as yup from 'yup';
import DatePicker from 'react-datepicker';
import { FiEdit3 } from 'react-icons/fi';
import { useFormik, FormikHelpers } from 'formik';
import { getArtworkById, updateArtworkById } from 'apiSdk/artworks';
import { Error } from 'components/error';
import { artworkValidationSchema } from 'validationSchema/artworks';
import { ArtworkInterface } from 'interfaces/artwork';
import useSWR from 'swr';
import { useRouter } from 'next/router';
import { AsyncSelect } from 'components/async-select';
import { ArrayFormField } from 'components/array-form-field';
import { AccessOperationEnum, AccessServiceEnum, requireNextAuth, withAuthorization } from '@roq/nextjs';
import { compose } from 'lib/compose';
import { VendorInterface } from 'interfaces/vendor';
import { getVendors } from 'apiSdk/vendors';

function ArtworkEditPage() {
  const router = useRouter();
  const id = router.query.id as string;
  const { data, error, isLoading, mutate } = useSWR<ArtworkInterface>(
    () => (id ? `/artworks/${id}` : null),
    () => getArtworkById(id),
  );
  const [formError, setFormError] = useState(null);

  const handleSubmit = async (values: ArtworkInterface, { resetForm }: FormikHelpers<any>) => {
    setFormError(null);
    try {
      const updated = await updateArtworkById(id, values);
      mutate(updated);
      resetForm();
      router.push('/artworks');
    } catch (error) {
      setFormError(error);
    }
  };

  const formik = useFormik<ArtworkInterface>({
    initialValues: data,
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
            Edit Artwork
          </Text>
        </Box>
        {error && (
          <Box mb={4}>
            <Error error={error} />
          </Box>
        )}
        {formError && (
          <Box mb={4}>
            <Error error={formError} />
          </Box>
        )}
        {isLoading || (!formik.values && !error) ? (
          <Center>
            <Spinner />
          </Center>
        ) : (
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
              {formik.errors.artist_background && (
                <FormErrorMessage>{formik.errors?.artist_background}</FormErrorMessage>
              )}
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
        )}
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
    operation: AccessOperationEnum.UPDATE,
  }),
)(ArtworkEditPage);
