import ScreenViewer from './components/screen-viewer.js'

for (const el of document.querySelectorAll('.screen-viewer')) {
  new ScreenViewer(el);
}
