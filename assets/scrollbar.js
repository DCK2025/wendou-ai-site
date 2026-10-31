(() => {
  const root = document.documentElement;
  const rail = document.createElement("div");
  const thumb = document.createElement("div");
  rail.className = "page-scrollbar";
  thumb.className = "page-scrollbar__thumb";
  thumb.setAttribute("role", "scrollbar");
  thumb.setAttribute("aria-label", "页面滚动位置");
  thumb.setAttribute("aria-orientation", "vertical");
  thumb.setAttribute("aria-controls", document.querySelector("main")?.id || "page-content");
  thumb.setAttribute("aria-valuemin", "0");
  thumb.setAttribute("aria-valuemax", "100");
  thumb.tabIndex = 0;
  rail.append(thumb);

  let railHeight = 0;
  let thumbHeight = 0;
  let maxScroll = 0;
  let maxThumbTop = 0;
  let frame = 0;
  let drag = null;

  const render = () => {
    frame = 0;
    const viewport = window.innerHeight;
    const pageHeight = Math.max(root.scrollHeight, document.body?.scrollHeight || 0);
    maxScroll = Math.max(0, pageHeight - viewport);
    railHeight = Math.max(0, viewport - 8);
    thumbHeight = maxScroll ? Math.min(railHeight, Math.max(44, railHeight * viewport / pageHeight)) : railHeight;
    maxThumbTop = Math.max(0, railHeight - thumbHeight);
    const top = maxScroll ? (window.scrollY / maxScroll) * maxThumbTop : 0;

    rail.classList.toggle("is-visible", maxScroll > 0);
    thumb.style.height = `${thumbHeight}px`;
    thumb.style.transform = `translateY(${top}px)`;
    thumb.setAttribute("aria-valuenow", String(Math.round(maxScroll ? window.scrollY / maxScroll * 100 : 0)));
  };

  const scheduleRender = () => {
    if (!frame) frame = requestAnimationFrame(render);
  };

  thumb.addEventListener("pointerdown", (event) => {
    if (event.button !== 0 || !maxScroll) return;
    event.preventDefault();
    drag = { y: event.clientY, scrollY: window.scrollY };
    thumb.classList.add("is-dragging");
    thumb.setPointerCapture(event.pointerId);
  });

  thumb.addEventListener("pointermove", (event) => {
    if (!drag || !maxThumbTop) return;
    const nextTop = Math.min(maxThumbTop, Math.max(0, drag.scrollY / maxScroll * maxThumbTop + event.clientY - drag.y));
    window.scrollTo({ top: nextTop / maxThumbTop * maxScroll, behavior: "instant" });
  });

  const stopDrag = () => {
    drag = null;
    thumb.classList.remove("is-dragging");
  };
  thumb.addEventListener("pointerup", stopDrag);
  thumb.addEventListener("pointercancel", stopDrag);

  thumb.addEventListener("keydown", (event) => {
    const page = Math.max(80, window.innerHeight * 0.85);
    const steps = { ArrowUp: -48, ArrowDown: 48, PageUp: -page, PageDown: page, Home: -Infinity, End: Infinity };
    if (!(event.key in steps)) return;
    event.preventDefault();
    const step = steps[event.key];
    window.scrollTo({ top: step === -Infinity ? 0 : step === Infinity ? maxScroll : window.scrollY + step, behavior: "smooth" });
  });

  document.body.append(rail);
  window.addEventListener("scroll", scheduleRender, { passive: true });
  window.addEventListener("resize", scheduleRender, { passive: true });
  if ("ResizeObserver" in window) new ResizeObserver(scheduleRender).observe(root);
  render();
})();
