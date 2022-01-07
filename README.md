# use-animation-frame

[![NPM version][npm-image]][npm-url]
[![Actions Status][ci-image]][ci-url]
[![PR Welcome][npm-downloads-image]][npm-downloads-url]

A React hook to effortlessly run a single shared [requestAnimationFrame()](https://developer.mozilla.org/en-US/docs/Web/API/window/requestAnimationFrame) for all instances of the hook used with adjustable FPS (frames per second).

## Installation

Install this package with `npm`.

```bash
npm i @phntms/use-animation-frame
```

## API

Accepts first a callback and second an optional FPS:

```ts
useAnimationFrame(callback, fps);
```

The callback is **required** and is called on _every_ animation frame window. Whereas `fps` is optional.

FPS can be used to control how often callback triggers. By default callback will trigger around ~60 times per second (approximately every ~16ms), though you can change this, for example, `30` can be used to trigger callback ~30 times per second.

**Note**: Any FPS can be used, although intervals cannot be faster than the `requestAnimationFrame` limit.

### Output

The callback returns `deltaTime` - the total time in `ms` since the hook last run.

**Note**: Due to the nature of `requestAnimationFrames()` this will always likely slightly differ in time.

## Single Shared `requestAnimationFrame()` Instances

A highlight of this library over similar implementations is that instead of creating a new `requestAnimationFrame()` event listener for every instances of the hook, we're instead using one global instances that we 'hook' into for all instances of the hook used. This means you're getting less of a performance hit for using multiple instances of the hook. Additionally if used with custom `fps` limits, you can get much greater performance out of your components!

## Examples

```ts
import useAnimationFrame from "@phntms/use-animation-frame";

useAnimationFrame((deltaTime: number) => {
  console.log(
    `I'm called approximately every ~16ms, but I was actually triggered after ${deltaTime}ms.`
  );
});

useAnimationFrame((deltaTime: number) => {
  console.log(
    `I'm called approximately 30 times per second, but I was actually trigger after ${deltaTime}ms.`
  );
}, 30);
```

## 🍰 Contributing

Want to get involved, or found an issue? Please contribute using the GitHub Flow. Create a branch, add commits, and open a Pull Request or submit a new issue.

Please read `CONTRIBUTING` for details on our `CODE_OF_CONDUCT`, and the process for submitting pull requests to us!

[npm-image]: https://img.shields.io/npm/v/@phntms/use-animation-frame.svg?style=flat-square&logo=react
[npm-url]: https://npmjs.org/package/@phntms/use-animation-frame
[npm-downloads-image]: https://img.shields.io/npm/dm/@phntms/use-animation-frame.svg
[npm-downloads-url]: https://npmcharts.com/compare/@phntms/use-animation-frame?minimal=true
[ci-image]: https://github.com/phantomstudios/use-animation-frame/workflows/Test/badge.svg
[ci-url]: https://github.com/phantomstudios/use-animation-frame/actions
