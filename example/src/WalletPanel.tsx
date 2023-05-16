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
} from '@chakra-ui/react';
import { useConnect, useCapacities, useSendTransaction, Connector } from '@spinal-ckb/react';
import React, { useMemo, useCallback } from 'react';

export interface IWalletPanelProps {
  connector: Connector;
  colorScheme: string;
}

export default function WalletPanel(props: IWalletPanelProps) {
  const { connector, colorScheme } = props;
  const toast = useToast();
  const [transferTo, setTransferTo] = React.useState('');
  const [amount, setAmount] = React.useState(0);
  const { connect, connected, address } = useConnect({ connector });
  const { balance } = useCapacities();

  const onSuccess = useCallback((txHash) => {
    toast({
      title: 'Transaction sended.',
      description: `Transaction hash: ${txHash}`,
      status: 'success',
      duration: 3000,
      isClosable: true,
    });
  }, [toast]);

  const { isLoading, sendTransaction } = useSendTransaction({
    to: transferTo,
    amount,
    onSuccess,
  });

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
            <Flex>
              <Text fontSize="sm" color="gray.500">
                {displayAddress}
              </Text>
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
        <Button colorScheme={colorScheme} onClick={() => sendTransaction()} isLoading={isLoading}>
          Submit
        </Button>
      </Box>
    </Box>
  );
}
