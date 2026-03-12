import { IStyleType, StyleBoxValue } from '@/interfaces';
import {
  IConfigurableTheme,
} from './contexts';
import { jsonSafeParse } from '@/utils/object';
import { IBackgroundValue, IBorderValue, IShadowValue } from '@/designer-components/_settings/utils/index';

/**
 * Extended style type that includes all theme-related properties
 */
export interface IThemeStyleType extends IStyleType {
  // Layout component properties
  gridGapHorizontal?: string | number;
  gridGapVertical?: string | number;

  // Input component properties
  labelAlign?: 'left' | 'right' | 'top';
  labelColon?: boolean;
  labelSpan?: number;
  contentSpan?: number;
}

/**
 * Gets the theme default stylingBox for a component category
 */
export const getThemeStylingBox = (
  theme: IConfigurableTheme | undefined,
  category: 'inputComponents' | 'layoutComponents' | 'standardComponents' | 'inlineComponents',
): string | undefined => {
  if (!theme) return undefined;
  return theme[category]?.stylingBox;
};

/**
 * Parses theme stylingBox to CSS style object
 */
export const parseThemeStylingBox = (stylingBox: string | undefined): React.CSSProperties => {
  if (!stylingBox) return {};
  const parsed = jsonSafeParse<StyleBoxValue>(stylingBox, {});
  return {
    marginTop: parsed.marginTop,
    marginRight: parsed.marginRight,
    marginBottom: parsed.marginBottom,
    marginLeft: parsed.marginLeft,
    paddingTop: parsed.paddingTop,
    paddingRight: parsed.paddingRight,
    paddingBottom: parsed.paddingBottom,
    paddingLeft: parsed.paddingLeft,
  };
};

/**
 * Gets input component theme defaults for use in defaultStyles functions
 * Returns the theme values that should be used as defaults for input components
 */
export const getInputComponentThemeDefaults = (
  theme: IConfigurableTheme | undefined,
): Partial<IThemeStyleType> => {
  if (!theme?.inputComponents) return {};

  const settings = theme.inputComponents;

  return {
    stylingBox: settings.stylingBox,
    background: {
      type: 'color',
      color: theme.componentBackground,
    },
    // Include label settings that might be used by form items
    labelAlign: settings.labelAlign,
    labelColon: settings.labelColon,
    labelSpan: settings.labelSpan,
    contentSpan: settings.contentSpan,
  };
};

/**
 * Gets layout component theme defaults for use in defaultStyles functions
 * Returns the theme values that should be used as defaults for layout components
 */
export const getLayoutComponentThemeDefaults = (
  theme: IConfigurableTheme | undefined,
): Partial<IThemeStyleType> => {
  if (!theme?.layoutComponents) return {};

  const settings = theme.layoutComponents;
  const defaults: Partial<IThemeStyleType> = {
    stylingBox: settings.stylingBox,
    // Include grid gap settings
    gridGapHorizontal: settings.gridGapHorizontal,
    gridGapVertical: settings.gridGapVertical,
  };

  // Add background if specified in theme
  if (settings.background) {
    defaults.background = settings.background as IBackgroundValue;
  }

  // Add border if specified in theme
  if (settings.border) {
    defaults.border = {
      ...defaults.border,
      border: settings.border.border,
      borderType: settings.border.borderType,
      radiusType: settings.border.radiusType,
      radius: settings.border.radius,
    } as IBorderValue;
  }

  // Add shadow if specified in theme
  if (settings.shadow) {
    defaults.shadow = settings.shadow as IShadowValue;
  }

  return defaults;
};

/**
 * Gets standard component theme defaults - only stylingBox (margin/padding)
 */
export const getStandardComponentThemeDefaults = (
  theme: IConfigurableTheme | undefined,
): Partial<IThemeStyleType> => {
  if (!theme?.standardComponents) return {};

  return {
    stylingBox: theme.standardComponents.stylingBox,
  };
};

/**
 * Gets inline component theme defaults - only stylingBox (margin/padding)
 */
export const getInlineComponentThemeDefaults = (
  theme: IConfigurableTheme | undefined,
): Partial<IThemeStyleType> => {
  if (!theme?.inlineComponents) return {};

  return {
    stylingBox: theme.inlineComponents.stylingBox,
  };
};

/**
 * Merges theme defaults with component defaults, with component defaults taking precedence
 * This is used in defaultStyles functions to apply theme values as base
 */
export const mergeThemeDefaultsWithComponentDefaults = (
  themeDefaults: Partial<IThemeStyleType>,
  componentDefaults: IThemeStyleType,
): IThemeStyleType => {
  return {
    // Start with component defaults
    ...componentDefaults,
    // Apply theme stylingBox if component doesn't have one
    stylingBox: componentDefaults.stylingBox ?? themeDefaults.stylingBox,
    // For layout components, also merge other theme properties
    ...(themeDefaults.background && !componentDefaults.background && { background: themeDefaults.background }),
    ...(themeDefaults.border && !componentDefaults.border && { border: { ...componentDefaults.border, ...themeDefaults.border } }),
    ...(themeDefaults.shadow && !componentDefaults.shadow && { shadow: themeDefaults.shadow }),
    // Grid gap for layout components
    ...(themeDefaults.gridGapHorizontal && !componentDefaults.gridGapHorizontal && { gridGapHorizontal: themeDefaults.gridGapHorizontal }),
    ...(themeDefaults.gridGapVertical && !componentDefaults.gridGapVertical && { gridGapVertical: themeDefaults.gridGapVertical }),
    // Label settings for input components
    ...(themeDefaults.labelAlign && !componentDefaults.labelAlign && { labelAlign: themeDefaults.labelAlign }),
    ...(themeDefaults.labelColon !== undefined && componentDefaults.labelColon === undefined && { labelColon: themeDefaults.labelColon }),
    ...(themeDefaults.labelSpan && !componentDefaults.labelSpan && { labelSpan: themeDefaults.labelSpan }),
    ...(themeDefaults.contentSpan && !componentDefaults.contentSpan && { contentSpan: themeDefaults.contentSpan }),
  };
};

