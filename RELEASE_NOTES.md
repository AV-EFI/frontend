Release Log - December 3, 2025
Release: Search History, SEO Optimizations & Accessibility Improvements
Branch: feature/seo-optimizations-01
Status: Ready for Testing
Date: December 3, 2025

---

## 📋 Overview
This release focuses on three major areas:
1. Search history and user experience improvements
2. SEO metadata optimization for better search engine visibility
3. Accessibility enhancements for screen readers and keyboard navigation

---

🔍 Search History Feature
Changes:
- Implemented persistent search history that stores last 3 searches in localStorage
- Full URL preservation including all facets, filters, and query parameters
- Recent searches displayed at top of autocomplete dropdown when input is empty
- Individual delete functionality with X button on each history item
- "Clear All" button to wipe entire search history
- History icon (`formkit:history`) for visual distinction from regular suggestions
- Smooth integration with existing autocomplete suggestions system

Cross-Component Integration:
- `InstantSearchTemplateAVefi.vue` - Main search page
- `SearchCompExtended.vue` - Advanced search form
- `SearchCompReduced.vue` - Simplified search component

Technical Details:
- Storage key: `avefi-search-history`
- Storage format: JSON array of `SearchHistoryItem` objects
- Data structure: `{ query: string, url: string, timestamp: number }`
- Max history size: 3 items (most recent first)
- Client-side only (localStorage), no server-side persistence

Files Modified:
- `composables/useSearchHistory.ts` (new)
- `components/search/InstantSearchTemplateAVefi.vue`
- `components/search/QueryAutocomplete.vue`
- `components/global/SearchCompExtended.vue`
- `components/global/SearchCompReduced.vue`

---

⚡ Search Input Enhancements
Changes:
- Enter key now submits search from all search inputs
- Dynamic button text based on query state:
  - Empty: "Ganzen Bestand anzeigen" (DE) / "Show entire collection" (EN)
  - Filled: "Suchen" (DE) / "Search" (EN)
- Improved reactivity: button text updates immediately during typing/deletion
- Fixed clear button (X) to properly reset input and update button text
- Pre-filled query support: autocomplete fetches suggestions on mount for URL-populated queries
- Better v-model synchronization with empty value emission

QueryAutocomplete Component:
- Disabled `enforceList` to allow free-form query submission
- Fixed Enter key behavior in non-enforced mode
- Resolved double dropdown issue (recent searches + suggestions)
- Added computed button text for reactive updates
- Fixed `onInput` to emit `update:modelValue` for empty strings

Files Modified:
- `components/search/QueryAutocomplete.vue`
- `components/global/SearchCompExtended.vue`
- `components/global/SearchCompReduced.vue`

---

🐛 Bug Fixes
Error Handling:
- Fixed custom 404/500 error pages not rendering
- Added `definePageMeta({ name: 'error-500' })` to error-500.vue
- Updated error.vue to use `<NuxtPage>` with named routes
- Created global error handler plugin (error-handler.ts)

Search Functionality:
- Fixed "Invalid end tag" compilation errors
- Removed auto-save of searches from URL on page reload (prevented unwanted history pollution)
- Fixed search history not updating UI when items deleted
- Made useSearchHistory composable properly reactive with internal state management
- Resolved search input not populating from URL query parameters
- Added `syncSearchValueFromUrl()` function with mount/popstate/storage event listeners
- Fixed facet URL preservation in search history

Files Modified:
- `error.vue`
- `pages/error-500.vue`
- `plugins/error-handler.ts` (new)
- `composables/useSearchHistory.ts`
- `components/search/InstantSearchTemplateAVefi.vue`

---

🌐 Internationalization
New Translation Keys:
- `recentSearches`: "Letzte Suchen" / "Recent Searches"
- `clearSearchHistory`: "Suchverlauf löschen" / "Clear search history"
- `clearAll`: "Alle löschen" / "Clear all"
- `removeFromHistory`: "Aus Verlauf entfernen" / "Remove from history"
- `showEntireCollection`: "Ganzen Bestand anzeigen" / "Show entire collection"

Files Modified:
- `i18n/i18n.config.ts` (+5 translation keys)

---

🔧 Configuration
Environment Variables:
Added missing variables to `.env.tmpl`:
- `NUXT_PUBLIC_SITE_URL` - Public site URL
- `AVEFI_COPY_PID_URL` - PID copy URL base
- `ELASTIC_INDEX_MAPPING` - Index mapping name
- `NUXT_PUBLIC_INDEXABLE` - SEO indexing flag
- `KIBANA_DATA_VIEW_ID` - Kibana data view identifier

Files Modified:
- `.env.tmpl`

---

