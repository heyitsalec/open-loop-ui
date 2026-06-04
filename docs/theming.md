# Theming

Open Loop UI ships CSS variables with the `--olu-*` prefix. The default theme has a little sparkle, but it is not precious about it. Make it quiet, make it loud, make it match your app.

```css
:root {
  --olu-accent: oklch(50% 0.11 148);
  --olu-accent-deep: oklch(32% 0.08 150);
  --olu-surface: white;
  --olu-ink: oklch(22% 0.035 145);
  --olu-radius: 18px;
}
```

You can override variables globally or inside a wrapper around `OpenLoopProvider`.

Keep the contrast between `--olu-accent-deep` and `--olu-bg` high, because those colors are used on the pill icon, pointer hint, and toast.

## Taste Notes

- Keep the pill small enough that it feels like an affordance, not a new navigation system.
- Keep the pointer label short. `Revenue chart` beats `The big chart in the middle of the reporting page`.
- Let the panel feel like a tool surface. A little character is good; visual wrestling is less good.
