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
import { getCalculatorById, updateCalculatorById } from 'apiSdk/calculators';
import { Error } from 'components/error';
import { calculatorValidationSchema } from 'validationSchema/calculators';
import { CalculatorInterface } from 'interfaces/calculator';
import useSWR from 'swr';
import { useRouter } from 'next/router';
import { AsyncSelect } from 'components/async-select';
import { ArrayFormField } from 'components/array-form-field';
import { AccessOperationEnum, AccessServiceEnum, requireNextAuth, withAuthorization } from '@roq/nextjs';
import { compose } from 'lib/compose';
import { OrganizationInterface } from 'interfaces/organization';
import { getOrganizations } from 'apiSdk/organizations';

function CalculatorEditPage() {
  const router = useRouter();
  const id = router.query.id as string;
  const { data, error, isLoading, mutate } = useSWR<CalculatorInterface>(
    () => (id ? `/calculators/${id}` : null),
    () => getCalculatorById(id),
  );
  const [formError, setFormError] = useState(null);

  const handleSubmit = async (values: CalculatorInterface, { resetForm }: FormikHelpers<any>) => {
    setFormError(null);
    try {
      const updated = await updateCalculatorById(id, values);
      mutate(updated);
      resetForm();
      router.push('/calculators');
    } catch (error) {
      setFormError(error);
    }
  };

  const formik = useFormik<CalculatorInterface>({
    initialValues: data,
    validationSchema: calculatorValidationSchema,
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
            Edit Calculator
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
            <FormControl id="parameters" mb="4" isInvalid={!!formik.errors?.parameters}>
              <FormLabel>Parameters</FormLabel>
              <Input type="text" name="parameters" value={formik.values?.parameters} onChange={formik.handleChange} />
              {formik.errors.parameters && <FormErrorMessage>{formik.errors?.parameters}</FormErrorMessage>}
            </FormControl>
            <FormControl id="results" mb="4" isInvalid={!!formik.errors?.results}>
              <FormLabel>Results</FormLabel>
              <Input type="text" name="results" value={formik.values?.results} onChange={formik.handleChange} />
              {formik.errors.results && <FormErrorMessage>{formik.errors?.results}</FormErrorMessage>}
            </FormControl>
            <AsyncSelect<OrganizationInterface>
              formik={formik}
              name={'organization_id'}
              label={'Select Organization'}
              placeholder={'Select Organization'}
              fetcher={getOrganizations}
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
    entity: 'calculator',
    operation: AccessOperationEnum.UPDATE,
  }),
)(CalculatorEditPage);
