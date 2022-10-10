import { Box, Text, Show, Alert } from '@chakra-ui/react';
import { useQuery } from '@tanstack/react-query';
import React from 'react';

import type { BlockType, BlocksResponse } from 'types/api/block';

import useFetch from 'lib/hooks/useFetch';
import BlocksList from 'ui/blocks/BlocksList';
import BlocksSkeletonMobile from 'ui/blocks/BlocksSkeletonMobile';
import BlocksTable from 'ui/blocks/BlocksTable';
import DataFetchAlert from 'ui/shared/DataFetchAlert';
import Pagination from 'ui/shared/Pagination';
import SkeletonTable from 'ui/shared/SkeletonTable';

interface Props {
  type?: BlockType;
}

const BlocksContent = ({ type }: Props) => {
  const fetch = useFetch();

  const { data, isLoading, isError } = useQuery<unknown, unknown, BlocksResponse>(
    [ 'blocks', type ],
    async() => await fetch(`/api/blocks?type=${ type }`),
  );

  if (isLoading) {
    return (
      <>
        <Show below="lg"><BlocksSkeletonMobile/></Show>
        <Show above="lg">
          <SkeletonTable columns={ [ '124px', '112px', '144px', '64px', '40%', '30%', '30%' ] }/>
        </Show>
      </>
    );
  }

  if (isError) {
    return <DataFetchAlert/>;
  }

  if (data.items.length === 0) {
    return <Alert>There are no blocks.</Alert>;
  }

  return (
    <>
      <Text>Total of 15,044,883 blocks</Text>
      <Show below="lg"><BlocksList data={ data.items }/></Show>
      <Show above="lg"><BlocksTable data={ data.items }/></Show>
      <Box mx={{ base: 0, lg: 6 }} my={{ base: 6, lg: 3 }}>
        <Pagination currentPage={ 1 }/>
      </Box>
    </>
  );
};

export default BlocksContent;
