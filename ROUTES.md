# IPA testing for deploy — Screens & Navigation

## How to run
cd /home/hewlett/projects/frontendX_backend_merged/frontend_runs/run_0e4c0454_20260713_084439/project
npm install && npx expo start
# Press 'a' for Android, 'i' for iOS simulator, 'w' for web,
# or scan the QR code with the Expo Go app on a physical iOS/Android device.

## Screens
| Screen | File | Description |
|--------|------|-------------|
| Discover | src/screens/DiscoverScreen.tsx | Search, categories, trending carousel, and recommended products list. |
| Product Details | src/screens/ProductDetailsScreen.tsx | Product gallery, details, specs, reviews, and related items. |
| Shopping Cart | src/screens/CartScreen.tsx | Cart items, quantity controls, pricing summary, and checkout simulation. |
| Wishlist | src/screens/WishlistScreen.tsx | Saved products with search, move, and remove actions. |
| Orders | src/screens/OrdersScreen.tsx | Order history, delivery progress, and buy-again actions. |
| Profile | src/screens/ProfileScreen.tsx | Customer info, saved addresses, and preferences toggles. |
| Not Found | src/screens/NotFoundScreen.tsx | Fallback screen for unknown routes. |

## Navigation map
- Discover -> Product Details (tap any product card)
- Product Details -> Shopping Cart (tap Add to Cart)
- Wishlist -> Product Details (tap a saved product card)
- Tabs -> Orders/Profile/Cart/Wishlist/Discover (bottom tab taps)

## Shared components
- src/components/HeaderBar.tsx — large title header with optional action
- src/components/CategoryPill.tsx — selectable category chips
- src/components/ProductCard.tsx — product preview card with wishlist toggle
- src/components/QuantityStepper.tsx — increment/decrement control
- src/components/SectionTitle.tsx — section headings with optional subtitle
- src/components/StatRow.tsx — label/value rows for summaries

## Design tokens
primary, primaryDark, primaryLight, accent, background, surface, card, border, textPrimary, textSecondary, textDisabled, textInverse, success, warning, error, info, shadowColor
