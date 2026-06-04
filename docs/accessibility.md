# Accessibility

Open Loop UI is designed to be usable without pointer precision. The shiny part is the pointer overlay, but the useful part still needs to behave like a good citizen:

- The pill is a button with an accessible label.
- `Cmd+.` / `Ctrl+.` opens and closes the panel.
- `Esc` exits targeting or closes the panel.
- `Cmd+Enter` / `Ctrl+Enter` submits feedback.
- Focus moves to the textarea when the panel opens.
- Reduced-motion preferences disable decorative animations.

When you label targetable areas, use short human-readable names:

```tsx
<section data-open-loop-label="Revenue chart">
  ...
</section>
```

The label is visible in the pointer overlay and is included in the adapter payload.

When in doubt, label regions the way a teammate would refer to them in review. If someone would say “the pricing card,” use `data-open-loop-label="Pricing card"`.
