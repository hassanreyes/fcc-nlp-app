import { FccNlpAppPage } from './app.po';

describe('fcc-nlp-app App', function() {
  let page: FccNlpAppPage;

  beforeEach(() => {
    page = new FccNlpAppPage();
  });

  it('should display message saying app works', () => {
    page.navigateTo();
    expect(page.getParagraphText()).toEqual('app works!');
  });
});