/**
 * Hook helper to get theme-based default styles for a component category
 * This is used in useFormComponentStyles to apply theme as base styles
 */
export const getThemeBaseStyles = (
  theme: IConfigurableTheme | undefined,
  category: 'inputComponents' | 'layoutComponents' | 'standardComponents' | 'inlineComponents',
): Partial<IThemeStyleType> => {
  switch (category) {
    case 'inputComponents':
      return getInputComponentThemeDefaults(theme);
    case 'layoutComponents':
      return getLayoutComponentThemeDefaults(theme);
    case 'standardComponents':
      return getStandardComponentThemeDefaults(theme);
    case 'inlineComponents':
      return getInlineComponentThemeDefaults(theme);
    default:
      return {};
  }
};

export type ComponentCategory = 'inputComponents' | 'layoutComponents' | 'standardComponents' | 'inlineComponents';

const inputBorder: IBorderValue = {
  border: {
    all: { width: '1px', style: 'solid', color: '#d9d9d9' },
    top: { width: '1px', style: 'solid', color: '#d9d9d9' },
    bottom: { width: '1px', style: 'solid', color: '#d9d9d9' },
    left: { width: '1px', style: 'solid', color: '#d9d9d9' },
    right: { width: '1px', style: 'solid', color: '#d9d9d9' },
  },
  radius: { all: 8, topLeft: 8, topRight: 8, bottomLeft: 8, bottomRight: 8 },
  borderType: 'all',
  radiusType: 'all',
};

/**
 * Returns hardcoded style defaults for input components (last-resort fallback).
 * These are the same values previously baked into individual defaultStyles() functions.
 */
export const getInputComponentHardcodedDefaults = (): IStyleType => ({
  background: { type: 'color', color: '#fff' },
  font: { weight: '400', size: 14, color: '#000', type: 'Segoe UI' },
  border: inputBorder,
  dimensions: { width: '100%', height: '32px', minHeight: '0px', maxHeight: 'auto', minWidth: '0px', maxWidth: 'auto' },
  shadow: { offsetX: 0, offsetY: 0, blurRadius: 0, spreadRadius: 0, color: 'rgba(0,0,0,0)' },
});

/**
 * Returns hardcoded style defaults for layout components (last-resort fallback).
 */
export const getLayoutComponentHardcodedDefaults = (): IStyleType => ({
  background: { type: 'color', color: '' },
  font: { weight: '400', size: 14, color: '#000', type: 'Segoe UI' },
  border: {
    border: {
      all: { width: '1px', style: 'none', color: '#d9d9d9' },
    },
    radius: { all: 8 },
    borderType: 'all',
    radiusType: 'all',
  },
  dimensions: { width: 'auto', height: 'auto', minHeight: '32px', maxHeight: 'auto', minWidth: '0px', maxWidth: 'auto' },
  shadow: { offsetX: 0, offsetY: 0, blurRadius: 0, spreadRadius: 0, color: '#000000' },
});

/**
 * Returns hardcoded style defaults for inline components (last-resort fallback).
 */
export const getInlineComponentHardcodedDefaults = (): IStyleType => ({
  background: { type: 'color' },
  font: { weight: '400', size: 14, type: 'Segoe UI', align: 'center' },
  border: {
    border: {
      all: { width: '1px', style: 'solid', color: '#d9d9d9' },
    },
    radius: { all: 8 },
    borderType: 'all',
  },
  dimensions: { width: 'auto', height: '32px', minHeight: '0px', maxHeight: 'auto', minWidth: '0px', maxWidth: 'auto' },
  shadow: { offsetX: 0, offsetY: 0, blurRadius: 0, spreadRadius: 0, color: '#000000' },
});

/**
 * Returns hardcoded style defaults for standard components (last-resort fallback).
 */
export const getStandardComponentHardcodedDefaults = (): IStyleType => ({
  background: { type: 'color', color: '' },
  font: { weight: '400', size: 14, color: '#000', type: 'Segoe UI' },
  border: {
    border: {
      all: { width: '1px', style: 'none', color: '#d9d9d9' },
    },
    radius: { all: 8 },
    borderType: 'all',
    radiusType: 'all',
  },
  dimensions: { width: '100%', height: 'auto', minHeight: '0px', maxHeight: 'auto', minWidth: '0px', maxWidth: 'auto' },
  shadow: { offsetX: 0, offsetY: 0, blurRadius: 0, spreadRadius: 0, color: 'rgba(0,0,0,0)' },
});

/**
 * Returns hardcoded style defaults for a given component category.
 * Used as the last-resort fallback (tier 3) in the 3-tier merge.
 */
export const getHardcodedDefaults = (category: ComponentCategory): IStyleType => {
  switch (category) {
    case 'inputComponents':
      return getInputComponentHardcodedDefaults();
    case 'layoutComponents':
      return getLayoutComponentHardcodedDefaults();
    case 'inlineComponents':
      return getInlineComponentHardcodedDefaults();
    case 'standardComponents':
      return getStandardComponentHardcodedDefaults();
    default:
      return {};
  }
};
