import { Box, Center, Flex, Link, List, ListItem, Spinner, Stack, Text, Image, Button } from '@chakra-ui/react';
import Breadcrumbs from 'components/breadcrumb';
import { Error } from 'components/error';
import { FormListItem } from 'components/form-list-item';
import { FormWrapper } from 'components/form-wrapper';
import AppLayout from 'layout/app-layout';
import NextLink from 'next/link';
import { useRouter } from 'next/router';
import { FunctionComponent, useState, useMemo } from 'react';
import parseISO from 'date-fns/parseISO';
import format from 'date-fns/format';
import { routes } from 'routes';
import { compose } from 'lib/compose';
import {
  AccessOperationEnum,
  AccessServiceEnum,
  requireNextAuth,
  useAuthorizationApi,
  withAuthorization,
} from '@roq/nextjs';
import { UserPageTable } from 'components/user-page-table';
import { EntityImage } from 'components/entity-image';
import { FiEdit2 } from 'react-icons/fi';
import { convertQueryToPrismaUtil } from 'lib/utils';
import * as RoqTypes from 'lib/roq/types';
import { useBookingFindFirst, useRoqClient } from 'lib/roq';

import { BookingInterface } from 'interfaces/booking';
import { ComplaintListPage } from 'pages/complaints';
import { ReviewListPage } from 'pages/reviews';

function BookingViewPage() {
  const { hasAccess } = useAuthorizationApi();
  const router = useRouter();
  const id = router.query.id as string;
  const roqClient = useRoqClient();
  const queryParams = useMemo<{ include: { user: boolean; car: boolean } }>(
    () =>
      convertQueryToPrismaUtil(
        {
          relations: ['user', 'car'],
          id,
        },
        'booking',
      ),
    [id],
  );
  const { data, error, isLoading } = useBookingFindFirst(queryParams, {}, { disabled: !id });

  const [deleteError, setDeleteError] = useState(null);
  const [createError, setCreateError] = useState(null);

  return (
    <AppLayout
      breadcrumbs={
        <Breadcrumbs
          items={[
            {
              label: 'Bookings',
              link: '/bookings',
            },
            {
              label: 'Booking Details',
              isCurrent: true,
            },
          ]}
        />
      }
    >
      <Box rounded="md">
        {error && (
          <Box mb={4}>
            <Error error={error} />
          </Box>
        )}
        {isLoading ? (
          <Center>
            <Spinner />
          </Center>
        ) : (
          <>
            <FormWrapper wrapperProps={{ border: 'none', gap: 3, p: 0 }}>
              <Flex alignItems="center" w="full" justifyContent={'space-between'}>
                <Box>
                  <Text
                    sx={{
                      fontSize: '1.875rem',
                      fontWeight: 700,
                      color: 'base.content',
                    }}
                  >
                    Booking Details
                  </Text>
                </Box>
                {hasAccess('booking', AccessOperationEnum.UPDATE, AccessServiceEnum.PROJECT) && (
                  <NextLink href={`/bookings/edit/${id}`} passHref legacyBehavior>
                    <Button
                      onClick={(e) => e.stopPropagation()}
                      mr={2}
                      padding="0rem 0.5rem"
                      height="24px"
                      fontSize="0.75rem"
                      variant="outline"
                      color="state.info.main"
                      borderRadius="6px"
                      border="1px"
                      borderColor="state.info.transparent"
                      leftIcon={<FiEdit2 width="12px" height="12px" color="state.info.main" />}
                    >
                      Edit
                    </Button>
                  </NextLink>
                )}
              </Flex>

              <List
                w="100%"
                css={{
                  '> li:not(:last-child)': {
                    borderBottom: '1px solid var(--chakra-colors-base-300)',
                  },
                }}
              >
                <FormListItem
                  label="Start Time"
                  text={data?.start_time ? format(data?.start_time, 'dd-MM-yyyy') : ''}
                />

                <FormListItem label="End Time" text={data?.end_time ? format(data?.end_time, 'dd-MM-yyyy') : ''} />

                <FormListItem label="Pickup Location" text={data?.pickup_location} />

                <FormListItem label="Dropoff Location" text={data?.dropoff_location} />

                <FormListItem
                  label="Created At"
                  text={data?.created_at ? format(data?.created_at, 'dd-MM-yyyy') : ''}
                />

                <FormListItem
                  label="Updated At"
                  text={data?.updated_at ? format(data?.updated_at, 'dd-MM-yyyy') : ''}
                />

                {hasAccess('user', AccessOperationEnum.READ, AccessServiceEnum.PROJECT) && (
                  <FormListItem
                    label="User"
                    text={
                      <Link as={NextLink} href={`/users/view/${data?.user?.id}`}>
                        {data?.user?.email + ''}
                      </Link>
                    }
                  />
                )}
                {hasAccess('car', AccessOperationEnum.READ, AccessServiceEnum.PROJECT) && (
                  <FormListItem
                    label="Car"
                    text={
                      <Link as={NextLink} href={`/cars/view/${data?.car?.id}`}>
                        {data?.car?.model + ''}
                      </Link>
                    }
                  />
                )}
              </List>
            </FormWrapper>

            <Box borderRadius="10px" border="1px" borderColor={'base.300'} mt={6} p={'18px'}>
              <ComplaintListPage
                filters={{ booking_id: id }}
                hidePagination={true}
                hideTableBorders={true}
                showSearchFilter={false}
                pageSize={5}
                titleProps={{
                  fontSize: '1.5rem',
                  fontWeight: 600,
                }}
              />
            </Box>

            <Box borderRadius="10px" border="1px" borderColor={'base.300'} mt={6} p={'18px'}>
              <ReviewListPage
                filters={{ booking_id: id }}
                hidePagination={true}
                hideTableBorders={true}
                showSearchFilter={false}
                pageSize={5}
                titleProps={{
                  fontSize: '1.5rem',
                  fontWeight: 600,
                }}
              />
            </Box>
          </>
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
    entity: 'booking',
    operation: AccessOperationEnum.READ,
  }),
)(BookingViewPage);
