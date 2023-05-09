import type { Chain } from 'src/chains';
import type { ChainProvider } from './type';

export function publicProvider<
  TChain extends Chain = Chain,
>(): ChainProvider<TChain> {
  return function (chain: TChain) {
    if (!chain.rpcUrls.public) {
      return null;
    }

    return {
      chain,
      rpcUrl: chain.rpcUrls.public,
    };
  };
}
