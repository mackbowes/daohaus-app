import React from 'react';
import { Box, Icon, useToast } from '@chakra-ui/react';
import { BsDownload } from 'react-icons/bs';

import { ToolTipWrapper } from '../staticElements/wrappers';
import { useMetaData } from '../contexts/MetaDataContext';
import { downloadFromBrowser, prepCsvData } from '../utils/csv';

const CsvDownloadButton = ({ entityList, typename }) => {
  const toast = useToast();
  const { daoMetaData } = useMetaData();

  const handleDownload = () => {
    const csvArray = prepCsvData(entityList);
    const nowSeconds = (new Date() / 1000).toFixed(0);
    const filename = `${daoMetaData.slug}_${typename}_${nowSeconds}.csv`;
    downloadFromBrowser(csvArray, filename);

    toast({
      title: 'Download complete',
      position: 'top-right',
      status: 'success',
      duration: 3000,
      isClosable: true,
    });
  };

  if (!daoMetaData) {
    return;
  }

  return (
    <Box onClick={handleDownload}>
      <ToolTipWrapper
        tooltip
        tooltipText={{ body: `Download CSV file` }}
        placement='right'
        layoutProps={{
          transform: 'translateY(-2px)',
          display: 'inline-block',
        }}
      >
        <Icon
          transform='translateY(2px)'
          as={BsDownload}
          color='secondary.300'
          ml={2}
          _hover={{ cursor: 'pointer' }}
        />
      </ToolTipWrapper>
    </Box>
  );
};

export default CsvDownloadButton;
