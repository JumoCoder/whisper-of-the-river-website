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
