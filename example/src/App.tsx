import { Text, Card, Container, Flex, Tab, TabList, TabPanel, TabPanels, Tabs } from '@chakra-ui/react';
import React, { useMemo, useState } from 'react';
// @ts-ignore
import WalletPanel from './WalletPanel.tsx';
import { MetamaskConnector, NexusConnector, useConfig } from '@spinal-ckb/react';

const TABS = [
  {
    name: 'MetaMask',
    colorScheme: 'orange',
    connector: new MetamaskConnector(),
  },
  {
    name: 'Nexus',
    colorScheme: 'purple',
    connector: new NexusConnector(),
  },
];

function App() {
  const [tabIndex, setTabIndex] = useState(0);
  const config = useConfig();
  const colorScheme = useMemo(() => TABS[tabIndex].colorScheme, [tabIndex]);

  const onChangeTab = (index: number) => {
    setTabIndex(index);
    const { connector } = TABS[index];
    config?.setActiveConnector(connector);
  };

  return (
    <Flex backgroundColor={`${colorScheme}.50`} minHeight="100vh" alignItems="center">
      <Container>
        <Text fontSize="sm" color="gray.500" marginBottom={2}>
          {`<SpinalExample />`}
        </Text>
        <Card>
          <Tabs colorScheme={colorScheme} onChange={onChangeTab} isFitted>
            <TabList>
              {TABS.map(({ name }) => (
                <Tab key={name}>{name}</Tab>
              ))}
            </TabList>
            <TabPanels>
              {TABS.map(({ name, colorScheme, connector }) => (
                <TabPanel key={name}>
                  <WalletPanel colorScheme={colorScheme} connector={connector} />
                </TabPanel>
              ))}
            </TabPanels>
          </Tabs>
        </Card>
      </Container>
    </Flex>
  );
}

export default App;
