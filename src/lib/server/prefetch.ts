'use server';

import { FetchQueryOptions } from '@tanstack/react-query';

import getQueryServer from './reactQueryServer';

type QueryMap<T, V> = {
  options: FetchQueryOptions<T, V>;
};
type QueryMappedTupleTypes = [T: unknown, V: unknown][];
// Map array/tuple according to: https://github.com/Microsoft/TypeScript/pull/26063
type QueryMappedTuple<Types extends QueryMappedTupleTypes> = {
  [P in keyof Types]: QueryMap<Types[P][0], Types[P][1]>;
};

export const prefetchMultiple = async <Types extends QueryMappedTupleTypes>(
  queries: QueryMappedTuple<[...Types]>,
) => {
  const queryClient = await getQueryServer();
  const promises: Promise<void>[] = [];
  for (const { options } of queries) {
    promises.push(queryClient.prefetchQuery(options));
  }

  await Promise.all(promises);

  return queryClient;
};

export const prefetch = async <T, V>(options: FetchQueryOptions<T, V>) => {
  const queryClient = await getQueryServer();

  await queryClient.prefetchQuery(options);

  return queryClient;
};
