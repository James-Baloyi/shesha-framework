import { DesignerToolbarSettings } from "@/index";
import { nanoid } from "@/utils/uuid";
import { FormLayout } from "antd/lib/form/Form";
import { getBorderInputs, getCornerInputs } from "../_settings/utils/border/utils";
import { fontTypes, fontWeights, textAlign } from "../_settings/utils/font/utils";

export const getSettings = (data: any) => {
  const searchableTabsId = nanoid();
  const commonTabId = nanoid();
  const validationId = nanoid();
  const eventsTabId = nanoid();
  const appearanceId = nanoid();
  const securityId = nanoid();
  const styleRouterId = nanoid();
  const pnlFontStyleId = nanoid();
  const dimensionsStylePnlId = nanoid();
  const borderStylePnlId = nanoid();
  const borderStyleRowId = nanoid();
  const backgroundStylePnlId = nanoid();

  const propertyNameId = nanoid();
  const hiddenId = nanoid();
  const shadowStylePnlId = nanoid();

  return {
    components: new DesignerToolbarSettings(data)
      .addSearchableTabs({
        id: searchableTabsId,
        propertyName: 'settingsTabs',
        parentId: 'root',
        label: 'Settings',
        hideLabel: true,
        labelAlign: 'right',
        size: 'small',
        tabs: [
          {
            key: 'common',
            title: 'Common',
            id: commonTabId,
            components: [...new DesignerToolbarSettings()
              .addContextPropertyAutocomplete({
                id: propertyNameId,
                propertyName: "propertyName",
                parentId: commonTabId,
                label: "Property Name",
                size: "small",
                validate: {
                  "required": true
                },
                styledLabel: true,
                jsSetting: true,
              })
              .addLabelConfigurator({
                id: nanoid(),
                propertyName: 'hideLabel',
                label: 'Label',
                parentId: commonTabId,
                hideLabel: true,
              })
              .addSettingsInputRow({
                id: nanoid(),
                parentId: commonTabId,
                inputs: [
                  {
                    type: 'text',
                    id: `placeholder-${commonTabId}`,
                    propertyName: 'placeholder',
                    label: 'Placeholder',
                    size: 'small',
                    jsSetting: true,
                  },
                  {
                    type: 'textArea',
                    id: `tooltip-${commonTabId}`,
                    propertyName: 'description',
                    label: 'Tooltip',
                    jsSetting: true,
                  },
                ],
                readOnly: { _code: 'return getSettingValue(data?.readOnly);', _mode: 'code', _value: false } as any,
              })
              .addSettingsInputRow({
                id: nanoid(),
                parentId: commonTabId,
                readOnly: false,
                inputs: [
                  {
                    type: 'text',
                    id: nanoid(),
                    propertyName: "initialValue",
                    parentId: commonTabId,
                    label: "Default Value",
                    jsSetting: true,
                    size: "small",
                  },
                  {
                    type: 'switch',
                    id: nanoid(),
                    propertyName: 'passEmptyStringByDefault',
                    label: 'Empty as default',
                    jsSetting: true,
                    parentId: commonTabId,
                  }
                ]
              })
              .addSettingsInputRow({
                id: nanoid(),
                parentId: commonTabId,
                readOnly: false,
                inputs: [
                  {
                    type: 'switch',
                    id: nanoid(),
                    propertyName: 'autoSize',
                    parentId: commonTabId,
                    label: 'Auto Size',
                    defaultValue: true,
                    jsSetting: true,
                  },
                  {
                    type: 'switch',
                    id: nanoid(),
                    propertyName: 'allowClear',
                    parentId: commonTabId,
                    label: 'Allow Clear',
                    jsSetting: true,
                  }
                ]
              })
              .addSettingsInputRow({
                id: nanoid(),
                parentId: commonTabId,
                readOnly: { _code: 'return getSettingValue(data?.readOnly);', _mode: 'code', _value: false } as any,
                inputs: [
                  {
                    type: 'editModeSelector',
                    id: nanoid(),
                    propertyName: 'editMode',
                    label: 'Edit Mode',
                    defaultValue: 'inherited',
                    size: 'small',
                    jsSetting: true,
                  },
                  {
                    type: 'switch',
                    id: hiddenId,
                    propertyName: 'hidden',
                    label: 'Hide',
                    jsSetting: true,
                    layout: 'horizontal',
                  },
                ],
              })
              .addSettingsInputRow({
                id: nanoid(),
                parentId: commonTabId,
                readOnly: false,
                inputs: [
                  {
                    type: 'switch',
                    id: nanoid(),
                    propertyName: 'showCount',
                    parentId: commonTabId,
                    label: 'Show Chars Count',
                    jsSetting: true,
                  }
                ],
              })
              .toJson()
            ]
          },
          {
            key: 'validation',
            title: 'Validation',
            id: validationId,
            components: [
              ...new DesignerToolbarSettings()
                .addSettingsInput({
                  readOnly: { _code: 'return getSettingValue(data?.readOnly);', _mode: 'code', _value: false } as any,
                  id: nanoid(),
                  propertyName: 'validate.required',
                  label: 'Required',
                  inputType: 'switch',
                  size: 'small',
                  layout: 'horizontal',
                  jsSetting: true,
                  parentId: validationId
                })
                .addSettingsInputRow({
                  id: nanoid(),
                  parentId: validationId,
                  inputs: [
                    {
                      type: 'number',
                      id: nanoid(),
                      propertyName: 'validate.minLength',
                      label: 'Min Length',
                      size: 'small',
                      jsSetting: true,
                    },
                    {
                      type: 'number',
                      id: nanoid(),
                      propertyName: 'validate.maxLength',
                      label: 'Max Length',
                      size: 'small',
                      jsSetting: true,
                    },
                  ],
                  readOnly: { _code: 'return getSettingValue(data?.readOnly);', _mode: 'code', _value: false } as any,
                })
                .addSettingsInputRow({
                  id: nanoid(),
                  parentId: validationId,
                  inputs: [
                    {
                      id: nanoid(),
                      propertyName: "validate.message",
                      parentId: validationId,
                      label: "Message",
                      validate: {},
                      version: 3,
                      type: "text",
                      jsSetting: true,
                    },
                    {
                      type: 'codeEditor',
                      id: nanoid(),
                      propertyName: 'validate.validator',
                      label: 'Validator',
                      labelAlign: 'right',
                      tooltip: 'Enter custom validator logic for form.item rules. Returns a Promise',
                    }
                  ],
                  readOnly: { _code: 'return getSettingValue(data?.readOnly);', _mode: 'code', _value: false } as any,
                })
                .addSettingsInput({
                  id: nanoid(),
                  propertyName: "spellCheck",
                  parentId: validationId,
                  label: "Spell Check",
                  version: 3,
                  inputType: "switch",
                  jsSetting: true,
                })
                .toJson()
            ]
          },
          {
            key: 'events',
            title: 'Events',
            id: eventsTabId,
            components: [
              ...new DesignerToolbarSettings()
                .addSettingsInput({
                  readOnly: { _code: 'return getSettingValue(data?.readOnly);', _mode: 'code', _value: false } as any,
                  id: nanoid(),
                  inputType: 'codeEditor',
                  propertyName: 'onChangeCustom',
                  label: 'On Change',
                  labelAlign: 'right',
                  tooltip: 'Enter custom eventhandler on changing of event. (form, event) are exposed',
                  parentId: eventsTabId
                })
                .addSettingsInput({
                  readOnly: { _code: 'return getSettingValue(data?.readOnly);', _mode: 'code', _value: false } as any,
                  id: nanoid(),
                  inputType: 'codeEditor',
                  propertyName: 'onFocusCustom',
                  label: 'On Focus',
                  labelAlign: 'right',
                  tooltip: 'Enter custom eventhandler on focus of event. (form, event) are exposed',
                  parentId: eventsTabId
                })
                .addSettingsInput({
                  readOnly: { _code: 'return getSettingValue(data?.readOnly);', _mode: 'code', _value: false } as any,
                  id: nanoid(),
                  inputType: 'codeEditor',
                  propertyName: 'onBlurCustom',
                  label: 'On Blur',
                  labelAlign: 'right',
                  tooltip: 'Enter custom eventhandler on blur of event. (form, event) are exposed',
                  parentId: eventsTabId
                })
                .toJson()
            ]
          },
          {
            key: 'appearance',
            title: 'Appearance',
            id: appearanceId,
            components: [
              ...new DesignerToolbarSettings()
                .addPropertyRouter({
                  id: styleRouterId,
                  propertyName: 'propertyRouter1',
                  componentName: 'propertyRouter',
                  label: 'Property router1',
                  labelAlign: 'right',
                  parentId: appearanceId,
                  hidden: false,
                  propertyRouteName: {
                    _mode: "code",
                    _code: "    return contexts.canvasContext?.designerDevice || 'desktop';",
                    _value: ""
                  },
                  components: [
                    ...new DesignerToolbarSettings()
                      .addCollapsiblePanel({
                        id: nanoid(),
                        propertyName: 'pnlFontStyle',
                        label: 'Font',
                        labelAlign: 'right',
                        parentId: styleRouterId,
                        ghost: true,
                        collapsible: 'header',
                        content: {
                          id: pnlFontStyleId,
                          components: [...new DesignerToolbarSettings()
                            .addSettingsInputRow({
                              id: nanoid(),
                              parentId: pnlFontStyleId,
                              inline: true,
                              propertyName: 'font',
                              readOnly: { _code: 'return getSettingValue(data?.readOnly);', _mode: 'code', _value: false } as any,
                              inputs: [
                                {
                                  type: 'dropdown',
                                  id: `fontFamily-${styleRouterId}`,
                                  label: 'Family',
                                  propertyName: 'font.type',
                                  hideLabel: true,
                                  dropdownOptions: fontTypes,
                                },
                                {
                                  type: 'number',
                                  id: `fontSize-${styleRouterId}`,
                                  label: 'Size',
                                  propertyName: 'font.size',
                                  hideLabel: true,
                                  width: 50,
                                },
                                {
                                  type: 'dropdown',
                                  id: `fontWeight-${styleRouterId}`,
                                  label: 'Weight',
                                  propertyName: 'font.weight',
                                  hideLabel: true,
                                  tooltip: "Controls text thickness (light, normal, bold, etc.)",
                                  dropdownOptions: fontWeights,
                                  width: 100,
                                },
                                {
                                  type: 'color',
                                  id: `fontColor-${styleRouterId}`,
                                  label: 'Color',
                                  hideLabel: true,
                                  propertyName: 'font.color',
                                },
                                {
                                  type: 'dropdown',
                                  id: `fontAlign-${styleRouterId}`,
                                  label: 'Align',
                                  propertyName: 'font.align',
                                  hideLabel: true,
                                  width: 60,
                                  dropdownOptions: textAlign,
                                },
                              ],
                            })
                            .toJson()
                          ]
                        }
                      })
                      .addCollapsiblePanel({
                        id: 'dimensionsStyleCollapsiblePanel',
                        propertyName: 'pnlDimensions',
                        label: 'Dimensions',
                        parentId: styleRouterId,
                        labelAlign: 'right',
                        ghost: true,
                        collapsible: 'header',
                        content: {
                          id: dimensionsStylePnlId,
                          components: [...new DesignerToolbarSettings()
                            .addSettingsInputRow({
                              id: nanoid(),
                              parentId: dimensionsStylePnlId,
                              inline: true,
                              readOnly: { _code: 'return getSettingValue(data?.readOnly);', _mode: 'code', _value: false } as any,
                              inputs: [
                                {
                                  type: 'text',
                                  id: `width-${styleRouterId}`,
                                  label: "Width",
                                  width: 85,
                                  propertyName: "dimensions.width",
                                  icon: "widthIcon",
                                  tooltip: "You can use any unit (%, px, em, etc). px by default if without unit"
                                },
                                {
                                  type: 'text',
                                  id: `minWidth-${styleRouterId}`,
                                  label: "Min Width",
                                  width: 85,
                                  hideLabel: true,
                                  propertyName: "dimensions.minWidth",
                                  icon: "minWidthIcon",
                                },
                                {
                                  type: 'text',
                                  id: `maxWidth-${styleRouterId}`,
                                  label: "Max Width",
                                  width: 85,
                                  hideLabel: true,
                                  propertyName: "dimensions.maxWidth",
                                  icon: "maxWidthIcon",
                                }
                              ]
                            })
                            .addSettingsInputRow({
                              id: nanoid(),
                              parentId: dimensionsStylePnlId,
                              inline: true,
                              readOnly: { _code: 'return getSettingValue(data?.readOnly);', _mode: 'code', _value: false } as any,
                              inputs: [
                                {
                                  type: 'text',
                                  id: `height-${dimensionsStylePnlId}`,
                                  label: "Height",
                                  width: 85,
                                  propertyName: "dimensions.height",
                                  icon: "heightIcon",
                                  tooltip: "You can use any unit (%, px, em, etc). px by default if without unit"
                                },
                                {
                                  type: 'text',
                                  id: `minHeight-${dimensionsStylePnlId}`,
                                  label: "Min Height",
                                  width: 85,
                                  hideLabel: true,
                                  propertyName: "dimensions.minHeight",
                                  icon: "minHeightIcon",
                                },
                                {
                                  type: 'text',
                                  id: `maxHeight-${dimensionsStylePnlId}`,
                                  label: "Max Height",
                                  width: 85,
                                  hideLabel: true,
                                  propertyName: "dimensions.maxHeight",
                                  icon: "maxHeightIcon",
                                }
                              ]
                            })
                            .addSettingsInput({
                              id: nanoid(),
                              inputType: 'dropdown',
                              propertyName: 'size',
                              label: 'Size',
                              width: '150px',
                              hidden: { _code: 'return getSettingValue(data?.dimensions?.width) || getSettingValue(data?.dimensions?.height);', _mode: 'code', _value: false } as any,
                              dropdownOptions: [
                                { value: 'small', label: 'Small' },
                                { value: 'medium', label: 'Medium' },
                                { value: 'large', label: 'Large' },
                              ]
                            })
                            .toJson()
                          ]
                        }
                      })
                      .addCollapsiblePanel({
                        id: nanoid(),
                        propertyName: 'pnlBorderStyle',
                        label: 'Border',
                        labelAlign: 'right',
                        ghost: true,
                        parentId: styleRouterId,
                        collapsible: 'header',
                        content: {
                          id: borderStylePnlId,
                          components: [...new DesignerToolbarSettings()
                            .addSettingsInputRow({
                              id: borderStyleRowId,
                              parentId: borderStylePnlId,
                              hidden: {
                                _code: 'return !getSettingValue(data[`${contexts.canvasContext?.designerDevice || "desktop"}`]?.border?.hideBorder);', _mode: 'code', _value: false
                              } as any,
                              readOnly: { _code: 'return getSettingValue(data?.readOnly);', _mode: 'code', _value: false } as any,
                              inputs: [
                                {
                                  type: 'button',
                                  id: `${borderStyleRowId}-hideBorder`,
                                  label: "Border",
                                  hideLabel: true,
                                  propertyName: "border.hideBorder",
                                  icon: "EyeOutlined",
                                  iconAlt: "EyeInvisibleOutlined"
                                },
                              ]
                            })
                            .addSettingsInputRow(
                              getBorderInputs()[0] as any
                            )
                            .addSettingsInputRow(
                              getBorderInputs()[1] as any
                            )
                            .addSettingsInputRow(
                              getBorderInputs()[2] as any
                            )
                            .addSettingsInputRow(
                              getBorderInputs()[3] as any
                            )
                            .addSettingsInputRow(
                              getBorderInputs()[4] as any
                            )
                            .addSettingsInputRow(
                              getCornerInputs()[0] as any
                            )
                            .addSettingsInputRow(
                              getCornerInputs()[1] as any
                            )
                            .addSettingsInputRow(
                              getCornerInputs()[2] as any
                            )
                            .addSettingsInputRow(
                              getCornerInputs()[3] as any
                            )
                            .addSettingsInputRow(
                              getCornerInputs()[4] as any
                            )
                            .toJson()
                          ]
                        }
                      })
                      .addCollapsiblePanel({
                        id: nanoid(),
                        propertyName: 'pnlBackgroundStyle',
                        label: 'Background',
                        labelAlign: 'right',
                        ghost: true,
                        parentId: styleRouterId,
                        collapsible: 'header',
                        content: {
                          id: backgroundStylePnlId,
                          components: [
                            ...new DesignerToolbarSettings()
                              .addSettingsInput({
                                id: `${backgroundStylePnlId}-type`,
                                parentId: backgroundStylePnlId,
                                label: "Type",
                                jsSetting: false,
                                propertyName: "background.type",
                                inputType: "radio",
                                tooltip: "Select a type of background",
                                buttonGroupOptions: [
                                  {
                                    value: "color",
                                    icon: "FormatPainterOutlined",
                                    title: "Color"
                                  },
                                  {
                                    value: "gradient",
                                    icon: "BgColorsOutlined",
                                    title: "Gradient"
                                  },
                                  {
                                    value: "image",
                                    icon: "PictureOutlined",
                                    title: "Image"
                                  },
                                  {
                                    value: "url",
                                    icon: "LinkOutlined",
                                    title: "URL"
                                  },
                                  {
                                    value: "storedFile",
                                    icon: "DatabaseOutlined",
                                    title: "Stored File"
                                  }
                                ],
                                readOnly: { _code: 'return getSettingValue(data?.readOnly);', _mode: 'code', _value: false } as any,
                              })
                              .addSettingsInputRow({
                                id: `${backgroundStylePnlId}-color`,
                                parentId: backgroundStylePnlId,
                                inputs: [{
                                  type: 'color',
                                  id: nanoid(),
                                  label: "Color",
                                  propertyName: "background.color",
                                  hideLabel: true,
                                  jsSetting: false,
                                }],
                                hidden: { _code: 'return getSettingValue(data[`${contexts.canvasContext?.designerDevice || "desktop"}`]?.background?.type) !== "color";', _mode: 'code', _value: false } as any,
                                readOnly: { _code: 'return getSettingValue(data?.readOnly);', _mode: 'code', _value: false } as any,
                              })
                              .addSettingsInputRow({
                                id: `${backgroundStylePnlId}-gradient`,
                                parentId: backgroundStylePnlId,
                                inputs: [{
                                  type: 'multiColorPicker',
                                  id: nanoid(),
                                  propertyName: "background.gradient.colors",
                                  label: "Colors",
                                  jsSetting: false,
                                }
                                ],
                                hidden: { _code: 'return getSettingValue(data[`${contexts.canvasContext?.designerDevice || "desktop"}`]?.background?.type) !== "gradient";', _mode: 'code', _value: false } as any,
                                hideLabel: true,
                                readOnly: { _code: 'return getSettingValue(data?.readOnly);', _mode: 'code', _value: false } as any,
                              })
                              .addSettingsInputRow({
                                id: `${backgroundStylePnlId}-url`,
                                parentId: backgroundStylePnlId,
                                inputs: [{
                                  type: 'text',
                                  id: nanoid(),
                                  propertyName: "background.url",
                                  jsSetting: false,
                                  label: "URL",
                                }],
                                hidden: { _code: 'return getSettingValue(data[`${contexts.canvasContext?.designerDevice || "desktop"}`]?.background?.type) !== "url";', _mode: 'code', _value: false } as any,
                                readOnly: { _code: 'return getSettingValue(data?.readOnly);', _mode: 'code', _value: false } as any,
                              })
                              .addSettingsInputRow({
                                id: `${backgroundStylePnlId}-image`,
                                parentId: backgroundStylePnlId,
                                inputs: [{
                                  type: 'imageUploader',
                                  id: 'backgroundStyle-image',
                                  propertyName: 'background.uploadFile',
                                  label: "Image",
                                  jsSetting: false,
                                }],
                                hidden: { _code: 'return getSettingValue(data[`${contexts.canvasContext?.designerDevice || "desktop"}`]?.background?.type) !== "image";', _mode: 'code', _value: false } as any,
                                readOnly: { _code: 'return getSettingValue(data?.readOnly);', _mode: 'code', _value: false } as any,
                              })
                              .addSettingsInputRow({
                                id: `${backgroundStylePnlId}-storedFile`,
                                parentId: backgroundStylePnlId,
                                hidden: { _code: 'return getSettingValue(data[`${contexts.canvasContext?.designerDevice || "desktop"}`]?.background?.type) !== "storedFile";', _mode: 'code', _value: false } as any,
                                readOnly: { _code: 'return getSettingValue(data?.readOnly);', _mode: 'code', _value: false } as any,
                                inputs: [
                                  {
                                    type: 'text',
                                    id: 'backgroundStyle-storedFile',
                                    jsSetting: false,
                                    propertyName: "background.storedFile.id",
                                    label: "File ID"
                                  }
                                ]
                              })
                              .addSettingsInputRow({
                                id: `${backgroundStylePnlId}-controls`,
                                parentId: backgroundStylePnlId,
                                inline: true,
                                readOnly: { _code: 'return getSettingValue(data?.readOnly);', _mode: 'code', _value: false } as any,
                                inputs: [
                                  {
                                    type: 'customDropdown',
                                    id: nanoid(),
                                    label: "Size",
                                    hideLabel: true,
                                    propertyName: "background.size",
                                    dropdownOptions: [
                                      {
                                        value: "cover",
                                        label: "Cover"
                                      },
                                      {
                                        value: "contain",
                                        label: "Contain"
                                      },
                                      {
                                        value: "auto",
                                        label: "Auto"
                                      }
                                    ],
                                  },
                                  {
                                    type: 'customDropdown',
                                    id: nanoid(),
                                    label: "Position",
                                    hideLabel: true,
                                    propertyName: "background.position",
                                    dropdownOptions: [
                                      {
                                        value: "center",
                                        label: "Center"
                                      },
                                      {
                                        value: "top",
                                        label: "Top"
                                      },
                                      {
                                        value: "left",
                                        label: "Left"
                                      },
                                      {
                                        value: "right",
                                        label: "Right"
                                      },
                                      {
                                        value: "bottom",
                                        label: "Bottom"
                                      },
                                      {
                                        value: "top left",
                                        label: "Top Left"
                                      },
                                      {
                                        value: "top right",
                                        label: "Top Right"
                                      },
                                      {
                                        value: "bottom left",
                                        label: "Bottom Left"
                                      },
                                      {
                                        value: "bottom right",
                                        label: "Bottom Right"
                                      }
                                    ],
                                  },
                                  {
                                    type: 'dropdown',
                                    id: nanoid(),
                                    label: "Repeat",
                                    hideLabel: true,
                                    propertyName: "background.repeat",
                                    dropdownOptions: [
                                      {
                                        value: "repeat",
                                        label: "repeat"
                                      },
                                      {
                                        value: "repeat-x",
                                        label: "repeatX"
                                      },
                                      {
                                        value: "repeat-y",
                                        label: "repeatY"
                                      },
                                      {
                                        value: "no-repeat",
                                        label: "noRepeat"
                                      }
                                    ],
                                  }
                                ]
                              })
                              .toJson()
                          ],
                        }
                      })
                      .addCollapsiblePanel({
                        id: nanoid(),
                        propertyName: 'pnlShadowStyle',
                        label: 'Shadow',
                        labelAlign: 'right',
                        ghost: true,
                        parentId: styleRouterId,
                        collapsible: 'header',
                        content: {
                          id: shadowStylePnlId,
                          components: [...new DesignerToolbarSettings()
                            .addSettingsInputRow({
                              id: nanoid(),
                              parentId: shadowStylePnlId,
                              inline: true,
                              readOnly: { _code: 'return getSettingValue(data?.readOnly);', _mode: 'code', _value: false } as any,
                              inputs: [
                                {
                                  type: 'number',
                                  id: nanoid(),
                                  label: 'Offset X',
                                  hideLabel: true,
                                  width: 60,
                                  icon: "offsetHorizontalIcon",
                                  propertyName: 'shadow.offsetX',
                                  tooltip: 'OffsetX. The larger the value, the bigger the shadow',
                                },
                                {
                                  type: 'number',
                                  id: nanoid(),
                                  label: 'Offset Y',
                                  hideLabel: true,
                                  width: 60,
                                  icon: 'offsetVerticalIcon',
                                  propertyName: 'shadow.offsetY',
                                  description: 'OffsetY. The larger the value, the bigger the shadow',
                                },
                                {
                                  type: 'number',
                                  id: nanoid(),
                                  label: 'Blur',
                                  hideLabel: true,
                                  width: 60,
                                  icon: 'blurIcon',
                                  propertyName: 'shadow.blurRadius',
                                  description: 'Blur. The larger the value, the bigger the blur',
                                },
                                {
                                  type: 'number',
                                  id: nanoid(),
                                  label: 'Spread',
                                  hideLabel: true,
                                  width: 60,
                                  icon: 'spreadIcon',
                                  propertyName: 'shadow.spreadRadius',
                                  description: 'Spread. The larger the value, the bigger the spread',
                                },
                                {
                                  type: 'color',
                                  id: nanoid(),
                                  label: 'Color',
                                  hideLabel: true,
                                  propertyName: 'shadow.color',
                                },
                              ],
                            })
                            .toJson()
                          ]
                        }
                      })
                      .addCollapsiblePanel({
                        id: nanoid(),
                        propertyName: 'stylingBox',
                        label: 'Margin & Padding',
                        labelAlign: 'right',
                        ghost: true,
                        collapsible: 'header',
                        content: {
                          id: nanoid(),
                          components: [...new DesignerToolbarSettings()
                            .addStyleBox({
                              id: nanoid(),
                              label: 'Margin Padding',
                              hideLabel: true,
                              propertyName: 'stylingBox',
                            })
                            .toJson()
                          ]
                        }
                      })
                      .addCollapsiblePanel({
                        id: nanoid(),
                        propertyName: 'style',
                        label: 'Custom Style',
                        labelAlign: 'right',
                        ghost: true,
                        parentId: styleRouterId,
                        collapsible: 'header',
                        content: {
                          id: nanoid(),
                          components: [...new DesignerToolbarSettings()
                            .addSettingsInput({
                              readOnly: { _code: 'return getSettingValue(data?.readOnly);', _mode: 'code', _value: false } as any,
                              id: nanoid(),
                              inputType: 'codeEditor',
                              propertyName: 'style',
                              hideLabel: true,
                              label: 'Style',
                              description: 'A script that returns the style of the element as an object. This should conform to CSSProperties',
                            })
                            .toJson()
                          ]
                        }
                      })
                      .toJson(),
                  ]
                })
                .toJson()
            ]
          },
          {
            key: 'security',
            title: 'Security',
            id: securityId,
            components: [...new DesignerToolbarSettings()
              .addSettingsInput({
                readOnly: { _code: 'return getSettingValue(data?.readOnly);', _mode: 'code', _value: false } as any,
                id: nanoid(),
                inputType: 'permissions',
                propertyName: 'permissions',
                label: 'Permissions',
                size: 'small',
                parentId: securityId
              })
              .toJson()
            ]
          }
        ]
      })
      .toJson(),
    formSettings: {
      colon: false,
      layout: 'vertical' as FormLayout,
      labelCol: { span: 24 },
      wrapperCol: { span: 24 }
    }
  };
};