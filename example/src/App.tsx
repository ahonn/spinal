import { Text, Card, Container, Flex, Tab, TabList, TabPanel, TabPanels, Tabs } from '@chakra-ui/react';
import React, { useMemo, useState } from 'react';
import { useConfig } from '@spinal-ckb/react';
// @ts-ignore
import WalletPanel from './WalletPanel.tsx';
// @ts-ignore
import { CONNECTORS } from './consts.tsx';

function App() {
  const [tabIndex, setTabIndex] = useState(0);
  const config = useConfig();
  const colorScheme = useMemo(() => CONNECTORS[tabIndex].colorScheme, [tabIndex]);

  const onChangeTab = (index: number) => {
    setTabIndex(index);
    const { connector } = CONNECTORS[index];
    config?.setActiveConnector(connector);
  };

  return (
    <Flex backgroundColor={`${colorScheme}.50`} minHeight="100vh" alignItems="center">
      <Container>
        <Text fontSize="sm" color="gray.500" marginBottom={2}>
          {`<SpinalExample />`}
        </Text>
        <Card minHeight="420px">
          <Tabs colorScheme={colorScheme} onChange={onChangeTab} isFitted>
            <TabList>
              {CONNECTORS.map(({ name }) => (
                <Tab key={name}>{name}</Tab>
              ))}
            </TabList>
            <TabPanels>
              {CONNECTORS.map(({ name, colorScheme, connector, features }) => (
                <TabPanel key={name}>
                  <WalletPanel colorScheme={colorScheme} connector={connector} features={features} />
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
