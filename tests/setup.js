import '@testing-library/jest-dom/vitest'

// Plain functions (not vi.fn) so mock resets can't wipe them out
window.matchMedia =
   window.matchMedia ||
   ((query) => ({
      matches: false,
      media: query,
      onchange: null,
      addListener() { },
      removeListener() { },
      addEventListener() { },
      removeEventListener() { },
      dispatchEvent: () => false,
   }))

globalThis.ResizeObserver =
   globalThis.ResizeObserver ||
   class {
      observe() { }
      unobserve() { }
      disconnect() { }
   }

// antd calls getComputedStyle with pseudo-elements, which jsdom doesn't implement
const { getComputedStyle } = window
window.getComputedStyle = (el) => getComputedStyle(el)