📊 Statistics
- Total Files Changed: 9 files
- New Files Created: 2 (useSearchHistory.ts, error-handler.ts)
- Translation Keys Added: 5
- Components Updated: 6
- Max Search History: 3 items
- Storage: Client-side (localStorage)

---

🧪 Testing Checklist

Search History:
- [ ] Perform 3+ searches with different queries
- [ ] Focus empty search input → verify recent searches appear
- [ ] Click recent search → verify full URL with facets restored
- [ ] Click X on individual search → verify item removed
- [ ] Click "Clear All" → verify all history deleted
- [ ] Reload page → verify cleared history stays empty
- [ ] Type in search → verify dropdown switches to suggestions
- [ ] Clear input → verify recent searches reappear
- [ ] Test in all 3 search components (main, extended, reduced)

Search Input:
- [ ] Type query → verify button shows "Search" / "Suchen"
- [ ] Clear query manually → verify button shows "Ganzen Bestand anzeigen" / "Show entire collection"
- [ ] Click X button → verify input clears and button text updates
- [ ] Press Enter with query → verify search submits
- [ ] Press Enter without query → verify shows entire collection
- [ ] Navigate to URL with `?query=Familie` → verify input populates and suggestions load
- [ ] Test language toggle EN ↔ DE → verify button text translates

Error Pages:
- [ ] Navigate to non-existent URL → verify 404 page displays
- [ ] Trigger server error → verify 500 page displays
- [ ] Verify custom error pages render correctly

Reactivity:
- [ ] Type and delete text → verify button updates in real-time
- [ ] Add search to history → verify dropdown updates immediately
- [ ] Remove from history → verify UI updates without reload
- [ ] Clear all history → verify dropdown becomes empty

---

🔄 Breaking Changes
None - all changes are backwards compatible

---

📝 Known Issues
None identified

---

🎯 SEO Optimizations
Changes:
- Added dynamic SEO metadata to Compare page based on dataset parameters
- Enhanced Vocabulary page with query-based meta descriptions
- Improved site URL handling with `NUXT_PUBLIC_SITE_URL` environment variable
- Updated comparison URLs to be more SEO-friendly
- Added proper Open Graph and Twitter Card metadata

Compare Page Enhancements:
- New error handling for missing dataset parameters
- Better error messages when datasets cannot be loaded
- SEO-optimized page titles and descriptions for shared comparison links
- Clean URL structure for comparison functionality

Vocabulary Page:
- Dynamic meta descriptions based on search query parameters
- Improved page titles for specific vocabulary searches
- Better indexing for normdata/vocabulary content

Technical Details:
- Centralized site URL configuration via environment variable
- Meta tag generation based on page context
- Proper canonical URL handling

Files Modified:
- `pages/compare.vue` (refactored from compare_altern.vue)
- `pages/vocab.vue`
- `nuxt.config.ts`
- `.env.tmpl`
- `.env.local`

---

♿ Accessibility Improvements
Changes:
- Enhanced keyboard navigation throughout search components
- Improved ARIA attributes for screen reader support
- Better focus management in search results
- Added proper ARIA roles for interactive elements
- Enhanced context menu accessibility

ManifestationListSplitView:
- Improved keyboard navigation between manifestations and items
- Added ARIA labels for list items and actions
- Better focus indicators for selected items
- Enhanced screen reader announcements

Search Components:
- Added clear button with proper ARIA labels
- Improved focus management in autocomplete dropdown
- Better keyboard navigation (Arrow keys, Enter, Escape, Tab)
- Enhanced ARIA live regions for dynamic content updates

SearchListFlatComp & SearchListViewComp:
- Improved focus management for search results
- Added ARIA roles for result actions
- Better keyboard accessibility for filters and facets
- Enhanced screen reader support for result counts

Files Modified:
- `components/search/ManifestationListSplitView.vue`
- `components/search/QueryAutocomplete.vue`
- `components/search/SearchListFlatComp.vue`
- `components/search/SearchListViewComp.vue`

---

🖼️ Image Optimization
Changes:
- New automated image optimization script using Sharp library
- Converts images to WebP format for better performance
- Optional JPEG fallback generation
- Configurable quality and dimension settings
- Automatic output directory creation
- Batch processing support

Script Features:
- Support for multiple image formats (PNG, JPG, JPEG, WebP)
- Quality control (default 80% for WebP, 85% for JPEG)
- Dimension constraints (max 1920px width)
- Error handling for missing files
- Progress logging

Usage:
```bash
npm run optimize-images
```

Files Modified:
- `scripts/optimize-images.mjs` (new)
- `package.json` (+1 script)

---

🔄 Compare Page Refactor
Changes:
- Removed old comparison page implementation (compare_altern.vue)
- New streamlined compare.vue with improved error handling
- Better dataset parameter validation
- Enhanced error messages for missing or invalid datasets
- Improved URL structure for comparison links

