import { Indexer, RPC } from '@ckb-lumos/lumos';
import type { Chain, RpcUrl } from './chains';
import type { ChainProvider } from './providers/type';

export function configureChains<TChain extends Chain = Chain>(defaultChains: TChain[], providers: ChainProvider[]) {
  const chains: TChain[] = [];
  const rpcUrls: Record<string, RpcUrl> = {};

  for (const chain of defaultChains) {
    for (const provider of providers) {
      const apiConfig = provider(chain);

      if (!apiConfig) {
        continue;
      }

      if (!chains.some(({ name }) => name === chain.name)) {
        chains.push(chain);
      }

      rpcUrls[chain.name] = apiConfig.rpcUrl;
    }
  }

  const getActiveChain = (name: string) => {
    const activeChain = chains.find((chain) => chain.name === name) ?? defaultChains[0];
    if (!activeChain) {
      // TOEO: throw error
      return;
    }
    return activeChain;
  };

  const rpcClient = ({ name }: { name: string }) => {
    const activeChain = getActiveChain(name);
    const rpcNodeUrl = rpcUrls[activeChain!.name]!.node;
    return new RPC(rpcNodeUrl);
  };

  const indexer = ({ name }: { name: string }) => {
    const activeChain = getActiveChain(name);
    const indexerUrl = rpcUrls[activeChain!.name]!.indexer;
    return new Indexer(indexerUrl);
  };

  return {
    chains,
    rpcClient,
    indexer,
  };
}
