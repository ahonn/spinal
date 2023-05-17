import {
  Text,
  Box,
  Button,
  Flex,
  Stat,
  StatLabel,
  StatNumber,
  Divider,
  FormControl,
  FormLabel,
  Input,
  NumberInput,
  NumberInputField,
  NumberInputStepper,
  NumberIncrementStepper,
  NumberDecrementStepper,
  useToast,
  useClipboard,
  Link,
} from '@chakra-ui/react';
import { CopyIcon } from '@chakra-ui/icons';
import { useConnect, useCapacities, useSendTransaction, Connector } from '@spinal-ckb/react';
import React, { useMemo, useCallback } from 'react';

export interface IWalletPanelProps {
  connector: Connector;
  colorScheme: string;
}

export default function WalletPanel(props: IWalletPanelProps) {
  const { connector, colorScheme } = props;
  const toast = useToast();
  const { onCopy, setValue } = useClipboard('');
  const [transferTo, setTransferTo] = React.useState('');
  const [amount, setAmount] = React.useState(0);
  const { connect, connected, address } = useConnect({ connector });
  const { balance } = useCapacities();

  const onSuccess = useCallback(
    (txHash: string) => {
      toast({
        title: 'Transaction sended.',
        description: (
          <Link textDecorationStyle="solid" href={`https://pudge.explorer.nervos.org/transaction/${txHash}`} isExternal>
            {txHash}
          </Link>
        ),
        status: 'success',
        duration: 3000,
        isClosable: true,
      });
      setTransferTo('');
      setAmount(0);
    },
    [toast],
  );

  const { isLoading, sendTransaction } = useSendTransaction({
    to: transferTo,
    amount,
    onSuccess,
  });

  React.useEffect(() => {
    setValue(address);
  }, [address, setValue]);

  const displayAddress = useMemo(() => {
    if (!address) {
      return '';
    }
    const len = address.length;
    return address!.substring(0, 20) + '...' + address.substring(len - 21, len - 1);
  }, [address]);

  return (
    <Box>
      <Box height="20">
        {connected ? (
          <Box>
            <Flex marginBottom={2}>
              <Flex
                alignItems="center"
                paddingX={2}
                borderWidth={1}
                borderRadius="md"
                backgroundColor={`${colorScheme}.100`}
                borderColor={`${colorScheme}.300`}
              >
                <Text fontSize="sm" color="gray.800" marginRight={1}>
                  Address: {displayAddress}
                </Text>
                <CopyIcon
                  cursor="pointer"
                  color="gray.800"
                  onClick={() => {
                    onCopy();
                    toast({ description: 'Copied!' });
                  }}
                />
              </Flex>
            </Flex>
            <Flex>
              <Stat>
                <StatLabel>Balance</StatLabel>
                <StatNumber>{balance} CKB</StatNumber>
              </Stat>
            </Flex>
          </Box>
        ) : (
          <Button colorScheme={colorScheme} onClick={() => connect()}>
            Connect
          </Button>
        )}
      </Box>
      <Divider marginY="2" />
      <Box>
        <Flex marginBottom="2">
          <Text fontSize="xl" fontWeight="semibold">
            Send Transaction
          </Text>
        </Flex>
        <FormControl marginBottom="2">
          <FormLabel>Transfer to:</FormLabel>
          <Input type="text" value={transferTo} onChange={(e) => setTransferTo(e.target.value)} />
        </FormControl>
        <FormControl marginBottom="3">
          <FormLabel>Amount</FormLabel>
          <NumberInput
            max={parseInt(balance, 10)}
            min={0}
            value={amount ?? 0}
            onChange={(str, val) => {
              if (str === '') {
                setAmount(0);
                return;
              }
              setAmount(val);
            }}
          >
            <NumberInputField />
            <NumberInputStepper>
              <NumberIncrementStepper />
              <NumberDecrementStepper />
            </NumberInputStepper>
          </NumberInput>
        </FormControl>
        <Button
          colorScheme={colorScheme}
          onClick={() => transferTo && amount && sendTransaction()}
          isLoading={isLoading}
        >
          Submit
        </Button>
      </Box>
    </Box>
  );
}
