// composables/useMatomoTracking.ts
export function useMatomoTracking() {
  const push = (...args: any[]) => {
    if (!import.meta.client) return
    const w = window as any
    w._paq = w._paq || []
    w._paq.push(args)
  }

  const safeGet = (key: string, fallback = 'unknown'): string => {
    try {
      const value = localStorage.getItem(key)
      return value ?? fallback
    } catch {
      return fallback
    }
  }

  const safeJsonArrayLength = (key: string): number => {
    try {
      const raw = localStorage.getItem(key)
      if (!raw) return 0
      const parsed = JSON.parse(raw)
      return Array.isArray(parsed) ? parsed.length : 0
    } catch {
      return 0
    }
  }

  const bucketCount = (count: number): string => {
    if (count <= 0) return '0'
    if (count <= 3) return '1-3'
    if (count <= 10) return '4-10'
    return '10+'
  }

  const normalizeBoolean = (value: string | null | undefined): string => {
    return value === 'true' ? 'true' : 'false'
  }

  /**
   * IMPORTANT:
   * These dimension IDs must match what you configured in Matomo.
   *
   * Suggested mapping:
   * 1 = theme
   * 2 = locale
   * 3 = search_mode
   * 4 = result_view_type
   * 5 = comparison_list_bucket
   * 6 = favorites_bucket
   * 7 = accessibility_mode
   */
  const setPreferenceDimensions = () => {
    const theme = safeGet('theme')
    const locale = safeGet('locale')
    const searchMode = safeGet('search_mode', 'simple')
    const resultViewType = safeGet('result_view_type', 'default')

    const comparisonListBucket = bucketCount(
      safeJsonArrayLength('comparison_list')
    )

    const favoritesBucket = bucketCount(
      safeJsonArrayLength('favorites')
    )

    const accessibilityMode = normalizeBoolean(
      localStorage.getItem('accessibility_mode')
    )

    push('setCustomDimension', 1, theme)
    push('setCustomDimension', 2, locale)
    push('setCustomDimension', 3, searchMode)
    push('setCustomDimension', 4, resultViewType)
    push('setCustomDimension', 5, comparisonListBucket)
    push('setCustomDimension', 6, favoritesBucket)
    push('setCustomDimension', 7, accessibilityMode)
  }

  const clearPreferenceDimensions = () => {
    push('deleteCustomDimension', 1)
    push('deleteCustomDimension', 2)
    push('deleteCustomDimension', 3)
    push('deleteCustomDimension', 4)
    push('deleteCustomDimension', 5)
    push('deleteCustomDimension', 6)
    push('deleteCustomDimension', 7)
  }

  const trackPageView = (title?: string) => {
    if (title) {
      push('setDocumentTitle', title)
    }
    push('trackPageView')
  }

  const trackEvent = (
    category: string,
    action: string,
    name?: string,
    value?: number
  ) => {
    if (typeof value === 'number') {
      push('trackEvent', category, action, name, value)
      return
    }

    if (typeof name === 'string') {
      push('trackEvent', category, action, name)
      return
    }

    push('trackEvent', category, action)
  }

  const rememberConsentGiven = () => {
    push('rememberConsentGiven')
  }

  const forgetConsentGiven = () => {
    push('forgetConsentGiven')
  }

  const deleteCookies = () => {
    push('deleteCookies')
  }

  // ---- AVefi-specific helper events ----

  const trackPidCopied = () => {
    trackEvent('PID', 'Copied')
  }

  const trackExportClicked = (format: string) => {
    trackEvent('Export', 'Clicked', format)
  }

  const trackCompareOpened = () => {
    trackEvent('Compare', 'Opened')
  }

  const trackCompareItemAdded = () => {
    trackEvent('Compare', 'Item Added')
  }

  const trackCompareItemRemoved = () => {
    trackEvent('Compare', 'Item Removed')
  }

  const trackSearchSubmitted = (mode: string = 'unknown') => {
    trackEvent('Search', 'Submitted', mode)
  }

  const trackSearchModeChanged = (mode: string) => {
    trackEvent('Search', 'Mode Changed', mode)
  }

  const trackFacetUsed = (facetName: string) => {
    trackEvent('Facet', 'Used', facetName)
  }

  const trackGlossaryOpened = (term?: string) => {
    trackEvent('Glossary', 'Opened', term)
  }

  const trackThemeChanged = (theme: string) => {
    setPreferenceDimensions()
    trackEvent('Preferences', 'Theme Changed', theme)
  }

  const trackLocaleChanged = (locale: string) => {
    setPreferenceDimensions()
    trackEvent('Preferences', 'Locale Changed', locale)
  }

  const trackResultViewChanged = (viewType: string) => {
    setPreferenceDimensions()
    trackEvent('Preferences', 'Result View Changed', viewType)
  }

  const trackAccessibilityModeChanged = (enabled: boolean) => {
    setPreferenceDimensions()
    trackEvent(
      'Preferences',
      'Accessibility Mode Changed',
      enabled ? 'true' : 'false'
    )
  }

  return {
    setPreferenceDimensions,
    clearPreferenceDimensions,
    trackPageView,
    trackEvent,
    rememberConsentGiven,
    forgetConsentGiven,
    deleteCookies,

    trackPidCopied,
    trackExportClicked,
    trackCompareOpened,
    trackCompareItemAdded,
    trackCompareItemRemoved,
    trackSearchSubmitted,
    trackSearchModeChanged,
    trackFacetUsed,
    trackGlossaryOpened,
    trackThemeChanged,
    trackLocaleChanged,
    trackResultViewChanged,
    trackAccessibilityModeChanged,
  }
}