Error Handling:
- Graceful handling of missing dataset IDs
- User-friendly error messages
- Automatic redirect to home on invalid parameters
- Better loading states

Translation Keys Added:
- `error.datasetNotFound`: "Datensatz nicht gefunden" / "Dataset not found"
- `error.invalidComparisonUrl`: "Ungültige Vergleichs-URL" / "Invalid comparison URL"
- `error.datasetLoadFailed`: "Fehler beim Laden des Datensatzes" / "Failed to load dataset"

Files Modified:
- `pages/compare.vue` (new)
- `pages/compare_altern.vue` (deleted)
- `i18n/i18n.config.ts` (+3 translation keys)
- `i18n/locales/en.json` (+3 keys)
- `i18n/locales/de.json` (+3 keys)

---

🧹 Code Quality & Maintenance
Changes:
- Removed unnecessary console.log statements
- Improved code readability in useResourceData.ts
- Streamlined Nuxt configuration for search query handling
- Better error handling throughout codebase
- Cleaned up redundant code

Files Modified:
- `composables/useResourceData.ts`
- `nuxt.config.ts`

---

📊 Statistics
- Total Files Changed: 19 files
- New Files Created: 4 (useSearchHistory.ts, error-handler.ts, optimize-images.mjs, compare.vue)
- Files Deleted: 1 (compare_altern.vue)
- Translation Keys Added: 13 (5 search history + 3 compare errors + 5 accessibility)
- Components Updated: 10
- Scripts Added: 1 (image optimization)
- Max Search History: 3 items
- Storage: Client-side (localStorage)

---

🧪 Testing Checklist

Search History:
- [ ] Perform 3+ searches with different queries
- [ ] Focus empty search input → verify recent searches appear
- [ ] Click recent search → verify full URL with facets restored
- [ ] Click X on individual search → verify item removed
- [ ] Click "Clear All" → verify all history deleted
- [ ] Reload page → verify cleared history stays empty
- [ ] Type in search → verify dropdown switches to suggestions
- [ ] Clear input → verify recent searches reappear
- [ ] Test in all 3 search components (main, extended, reduced)

Search Input:
- [ ] Type query → verify button shows "Search" / "Suchen"
- [ ] Clear query manually → verify button shows "Ganzen Bestand anzeigen" / "Show entire collection"
- [ ] Click X button → verify input clears and button text updates
- [ ] Press Enter with query → verify search submits
- [ ] Press Enter without query → verify shows entire collection
- [ ] Navigate to URL with `?query=Familie` → verify input populates and suggestions load
- [ ] Test language toggle EN ↔ DE → verify button text translates

SEO & Metadata:
- [ ] Open compare page with datasets → verify meta title and description
- [ ] Share comparison URL → verify Open Graph tags display correctly
- [ ] Search vocabulary page → verify dynamic meta description
- [ ] Check page source for proper canonical URLs
- [ ] Verify NUXT_PUBLIC_SITE_URL is used consistently

Accessibility:
- [ ] Navigate search results with keyboard only (Tab, Arrow keys, Enter)
- [ ] Test with screen reader (NVDA/JAWS) → verify ARIA labels announced
- [ ] Check focus indicators visible on all interactive elements
- [ ] Verify Escape key closes dropdowns
- [ ] Test keyboard shortcuts in manifestation list
- [ ] Verify ARIA live regions announce dynamic updates

Image Optimization:
- [ ] Run `npm run optimize-images`
- [ ] Verify WebP files generated in output directory
- [ ] Check image quality and dimensions
- [ ] Verify original files unchanged
- [ ] Test optimized images display correctly

Compare Page:
- [ ] Access compare page without parameters → verify error message
- [ ] Compare two valid datasets → verify comparison displays
- [ ] Test invalid dataset ID → verify error handling
- [ ] Check comparison URL structure
- [ ] Verify error messages translated correctly

Error Pages:
- [ ] Navigate to non-existent URL → verify 404 page displays
- [ ] Trigger server error → verify 500 page displays
- [ ] Verify custom error pages render correctly

Reactivity:
- [ ] Type and delete text → verify button updates in real-time
- [ ] Add search to history → verify dropdown updates immediately
- [ ] Remove from history → verify UI updates without reload
- [ ] Clear all history → verify dropdown becomes empty

---

🔄 Breaking Changes
None - all changes are backwards compatible

---

📝 Known Issues
None identified

---

🚀 Migration Notes
- Search history automatically enabled for all users
- No database changes required (client-side only)
- Existing user sessions not affected
- No server-side configuration needed
- Clear browser localStorage to reset search history if needed
- Image optimization script is optional (run manually when needed)
- New environment variable `NUXT_PUBLIC_SITE_URL` should be set for SEO
- Old compare_altern.vue URLs will need migration to new compare.vue structure
