# Lottie Assets

Place your Lottie animation file here.

Expected filename: `splash.json`

If your file has a different name, update the import in:
`src/app/components/SplashScreen.jsx`

```js
import splashAnimation from "@/assets/lottie/YOUR_FILE_NAME.json";
```

> Both `.json` (LottieJSON) and `.lottie` (dotLottie) formats are supported.
> For `.lottie` files, use `@lottiefiles/dotlottie-react` instead of `lottie-react`.
