# Vercel Deployment Configuration

## Alternative vercel.json configurations:

### Option 1: Simple SPA rewrites (currently implemented)
```json
{
  "rewrites": [
    {
      "source": "/(.*)",
      "destination": "/index.html"
    }
  ]
}
```

### Option 2: More specific with build output directory
```json
{
  "buildCommand": "npm run build",
  "outputDirectory": "dist",
  "rewrites": [
    {
      "source": "/(.*)",
      "destination": "/index.html"
    }
  ]
}
```

### Option 3: With custom headers and redirects
```json
{
  "rewrites": [
    {
      "source": "/(.*)",
      "destination": "/index.html"
    }
  ],
  "headers": [
    {
      "source": "/(.*)",
      "headers": [
        {
          "key": "Cache-Control",
          "value": "public, max-age=0, must-revalidate"
        }
      ]
    },
    {
      "source": "/static/(.*)",
      "headers": [
        {
          "key": "Cache-Control",
          "value": "public, max-age=31536000, immutable"
        }
      ]
    }
  ]
}
```

## Deployment Steps:
1. Commit all changes including vercel.json
2. Push to your repository
3. Vercel will automatically redeploy
4. Test all routes to ensure they work properly

## Environment Variables:
Make sure to set NODE_ENV=production in your Vercel environment settings for the API URL to work correctly.