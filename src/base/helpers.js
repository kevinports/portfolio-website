
export function getOffset(element) {
  const body = document.body;
  const bodyRect = body.getBoundingClientRect();
  const elemRect = element.getBoundingClientRect();
  const offset = {
    top: elemRect.top - bodyRect.top,
    bottom: (elemRect.top - bodyRect.top) + element.clientHeight
  }
  return offset;
}
