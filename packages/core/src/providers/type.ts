import type { Chain, RpcUrl } from 'src/chains';

export type ChainProvider<TChain extends Chain = Chain> = (chain: TChain) => {
  chain: TChain;
  rpcUrl: RpcUrl;
} | null;
