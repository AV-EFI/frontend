/**
 * Type definitions for vue-matomo in Nuxt 3
 */
import type { Router } from 'vue-router';

declare module '#app' {
    interface NuxtApp {
        $matomo: MatomoTracker;
    }
}

declare module 'vue' {
    interface ComponentCustomProperties {
        $matomo: MatomoTracker;
    }
}

export interface MatomoTracker {
    // Track page view
    trackPageView(customTitle?: string): void;
    
    // Track events
    trackEvent(category: string, action: string, name?: string, value?: number): void;
    
    // Track site search
    trackSiteSearch(keyword: string, category?: string | boolean, resultsCount?: number | boolean): void;
    
    // Track goals
    trackGoal(goalId: number, customRevenue?: number): void;
    
    // Track link
    trackLink(url: string, linkType: 'link' | 'download'): void;
    
    // User ID
    setUserId(userId: string): void;
    resetUserId(): void;
    getUserId(): string;
    
    // Custom dimensions
    setCustomDimension(dimensionId: number, value: string): void;
    deleteCustomDimension(dimensionId: number): void;
    getCustomDimension(dimensionId: number): string;
    
    // Custom variables
    setCustomVariable(index: number, name: string, value: string, scope?: 'visit' | 'page'): void;
    deleteCustomVariable(index: number, scope?: 'visit' | 'page'): void;
    getCustomVariable(index: number, scope?: 'visit' | 'page'): string;
    
    // E-commerce
    addEcommerceItem(productSKU: string, productName: string, productCategory?: string | string[], price?: number, quantity?: number): void;
    removeEcommerceItem(productSKU: string): void;
    clearEcommerceCart(): void;
    trackEcommerceCartUpdate(grandTotal: number): void;
    trackEcommerceOrder(orderId: string, grandTotal: number, subTotal?: number, tax?: number, shipping?: number, discount?: number): void;
    
    // Content tracking
    trackContentImpression(contentName: string, contentPiece: string, contentTarget: string): void;
    trackContentInteraction(interaction: string, contentName: string, contentPiece: string, contentTarget: string): void;
    
    // Download & outlink tracking
    enableLinkTracking(enable?: boolean): void;
    
    // Consent
    requireConsent(): void;
    setConsentGiven(): void;
    rememberConsentGiven(hoursToExpire?: number): void;
    forgetConsentGiven(): void;
    
    // Cookie consent
    requireCookieConsent(): void;
    setCookieConsentGiven(): void;
    rememberCookieConsentGiven(hoursToExpire?: number): void;
    forgetCookieConsentGiven(): void;
    
    // Opt out
    optUserOut(): void;
    forgetUserOptOut(): void;
    
    // Other
    setDoNotTrack(enable?: boolean): void;
    disableCookies(): void;
    deleteCookies(): void;
    setCustomUrl(url: string): void;
    setReferrerUrl(url: string): void;
    setDocumentTitle(title: string): void;
    setDomains(domains: string[]): void;
    setCustomRequestProcessing(callback: (request: string) => string): void;
    
    // Heart beat timer
    enableHeartBeatTimer(activeTimeInSeconds?: number): void;
    
    // Media analytics
    scanForMedia(mediaType?: 'video' | 'audio'): void;
}

export {};
