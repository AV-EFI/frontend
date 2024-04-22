import type { CourseMeta } from '~~/types/course';
import useFetchWithCache from './useFetchWithCache';

export default async () =>
    useFetchWithCache<CourseMeta>('/api/course/meta');