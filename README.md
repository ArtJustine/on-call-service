# On-Call Services App

## Customizing Images

### App Logo

To replace the app logo with your own:

1. Prepare your logo image (recommended size: 200x200px with transparent background)
2. Upload your image to a hosting service or add it to your project assets
3. Open `constants/ImageAssets.ts` and update the `APP_LOGO` constant with your image URL:

```typescript
// Replace with your logo URL
export const APP_LOGO = "https://your-image-host.com/your-logo.png";

