// @author João Gabriel de Almeida

/**
 * Generate a unique CSS selector for an element.
 * Priority: id > data-testid > data-owl-selectable > nth-child path
 */
export function getSelector(element: Element): string {
  if (element.id && /^[a-zA-Z][\w-]*$/.test(element.id)) {
    return `#${element.id}`;
  }

  const testId = element.getAttribute("data-testid");
  if (testId) {
    return `[data-testid="${escapeAttr(testId)}"]`;
  }

  const owlId = element.getAttribute("data-owl-selectable");
  if (owlId) {
    return `[data-owl-selectable="${escapeAttr(owlId)}"]`;
  }

  return getPathSelector(element);
}

function escapeAttr(value: string): string {
  return value.replace(/"/g, '\\"');
}

function getPathSelector(element: Element): string {
  const path: string[] = [];
  let current: Element | null = element;

  while (current && current.nodeType === Node.ELEMENT_NODE) {
    let selector = current.nodeName.toLowerCase();

    if (current.id && /^[a-zA-Z][\w-]*$/.test(current.id)) {
      selector += `#${current.id}`;
      path.unshift(selector);
      break;
    }

    const parent: Element | null = current.parentElement;
    if (parent) {
      const siblings = Array.from(parent.children).filter(
        (el: Element) => el.nodeName === current!.nodeName
      );
      if (siblings.length > 1) {
        const index = siblings.indexOf(current) + 1;
        selector += `:nth-of-type(${index})`;
      }
    }

    path.unshift(selector);
    current = parent;
  }

  return path.join(" > ");
}
