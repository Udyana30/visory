import { ComicPanel, PageLayout } from '../types/domain/editor';
import { PANEL_LAYOUTS } from '../constants/editor';

type LayoutTemplateKey = keyof typeof PANEL_LAYOUTS;

const arePanelsMatchingConfig = (panels: ComicPanel[], configName: LayoutTemplateKey): boolean => {
  const config = PANEL_LAYOUTS[configName];
  if (panels.length !== config.length) return false;

  const sortedPanels = [...panels].sort((a, b) => {
    const yDiff = Math.abs(a.y - b.y);
    return yDiff > 1 ? a.y - b.y : a.x - b.x;
  });

  return sortedPanels.every((panel, index) => {
    const target = config[index];
    const tolerance = 0.5;
    
    return (
      Math.abs(panel.x - target.x) < tolerance &&
      Math.abs(panel.y - target.y) < tolerance &&
      Math.abs(panel.width - target.width) < tolerance &&
      Math.abs(panel.height - target.height) < tolerance
    );
  });
};

export const inferLayoutFromPanels = (panels: ComicPanel[]): PageLayout => {
  if (!panels || panels.length === 0) return 'single';

  const layoutKeys = Object.keys(PANEL_LAYOUTS) as LayoutTemplateKey[];
  
  for (const layout of layoutKeys) {
    if (arePanelsMatchingConfig(panels, layout)) {
      return layout;
    }
  }

  return 'custom';
};