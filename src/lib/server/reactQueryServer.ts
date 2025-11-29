import { QueryClient } from '@tanstack/react-query';
import { cache } from 'react';

const getQueryServer = cache(() => new QueryClient());
export default getQueryServer;
