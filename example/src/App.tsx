import { Card, Container, Flex, Tab, TabList, TabPanel, TabPanels, Tabs } from '@chakra-ui/react';
import React, { useMemo, useState } from 'react';
// @ts-ignore
import WalletPanel from './WalletPanel.tsx';
import { MetamaskConnector, NexusConnector } from '@spinal-ckb/react';

function App() {
  const [tabIndex, setTabIndex] = useState(0);
  const colorScheme = useMemo(() => (tabIndex === 0 ? 'orange' : 'purple'), [tabIndex]);
  const metamaskConnector = useMemo(() => new MetamaskConnector(), []);
  const nexusConnector = useMemo(() => new NexusConnector(), []);

  return (
    <Flex backgroundColor={`${colorScheme}.50`} minHeight="100vh" alignItems="center">
      <Container>
        <Card>
          <Tabs colorScheme={colorScheme} onChange={(index) => setTabIndex(index)} isFitted>
            <TabList>
              <Tab>MetaMask</Tab>
              <Tab>Nexus</Tab>
            </TabList>
            <TabPanels>
              <TabPanel>
                <WalletPanel colorScheme={colorScheme} connector={metamaskConnector} />
              </TabPanel>
              <TabPanel>
                <WalletPanel colorScheme={colorScheme} connector={nexusConnector} />
              </TabPanel>
            </TabPanels>
          </Tabs>
        </Card>
      </Container>
    </Flex>
  );
}

export default App;
