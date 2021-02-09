import React from 'react';
import { Link as RouterLink } from 'react-router-dom';
import { Box, Button, Icon, Spinner, Stack, Link } from '@chakra-ui/react';
import { RiExternalLinkLine, RiErrorWarningLine } from 'react-icons/ri';

import TextBox from './TextBox';
import { POPUP_CONTENT } from '../content/pending-tx-modal';
import { txUri } from '../utils/chain';

const SummonPending = ({ txHash, success, chainId }) => {
  return (
    <Box
      rounded='lg'
      bg='blackAlpha.600'
      borderWidth='1px'
      borderColor='whiteAlpha.200'
      p={6}
      m={[10, 'auto', 0, 'auto']}
      w='50%'
      textAlign='center'
    >
      {success ? (
        <>
          <Box fontSize='3xl' fontFamily='heading' fontWeight={700} mb={10}>
            {POPUP_CONTENT.summonMoloch.successText}
          </Box>
          <Button as={RouterLink} to={`/register/${chainId}/${success}`}>
            CONFIGURE DAO
          </Button>
        </>
      ) : (
        <>
          <Box fontSize='3xl' fontFamily='heading' fontWeight={700} mb={10}>
            {POPUP_CONTENT.summonMoloch.header}
          </Box>
          {!success ? <Spinner mb={10} /> : null}
          {POPUP_CONTENT.summonMoloch.bodyText.map((text, idx) => (
            <Box fontSize='lg' mb={5} fontWeight={700} key={idx}>
              {text}{' '}
            </Box>
          ))}
          <Stack spacing='4px' mb={5}>
            {POPUP_CONTENT.summonMoloch.links.map((link, idx) =>
              link.external ? (
                <TextBox as={Link} key={idx} href={link.href}>
                  {link.text} <Icon as={RiExternalLinkLine} />
                </TextBox>
              ) : (
                <TextBox as={RouterLink} key={idx} to={link.href}>
                  {link.text} <Icon as={RiErrorWarningLine} />
                </TextBox>
              ),
            )}
          </Stack>

          {txHash ? (
            <Link
              href={`${txUri(chainId)}/${txHash}`}
              isExternal
              fontSize='2xl'
              color='secondary.500'
            >
              View Transaction <Icon as={RiExternalLinkLine} />
            </Link>
          ) : null}

          <Box fontSize='sm' mb={10} mt={5}>
            {POPUP_CONTENT.summonMoloch.waitingText}
          </Box>
          <Button as={RouterLink} to='/'>
            GO TO HUB
          </Button>
        </>
      )}
    </Box>
  );
};

export default SummonPending;
