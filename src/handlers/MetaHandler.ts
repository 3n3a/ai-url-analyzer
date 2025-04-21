export class MetaHandler {
  metaTags: Record<string, string>;

  constructor() {
    this.metaTags = {};
  }

  element(element: Element) {
    const allowedNames = ["title", "description", "og:title", "og:description", "X:title", "X:description", "og:site_name"];
    const name = element.getAttribute('name') || element.getAttribute('property');
    const content = element.getAttribute('content');
    if (name && allowedNames.includes(name) && content) {
      this.metaTags[name] = content;
    }
  }
}
