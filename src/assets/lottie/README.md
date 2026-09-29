# Lottie Assets

`splash.json` is the animation on the startup screen.

It is imported through Vite in `src/app/components/SplashScreen.jsx`:

```js
import splashAnimation from "@/assets/lottie/splash.json";
```

Replacing the animation means replacing **this** file. Because Vite bundles it
into the build output, a redeploy always serves the new animation — a cached
copy of the old one cannot win.

The animation is 512x457; `SplashScreen.jsx` sets a matching `aspectRatio` on
the player. Update that value if you swap in an animation of a different shape,
otherwise the box collapses and nothing is drawn.

> `.json` (Lottie JSON) files are played with `lottie-react`, which needs no
> WASM renderer and no CDN at runtime. `splash.lottie` is the same animation in
> dotLottie form, kept only as a source file — nothing imports it.
