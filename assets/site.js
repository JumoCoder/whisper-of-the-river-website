document.querySelectorAll("button[data-open]").forEach((button) => {
  const dialog = document.getElementById(button.dataset.open);
  button.addEventListener("click", () => {
    const footage = dialog.querySelector("[data-src]");
    if (footage) footage.src = footage.dataset.src;
    dialog.showModal();
  });
});

document.querySelectorAll("dialog").forEach((dialog) => {
  dialog.querySelector("[data-close]").addEventListener("click", () => dialog.close());
  dialog.addEventListener("click", (event) => {
    if (event.target.closest("a")) dialog.close();
    if (event.target !== dialog) return;
    const { left, right, top, bottom } = dialog.getBoundingClientRect();
    if (event.clientX < left || event.clientX > right || event.clientY < top || event.clientY > bottom) dialog.close();
  });
  dialog.addEventListener("close", () => dialog.querySelector("[data-src]")?.removeAttribute("src"));
});

document.querySelectorAll(".fleet-art").forEach((fleet) => {
  const choices = fleet.querySelectorAll("button.boat");
  const river = fleet.querySelector(".little");
  const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");

  for (const choice of choices) {
    choice.addEventListener("click", () => {
      if (choice.getAttribute("aria-pressed") === "true") return;
      for (const button of choices) button.setAttribute("aria-pressed", String(button === choice));

      const previous = river.lastElementChild;
      const next = choice.querySelector("img").cloneNode();
      next.loading = "eager";
      river.append(next);
      if (reducedMotion.matches) {
        river.replaceChildren(next);
        return;
      }

      const from = choice.getBoundingClientRect();
      const to = river.getBoundingClientRect();
      const dx = from.left + from.width / 2 - to.left - to.width / 2;
      const dy = from.top + from.height / 2 - to.top - to.height / 2;
      const scale = Math.max(from.width / to.width, from.height / to.height);
      next.animate([
        { transform: `translate(${dx}px, ${dy}px) scale(${scale})` },
        { transform: "none" },
      ], { duration: 700, easing: "cubic-bezier(.35,.02,.2,1)" });
      const fade = previous.animate([{ opacity: 1 }, { opacity: 0 }], {
        duration: 320, fill: "forwards", easing: "ease-out",
      });
      fade.onfinish = () => previous.remove();
    });
  }
});
