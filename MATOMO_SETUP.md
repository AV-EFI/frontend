# Matomo Analytics - Quick Setup Guide

## Start Matomo Stack

```powershell
docker-compose -f docker-compose.matomo.yml up -d
```

## Initial Setup

1. **Access Matomo**: Open http://localhost:8888
2. **Database Setup**:
   - Database Server: `matomo-db`
   - Login: `matomo`
   - Password: `matomodb`
   - Database Name: `matomo`
   - Table Prefix: `matomo_` (default)
3. **Create Super User**: Follow the wizard
4. **Add Website**:
   - Name: `AVefi Frontend`
   - URL: `http://localhost:3000`
   - Timezone: Your timezone

## Get Tracking Code

After setup, go to:
- **Administration** → **Tracking Code**
- Note your **Site ID** (usually 1)

## Configure Nuxt

The tracking plugin is already created at `plugins/matomo.client.ts`.

Add these environment variables to your `.env.local`:

```bash
# Matomo Analytics
MATOMO_URL=http://localhost:8888
MATOMO_SITE_ID='AVefi'
```

Or update `nuxt.config.ts` if you want to hardcode it (already added):

```typescript
runtimeConfig: {
  public: {
    matomoUrl: process.env.MATOMO_URL || 'http://localhost:8888',
    matomoSiteId: process.env.MATOMO_SITE_ID || 'AVefi',
  }
}
```

## Usage Examples

The plugin automatically tracks page views. For custom tracking:

```vue
<script setup>
// Access Matomo instance
const { $matomo } = useNuxtApp();

// Track custom events
const trackDownload = () => {
  $matomo.trackEvent('Downloads', 'PDF', 'Film Documentation', 1);
};

// Track site search
const trackSearch = (query: string, resultsCount: number) => {
  $matomo.trackSiteSearch(query, 'Films', resultsCount);
};

// Track goal
const trackGoal = (goalId: number) => {
  $matomo.trackGoal(goalId);
};

// Track link
const trackLink = (url: string, linkType: 'link' | 'download') => {
  $matomo.trackLink(url, linkType);
};
</script>
```

Available methods via `$matomo`:
- `trackEvent(category, action, name?, value?)`
- `trackSiteSearch(keyword, category?, resultsCount?)`
- `trackPageView(customTitle?)`
- `trackGoal(goalId, customRevenue?)`
- `trackLink(url, linkType)`
- `setUserId(userId)`
- `resetUserId()`
- And many more - see [vue-matomo docs](https://github.com/AmazingDreams/vue-matomo)

## Quick Test

1. Start your frontend: `yarn dev`
2. Visit http://localhost:3000
3. Check Matomo dashboard: http://localhost:8888
4. Go to **Visitors** → **Real-time** to see live visits

## Stop Matomo

```powershell
docker-compose -f docker-compose.matomo.yml down
```

## Remove All Data

```powershell
docker-compose -f docker-compose.matomo.yml down -v
```

## Production Notes

- Change all passwords
- Use environment variables for sensitive data
- Set up proper domain for Matomo
- Enable SSL/TLS
- Configure privacy settings (GDPR compliance)
- Set up auto-archiving for better performance
