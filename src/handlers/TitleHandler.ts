export class TitleHandler {
  title: string;

  constructor() {
    this.title = '';
  }

  text(text: Text) {
    if (!text.lastInTextNode) {
      this.title += text.text;
    }
  }
}
