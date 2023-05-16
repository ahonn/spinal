import { MutationOptions } from '@tanstack/query-core';

export type WithMutationArgs<T, R> = T &
  Pick<MutationOptions<R, undefined, T, undefined>, 'onSuccess' | 'onError' | 'onSettled'>;
