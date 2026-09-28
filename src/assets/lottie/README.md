# Lottie Assets

`splash.lottie` is the animation on the startup screen.

It is imported through Vite in `src/app/components/SplashScreen.jsx`:

```js
import splashSrc from "@/assets/lottie/splash.lottie?url";
```

Replacing the animation means replacing **this** file — there is no second copy
in `public/`. Because Vite emits it under a content-hashed name, a redeploy
always serves the new animation; a cached copy of the old one cannot win.

> `.lottie` (dotLottie) files are played with `@lottiefiles/dotlottie-react`.
> A plain `.json` (Lottie JSON) file would use `lottie-react` instead, which
> needs no WASM renderer.

## WASM renderer

`@lottiefiles/dotlottie-react` downloads a ~1.2 MB WASM renderer at runtime and
defaults to a public CDN. `SplashScreen.jsx` calls `setWasmUrl()` with the copy
Vite bundles from `@lottiefiles/dotlottie-web`, so the deployed site never
depends on that CDN being reachable.
