import type { IconifyIcon } from '@iconify/types';

export const filmDiamondIcons: Record<string, IconifyIcon> = {
    movie: {
        body: '<path fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2zm4-2v16m8-16v16M4 8h4m-4 8h4m-4-4h16m-4-4h4m-4 8h4"/>',
        width: 24,
        height: 24,
    },
    video: {
        body: '<path fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="m15 10l4.553-2.276A1 1 0 0 1 21 8.618v6.764a1 1 0 0 1-1.447.894L15 14zM3 8a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/>',
        width: 24,
        height: 24,
    },
    'device-tv': {
        body: '<path fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 9a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2zm13-6l-4 4l-4-4"/>',
        width: 24,
        height: 24,
    },
    headphones: {
        body: '<g fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2"><path d="M4 15a2 2 0 0 1 2-2h1a2 2 0 0 1 2 2v3a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2zm11 0a2 2 0 0 1 2-2h1a2 2 0 0 1 2 2v3a2 2 0 0 1-2 2h-1a2 2 0 0 1-2-2z"/><path d="M4 15v-3a8 8 0 0 1 16 0v3"/></g>',
        width: 24,
        height: 24,
    },
    'database-heart': {
        body: '<g fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2"><path d="M4 6c0 1.657 3.582 3 8 3s8-1.343 8-3s-3.582-3-8-3s-8 1.343-8 3"/><path d="M4 6v6c0 1.453 2.755 2.665 6.414 2.941M20 11V6"/><path d="M4 12v6c0 1.579 3.253 2.873 7.383 2.991M18 22l3.35-3.284a2.143 2.143 0 0 0 .005-3.071a2.24 2.24 0 0 0-3.129-.006l-.224.22l-.223-.22a2.24 2.24 0 0 0-3.128-.006a2.143 2.143 0 0 0-.006 3.071z"/></g>',
        width: 24,
        height: 24,
    },
    'chair-director': {
        body: '<path fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="m6 21l12-9M6 12l12 9M5 12h14M6 3v9m12-9v9M6 8h12M6 5h12"/>',
        width: 24,
        height: 24,
    },
};

export const filmDiamondIconNames = Object.keys(filmDiamondIcons);
