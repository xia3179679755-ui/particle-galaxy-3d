/* Prefer the bundled, pinned ES module. CDN sources are only recovery paths. */
(function () {
  const sources = [
    './static/js/vendor/three.module.min.js',
    'https://cdn.jsdelivr.net/npm/three@0.161.0/build/three.module.min.js',
    'https://unpkg.com/three@0.161.0/build/three.module.min.js'
  ];
  const withTimeout = (promise, ms) => Promise.race([
    promise,
    new Promise((_, reject) => setTimeout(() => reject(new Error('加载超时')), ms))
  ]);
  window.loadThree = async () => {
    let lastError;
    for (const source of sources) {
      try {
        const module = await withTimeout(import(source), 6000);
        window.THREE = module;
        return module;
      } catch (error) { lastError = error; }
    }
    throw new Error(`Three.js 加载失败：${lastError?.message || '未知错误'}`);
  };
}());
