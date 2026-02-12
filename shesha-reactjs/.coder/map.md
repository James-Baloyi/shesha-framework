CODEBASE MAP
Generated: 2026-02-12 13:12
Root: /Users/jamesbaloyi/Projects/shesha-framework/shesha-reactjs

PROJECT
  Framework: Next.js
  Name: @shesha-io/reactjs
  Description: The reactjs frontend application and ui for the shesha framework
  Entry: dist/index.js
  Scripts: test, test:watch, build, start, changelog:major, changelog:minor, changelog:patch, commit, lint, lint-errors, lint-fix, dev, build-next, start-next, prepare, type-check
  Dependencies: @ant-design/nextjs-registry, @atlaskit/pragmatic-drag-and-drop, @bprogress/next, @monaco-editor/react, @react-awesome-query-builder/antd, @reduxjs/toolkit, @scarf/scarf, @types/pluralize, @types/react-beautiful-dnd, ace-builds, async-validator, babel-plugin-module-resolver, camelcase-keys, chart.js, clean-deep, constrained-editor-plugin, convert-css-color-name-to-hex, cross-env, fast-deep-equal, filesize, html-react-parser, invert-color, jodit, jodit-react, js-encoding-utils, just-curry-it, localforage, monaco-editor, mustache, next (+26 more)
  Dev dependencies: @ant-design/cssinjs, @ant-design/icons, @babel/preset-env, @babel/preset-react, @babel/preset-typescript, @eslint/compat, @eslint/eslintrc, @eslint/js, @microsoft/signalr, @next/bundle-analyzer, @next/eslint-plugin-next, @rollup/plugin-json, @rollup/plugin-multi-entry, @rollup/plugin-node-resolve, @rollup/plugin-terser, @rollup/plugin-typescript, @simbathesailor/use-what-changed, @stylistic/eslint-plugin, @svgr/rollup, @testing-library/jest-dom (+61 more)

TESTS
  Substantive (51 test file(s))
    src/utils/metadata/__tests__/fluent.test.ts
    src/utils/fluentMigrator/__tests__/migrator.test.ts
    src/providers/form/utils/__tests__/scripts.test.ts
    src/designer-components/propertyAutocomplete/__tests__/index.test.tsx
    src/designer-components/numberField/__tests__/index.test.tsx
    src/designer-components/dataTable/__tests__/index.test.tsx
    src/designer-components/dataTable/pager/__tests__/index.test.tsx
    src/designer-components/dataTable/selectColumnsButton/__tests__/index.test.tsx
    src/designer-components/dataTable/tableContext/__tests__/index.test.tsx
    src/designer-components/dataTable/table/__tests__/index.test.tsx
    ... and 41 more

STRUCTURE
  docs/
    assets/
    getting-started/
      00-technologies.md (14b)
      01-installation.md (14b)
    guides/
      00-quickstart.md (12b)
      01-tutorials.md (11b)
    resources/
      00-brand-guidelines.md (18b)
      01-glossary.md (10b)
      02-faq.md (5b)
      03-enterprise.md (12b)
      04-built-with-shesha.md (19b)
    index.md (1.2kb)
    requirements.txt (15b)
  public/
    images/
    meta.json (3.5kb)
  src/
    apis/
      api.ts (945b)
      common.ts (263b)
      configurableComponent.ts (3.1kb)
      entities.ts (1.7kb)
      entityConfig.ts (3.0kb)
      formConfiguration.ts (1.5kb)
      metadata.ts (3.5kb)
      modelConfigurations.ts (10.4kb)
      note.ts (2.6kb)
      permission.ts (1.7kb)
      permissionedObject.ts (1.4kb)
      referenceList.ts (2.3kb)
      session.ts (1.9kb)
      settings.ts (2.2kb)
      storedFile.ts (4.3kb)
      tokenAuth.ts (774b)
      user.ts (2.9kb)
    app/
      (main)/
        dynamic/
          [...path]/
            page.tsx (1.3kb)
        settings/
          entity-configs/
            configurator/
          theme/
            page.tsx (268b)
        shesha/
          forms-designer/
            page.tsx (648b)
          playground/
            formAnalyzer.tsx (9.4kb)
            page.tsx (236b)
          settings/
            page.tsx (259b)
        layout.tsx (430b)
      configuration-studio/
        page.tsx (254b)
      login/
        page.tsx (332b)
      no-auth/
        [...path]/
          page.tsx (1.3kb)
      app-provider.tsx (1.5kb)
      layout.tsx (862b)
      page.tsx (1.4kb)
    app-components/
      global/
        confirmPasswordChecklist/
          index.tsx (579b)
        passwordChecklist/
          index.tsx (1.0kb)
        passwordConfirmPasswordInputs/
          index.tsx (2.5kb)
          utils.ts (1019b)
        validationIcon/
          index.tsx (386b)
      pages/
        account/
          forgot-password/
            styles.ts (1.1kb)
          reset-password/
            styles.ts (628b)
        login/
          styles.ts (963b)
    components/
      actionButton/
        index.tsx (1.4kb)
      actionButtonGroup/
        __tests__/
          index.test.tsx (299b)
        styles/
          styles.ts (1.1kb)
        index.tsx (2.0kb)
      antd/
        comment/
          style/
            index.tsx (3.7kb)
          index.tsx (2.9kb)
        datepicker.tsx (273b)
        index.ts (153b)
        timepicker.tsx (939b)
      appConfigurator/
        __tests__/
          index.test.tsx (299b)
        styles/
          styles.ts (6.3kb)
        configurableComponent.tsx (2.2kb)
        editModeToggler.tsx (2.1kb)
        editViewMsg.tsx (1.0kb)
        switchToEditModeConfirmation.tsx (654b)
        switchToLiveModeConfirmation.tsx (688b)
      attributeDecorator/
        index.tsx (1.8kb)
      autocomplete/
        __tests__/
          index.test.tsx (299b)
        index.tsx (20.7kb)
        models.tsx (4.1kb)
        style.ts (1.2kb)
      autocompleteTagGroup/
        index.tsx (3.4kb)
      basicDisplayFormItem/
        __tests__/
          index.test.tsx (299b)
        index.tsx (484b)
      booleanDropDown/
        index.tsx (1.1kb)
      buttonGroupConfigurator/
        buttonGroupItem.tsx (4.1kb)
        buttonGroupItemsGroup.tsx (1.7kb)
        buttonGroupListItem.tsx (1.3kb)
        buttonGroupSettingsEditor.tsx (3.8kb)
        index.tsx (2.1kb)
        itemGroupSettings.ts (5.0kb)
        itemSettings.ts (30.5kb)
        properties.tsx (2.1kb)
        utils.ts (688b)
      calendar/
        configurable-actions/
          calendar-actions-processor.tsx (316b)
          model.ts (122b)
          refresh-calendar.tsx (637b)
        styles/
          styles.ts (1.9kb)
        eventComponent.tsx (961b)
        hooks.ts (5.2kb)
        index.tsx (11.8kb)
        interfaces.ts (328b)
        utils.ts (8.1kb)
      chevron/
        index.tsx (3.9kb)
        models.ts (1.0kb)
        styles.ts (2.5kb)
      codeEditor/
        client-side/
          fileTree/
            fileTree.tsx (1.9kb)
            hooks.ts (2.3kb)
            icons.tsx (1.2kb)
            models.ts (616b)
            utils.tsx (2.9kb)
          codeEditorClientSide.tsx (12.7kb)
          codeEditorMayHaveTemplate.tsx (1.2kb)
          codeFiles.ts (6.0kb)
          constrainedCodeEditor.tsx (3.0kb)
          constrainedWrapper.ts (1.1kb)
          hooks.ts (807b)
          styles.ts (3.0kb)
          utils.ts (4.5kb)
        hocs/
          withEnvironment.tsx (2.3kb)
        codeEditor.tsx (893b)
        loadingProgressor.tsx (426b)
        models.ts (1.8kb)
      codeVariablesTable/
        index.tsx (973b)
      colorPicker/
        index.tsx (4.2kb)
      columnFilters/
        __tests__/
          index.test.tsx (299b)
        index.tsx (680b)
      columnFiltersBase/
        __tests__/
          index.test.tsx (299b)
        index.tsx (2.9kb)
      columnFiltersButtons/
        __tests__/
          index.test.tsx (299b)
        index.tsx (478b)
      columnFiltersButtonsBase/
        __tests__/
          index.test.tsx (299b)
        styles/
          styles.ts (957b)
        index.tsx (1.2kb)
      columnItemFilter/
        __tests__/
          index.test.tsx (299b)
        styles/
          styles.ts (2.0kb)
        index.tsx (15.4kb)
      columnsFilterSelect/
        __tests__/
          index.test.tsx (299b)
        index.tsx (497b)
      columnsFilterSelectBase/
        __tests__/
          index.test.tsx (299b)
        styles/
          styles.ts (885b)
        index.tsx (1.5kb)
      componentErrors/
        styles/
          errorIconPopoverStyles.ts (2.7kb)
          styles.ts (3.0kb)
        component-docs.json (6.0kb)
        errorIconPopover.tsx (5.8kb)
        index.tsx (925b)
      conditionalWrapper/
        index.tsx (381b)
      configurableComponent/
        index.tsx (2.8kb)
      configurableComponentRenderer/
        styles/
          styles.ts (929b)
        componentSettingsModal.tsx (1.0kb)
        index.tsx (4.0kb)
      configurableForm/
        __tests__/
          index.test.tsx (299b)
        styles/
          styles.ts (3.0kb)
        configurableFormRenderer.tsx (3.7kb)
        dataLoadingError.tsx (900b)
        dualModeForm.json (7.7kb)
        formInfo.tsx (3.9kb)
        formWithFlatMarkup.tsx (2.4kb)
        index.tsx (6.6kb)
        markupLoadingError.tsx (813b)
        models.ts (5.8kb)
        useActionEndpoint.tsx (3.8kb)
      configurableItemAutocomplete/
        entityTypeAutocomplete.tsx (7.5kb)
        formAutocomplete.tsx (779b)
        generic.tsx (11.6kb)
        index.tsx (1.2kb)
        notificationAutocomplete.tsx (710b)
        notificationChannelAutocomplete.tsx (734b)
        referenceListAutocomplete.tsx (697b)
        roleAutocomplete.tsx (641b)
      configurableLogo/
        __tests__/
          index.test.tsx (299b)
        index.tsx (1.0kb)
        utils.ts (88b)
      configurableSidebarMenu/
        configurator/
          groupSettings.json (1.8kb)
          groupSettings.ts (2.7kb)
          index.tsx (2.0kb)
          itemGroupHeader.tsx (1.8kb)
          itemProperties.tsx (2.1kb)
          itemSettings.json (3.7kb)
          itemSettings.ts (4.5kb)
          sidebarListGroup.tsx (1.5kb)
          sidebarListItem.tsx (1.2kb)
          sidebarListItemCommon.tsx (1.1kb)
        index.tsx (2.9kb)
        settingsModal.tsx (1.1kb)
      configurationFramework/
        itemsExport/
          filter.tsx (1.6kb)
          index.tsx (5.6kb)
          models.ts (220b)
        itemsImport/
          styles/
            styles.ts (685b)
          index.tsx (5.1kb)
          models.ts (472b)
        packageContent/
          descriptionCell.tsx (923b)
          index.tsx (1.8kb)
          models.tsx (1.4kb)
          packageItemsTable.tsx (692b)
          statusCell.tsx (1.5kb)
        models.ts (1.1kb)
      currencyConverter/
        index.tsx (1.7kb)
      customErrorBoundary/
        styles/
          styles.ts (1.2kb)
        fallbackComponent.tsx (2.8kb)
        index.tsx (934b)
      customFile/
        __tests__/
          index.test.tsx (299b)
        index.tsx (3.1kb)
      ... (truncated)
    ... (truncated)
  ... (truncated)

SYMBOLS
  eslint.config.mjs
    makeStrictConfig (const)
  next.config.js
    nextConfig (const)
  src/apis/api.ts
    AutocompleteItemDto (interface), AutocompleteItemDtoListAjaxResponse (type)
    ApiEndpointsQueryParams (interface), UseApiEndpointsProps (type)
    useApiEndpoints (const)
  src/apis/common.ts
    GuidEntityReferenceDto (interface)
  src/apis/configurableComponent.ts
    ConfigurableComponentGetByNameQueryParams (interface)
    ConfigurableComponentDto (interface), ConfigurableComponentDtoAjaxResponse (type)
    configurableComponentGetByNameProps (type), configurableComponentGetByName (const)
    ConfigurableComponentUpdateSettingsQueryParams (interface)
    ConfigurableComponentUpdateSettingsInput (interface)
    configurableComponentUpdateSettingsProps (type)
    configurableComponentUpdateSettings (const)
  src/apis/entities.ts
    IDynamicDataResult (interface), EntitiesGetQueryParams (interface)
    entitiesGetProps (type), entitiesGet (const), EntitiesGetAllQueryParams (interface)
    UseEntitiesGetAllProps (type), useEntitiesGetAll (const)
  src/apis/entityConfig.ts
    MetadataSourceType (type), EntityConfigTypes (type), EntityConfigDto (interface)
    FormIdFullNameDto (interface), FormIdFullNameDtoAjaxResponse (type)
    EntityConfigGetEntityConfigFormQueryParams (interface)
    entityConfigGetEntityConfigFormProps (type), entityConfigGetEntityConfigForm (const)
    EntityConfigDtoPagedResultDto (interface)
    EntityConfigDtoPagedResultDtoAjaxResponse (type)
    EntityConfigGetMainDataListQueryParams (interface)
    UseEntityConfigGetMainDataListProps (type), useEntityConfigGetMainDataList (const)
  src/apis/formConfiguration.ts
    FormUpdateMarkupInput (interface), FormPermissionsDto (interface)
    FormPermissionsDtoAjaxResponse (type)
    FormConfigurationCheckPermissionsQueryParams (interface)
    formConfigurationCheckPermissionsProps (type), formConfigurationCheckPermissions (const)
  src/apis/metadata.ts
    MetadataSourceType (type), PropertyMetadataDto (interface), MetadataDto (interface)
    MetadataDtoAjaxResponse (type), MetadataGetQueryParams (interface)
    metadataGetProps (type), metadataGet (const), UseMetadataGetProps (type)
    useMetadataGet (const)
  src/apis/modelConfigurations.ts
    RefListPermissionedAccess (type), MetadataSourceType (type)
    MetadataSourceTypeApplication (const), MetadataSourceTypeUseDefined (const)
    PermissionedObjectDto (interface), IHasDefaultEditor (interface), IHasFilter (interface)
    INumberFormatting (interface), IDecimalFormatting (interface)
    IEntityPropertyListDbMapping (interface), EntityPropertyListMappingType (type)
    EntityInitFlags (enum), IEntityPropertyListConfiguration (interface)
    ModelPropertyDto (interface), ConfigurationItemVersionStatus (type)
    EntityConfigTypes (type), FormIdFullNameDto (interface)
    EntityViewConfigurationDto (interface), ModelConfigurationDto (interface)
    ModelConfigurationsGetByIdPathParams (interface), modelConfigurationsGetByIdProps (type)
    modelConfigurationsGetById (const), modelConfigurationsUpdateProps (type)
    modelConfigurationsUpdate (const), modelConfigurationsCreateProps (type)
  src/apis/note.ts
    NoteDto (interface), CreateNoteDto (interface), NoteGetListQueryParams (interface)
    NoteDtoListAjaxResponse (type), UseNoteGetListProps (type), useNoteGetList (const)
    useNoteCreate (const), useNoteUpdate (const)
  src/apis/permission.ts
    PermissionDto (interface), PermissionGetAllTreeQueryParams (interface)
    PermissionDtoListAjaxResponse (type), UsePermissionGetAllTreeProps (type)
    usePermissionGetAllTree (const), usePermissionUpdateParent (const)
    PermissionDeleteQueryParams (interface), usePermissionDelete (const)
  src/apis/permissionedObject.ts
    PermissionedObjectDto (interface), PermissionedObjectDtoListAjaxResponse (type)
    PermissionedObjectGetAllTreeQueryParams (interface)
    UsePermissionedObjectGetAllTreeProps (type), usePermissionedObjectGetAllTree (const)
  src/apis/referenceList.ts
    GuidNullableEntityReferenceDto (interface), ReferenceListItemDto (interface)
    ReferenceListGetByNameQueryParams (interface), ConfigurationItemVersionStatus (type)
    ReferenceListWithItemsDto (interface), ReferenceListWithItemsDtoAjaxResponse (type)
    referenceListGetByNameProps (type)
  src/apis/session.ts
    GrantedPermissionDto (interface), InitializationErrorsInfoDto (interface)
    UserLoginInfoDto (interface), ApplicationInfoDto (interface)
    TenantLoginInfoDto (interface), GetCurrentLoginInfoOutput (interface)
    GetCurrentLoginInfoOutputAjaxResponse (type), sessionGetCurrentLoginInfoProps (type)
    sessionGetCurrentLoginInfo (const)
  src/apis/settings.ts
    ObjectAjaxResponse (type), SettingsGetValueQueryParams (interface)
    settingsGetValueProps (type), settingsGetValue (const)
    SettingsUpdateValueQueryParams (interface), UpdateSettingValueInput (interface)
    settingsUpdateValueProps (type), settingsUpdateValue (const)
  src/apis/storedFile.ts
    StoredFileDeleteQueryParams (interface), StoredFileVersionInfoDto (interface)
    StoredFileDto (interface), StoredFileGetQueryParams (interface)
    StoredFileDtoAjaxResponse (type), UseStoredFileGetProps (type)
    StoredFileGetEntityPropertyQueryParams (interface), useStoredFileGet (const)
    UseStoredFileGetEntityPropertyProps (type), useStoredFileGetEntityProperty (const)
    StoredFileGetFileVersionsQueryParams (interface)
    StoredFileGetFileVersionsPathParams (interface)
    StoredFileVersionInfoDtoListAjaxResponse (type)
    UseStoredFileGetFileVersionsProps (type), useStoredFileGetFileVersions (const)
    DeleteFileByIdInput (interface), useDeleteFileById (const)
  src/apis/tokenAuth.ts
    AuthenticateResultType (type), AuthenticateResultModel (interface)
    AuthenticateResultModelAjaxResponse (type), AuthenticateModel (interface)
  src/apis/user.ts
    ResetPasswordVerifyOtpInput (interface), ResetPasswordVerifyOtpResponse (interface)
    ResetPasswordUsingTokenInput (interface)
    UserResetPasswordSendOtpQueryParams (interface)
    ResetPasswordSendOtpResponse (interface)
    ResetPasswordSendOtpResponseAjaxResponse (type), ResetPasswordVerifyOtpInput (interface)
    UserResetPasswordSendOtpQueryParams (interface)
    ResetPasswordVerifyOtpResponse (interface)
    ResetPasswordVerifyOtpResponseAjaxResponse (type), useResetPasswordSendOtp (const)
    useResetPasswordVerifyOtp (const), BooleanAjaxResponse (type)
    useUserResetPasswordUsingToken (const)
  src/app/(main)/layout.tsx
    CommonLayout (fn)
  src/app/(main)/shesha/playground/formAnalyzer.tsx
    getNormalizedName (const), isComponent (const), parseUrlPureRegex (fn)
    extractPathsSimple (fn), findSpecificRefs (const), FormAnalyzer (const)
  src/app/app-provider.tsx
    IAppProviderProps (interface), AppProvider (const)
  src/app/layout.tsx
    RootLayout (fn)
  src/app-components/global/confirmPasswordChecklist/index.tsx
    ConfirmPasswordChecklist (const)
  src/app-components/global/passwordChecklist/index.tsx
    PasswordChecklist (const)
  src/app-components/global/passwordConfirmPasswordInputs/index.tsx
    IPasswordConfirmPassword (interface), IPasswordConfirmPasswordInputsProps (interface)
  src/app-components/global/passwordConfirmPasswordInputs/utils.ts
    passwordValidations (const), confirmPasswordValidations (const)
  src/app-components/global/validationIcon/index.tsx
    ValidationIcon (const)
  src/app-components/pages/account/forgot-password/styles.ts
    ForgotPasswordPage (const), VerifyOtpModal (const)
  src/app-components/pages/account/reset-password/styles.ts
    ResetPasswordContainer (const)
  src/app-components/pages/login/styles.ts
    LoginPageWrapper (const)
  src/components/actionButton/index.tsx
    IActionButtonProps (interface)
  src/components/actionButtonGroup/__tests__/index.test.tsx
    SimpleComponent (fn)
  src/components/actionButtonGroup/index.tsx
    IActionButtonGroupProps (interface), ActionButtonGroup (const)
  src/components/actionButtonGroup/styles/styles.ts
    useStyles (const)
  src/components/antd/comment/index.tsx
    CommentProps (interface)
  src/components/antd/comment/style/index.tsx
    genSharedButtonStyle (const), useStyle (fn)
  src/components/antd/timepicker.tsx
    TimePickerProps (type), TimePicker (const), TimePickerRangeProps (type)
    TimeRangePicker (const)
  src/components/appConfigurator/__tests__/index.test.tsx
    SimpleComponent (fn)
  src/components/appConfigurator/configurableComponent.tsx
    IComponentStateProps (interface), IOverlayProps (interface)
    ConfigurableComponentChildrenFn (type), IConfigurableComponentProps (interface)
    IBlockOverlayProps (interface), ConfigurableComponent (const)
  src/components/appConfigurator/editModeToggler.tsx
    AppEditModeToggler (const)
  src/components/appConfigurator/editViewMsg.tsx
    IEditViewMsgProps (interface), EditViewMsg (const)
  src/components/appConfigurator/styles/styles.ts
    useStyles (const)
  src/components/appConfigurator/switchToEditModeConfirmation.tsx
    SwitchToEditModeConfirmation (const)
  src/components/appConfigurator/switchToLiveModeConfirmation.tsx
    SwitchToLiveModeConfirmation (const)
  src/components/autocomplete/__tests__/index.test.tsx
    SimpleComponent (fn)
  src/components/autocomplete/index.tsx
    getNormalizedValues (const), EntityDtoAutocomplete (const), RawAutocomplete (const)
  src/components/autocomplete/models.tsx
    getColumns (fn), AutocompleteDataSourceType (type), QueryParamFunc (type)
    FilterSelectedFunc (type), KayValueFunc (type), DisplayValueFunc (type)
    OutcomeValueFunc (type), ISelectOption (interface), IAutocompleteBaseProps (interface)
    IAutocompleteProps (type)
  src/components/autocomplete/style.ts
    useStyles (const)
  src/components/autocompleteTagGroup/index.tsx
    IAutocompleteTagGroupProps (interface), AutocompleteTagGroup (const)
  src/components/basicDisplayFormItem/__tests__/index.test.tsx
    SimpleComponent (fn)
  src/components/basicDisplayFormItem/index.tsx
    IBasicDisplayFormItemProps (interface), BasicDisplayFormItem (const)
  src/components/booleanDropDown/index.tsx
    BooleanDropDown (const)
  src/components/buttonGroupConfigurator/buttonGroupItem.tsx
    IButtonGroupItemProps (interface), ButtonGroupItem (const)
  src/components/buttonGroupConfigurator/buttonGroupItemsGroup.tsx
    IContainerRenderArgs (interface), IButtonGroupItemsGroupProps (interface)
    ButtonGroupItemsGroup (const)
  src/components/buttonGroupConfigurator/buttonGroupListItem.tsx
    IButtonGroupListItemProps (interface), ButtonGroupListItem (const)
  src/components/buttonGroupConfigurator/buttonGroupSettingsEditor.tsx
    ButtonGroupSettingsEditorProps (interface), ButtonGroupSettingsEditor (const)
  src/components/buttonGroupConfigurator/index.tsx
    IToolbarSettingsModal (interface), ButtonGroupConfigurator (const)
  src/components/buttonGroupConfigurator/itemGroupSettings.ts
    getGroupSettings (const)
  src/components/buttonGroupConfigurator/itemSettings.ts
    getItemSettings (const)
  src/components/buttonGroupConfigurator/properties.tsx
    IButtonGroupPropertiesProps (interface), ButtonGroupProperties (const)
  src/components/buttonGroupConfigurator/utils.ts
    initialValues (const)
  src/components/calendar/configurable-actions/calendar-actions-processor.tsx
    CalendarActionsAccessor (const)
  src/components/calendar/configurable-actions/model.ts
    CALENDAR_ACTIONS_OWNER (const), CALENDAR_CONFIGURABLE_ACTIONS (const)
  src/components/calendar/configurable-actions/refresh-calendar.tsx
    useRefreshCalendarAction (const)
  src/components/calendar/eventComponent.tsx
    EventComponent (const)
  src/components/calendar/hooks.ts
    NestedPropertyMetadatAccessor (type), useCalendarLayers (const)
  src/components/calendar/index.tsx
    CalendarControl (const)
  src/components/calendar/interfaces.ts
    IEventComponentProps (interface), ILayerWithMetadata (interface)
  src/components/calendar/styles/styles.ts
    useCalendarStyles (const)
  src/components/calendar/utils.ts
    getLayerEventItems (const), getLayerEventsData (const), getLayerOptions (const)
    getQueryProperties (const), getCalendarRefetchParams (const), getLayerEvents (const)
    getResponseListToState (const), addPx (const), evaluateFilterAsync (const)
    evaluateFilters (const), isDateDisabled (const), getDayStyles (const)
  src/components/chevron/index.tsx
    ChevronControl (const)
  src/components/chevron/models.ts
    RefListGroupItemProps (type), IRefListGroupItemBase (interface)
    IRefListItemFormModel (type), IRefListItemGroup (interface), IChevronProps (interface)
    IChevronControlProps (interface), IChevronButton (interface)
  src/components/chevron/styles.ts
    useStyles (const)
  src/components/codeEditor/client-side/codeEditorClientSide.tsx
    isChildEditor (const), prefixPath (const), prefixFilePath (const), prefixLibPath (const)
  src/components/codeEditor/client-side/codeEditorMayHaveTemplate.tsx
    ICodeEditorMayHaveTemplateProps (interface), CodeEditorMayHaveTemplate (const)
  src/components/codeEditor/client-side/codeFiles.ts
    ISourceCodeFile (interface), BuildSourceCodeFilesArgs (type)
    BuildSourceCodeFilesResponse (type), getVariablesFileName (const)
    getResponseFileName (const), fetchProperties (const), getVariablesImportBlock (const)
    getResultTypeName (const), buildCodeEditorEnvironmentAsync (const)
  src/components/codeEditor/client-side/constrainedCodeEditor.tsx
    IConstrainedCodeEditorProps (interface), ConstrainedCodeEditor (const)
  src/components/codeEditor/client-side/constrainedWrapper.ts
    constrainedMonaco (const), ValueInEditableRanges (interface), EditableRange (interface)
    EditableRangesDictionary (interface), onChangeCallback (type)
    ConstrainedTextModel (interface), isConstrainedTextModel (const)
  src/components/codeEditor/client-side/fileTree/fileTree.tsx
    IFileTreeProps (interface), FileTree (const)
  src/components/codeEditor/client-side/fileTree/hooks.ts
    useSourcesTree (const), mapFileItemToNode (const), TreeNodeMap (interface)
    UseTreeNodesResponse (interface), useSourcesTreeNodes (const)
  src/components/codeEditor/client-side/fileTree/icons.tsx
    getNodeIcon (const)
  src/components/codeEditor/client-side/fileTree/models.ts
    FileItemType (enum), FileItemProps (interface), SourceFile (interface)
    Directory (interface), FileTreeNode (type)
  src/components/codeEditor/client-side/fileTree/utils.tsx
    isDirectory (const), isFile (const), getSourcesDirectory (const), getSourcesTree (const)
  src/components/codeEditor/client-side/hooks.ts
    SubscriptionsManager (type), useDisposableSubscriptions (const)
  src/components/codeEditor/client-side/styles.ts
    useStyles (const)
  src/components/codeEditor/client-side/utils.ts
    ConstrainedInstance (interface), CodeRestriction (interface), TextRange (interface)
    TextTemplate (interface), getLastCharPosition (const), getLeadingWhiteSpaces (const)
    Placeholder (type), PlaceholderEvaluatorContext (type), PlaceholderEvaluator (type)
    isPlaceholderEvaluator (const), makeCodeTemplate (const), TemplateEvaluator (type)
    isRange (const), isPosition (const)
  src/components/codeEditor/codeEditor.tsx
    CodeEditor (const)
  src/components/codeEditor/hocs/withEnvironment.tsx
    withEnvironment (fn)
  src/components/codeEditor/loadingProgressor.tsx
    ICodeEditorLoadingProgressorProps (interface), CodeEditorLoadingProgressor (const)
  src/components/codeEditor/models.ts
    IHasCodeTemplate (interface), IMonacoEditorProps (interface)
    IGenericCodeEditorProps (interface), CodeTemplateSettings (interface), ResultType (type)
    isObjectType (const), isArrayType (const), isEntityType (const)
    ICodeEditorProps (interface), CODE_TEMPLATE_DEFAULTS (const)
  src/components/codeVariablesTable/index.tsx
    ICodeExposedVariable (interface), ICodeVariablesTableProps (interface)
    CodeVariablesTables (const)
  src/components/colorPicker/index.tsx
    IColorPickerProps (interface), formatColor (const), readThemeColor (const)
    ColorPicker (const)
  src/components/columnFilters/__tests__/index.test.tsx
    SimpleComponent (fn)
  src/components/columnFilters/index.tsx
    ColumnFilters (const)
  src/components/columnFiltersBase/__tests__/index.test.tsx
    SimpleComponent (fn)
  src/components/columnFiltersBase/index.tsx
    IColumnFiltersBaseProps (interface), ColumnFiltersBase (const)
  src/components/columnFiltersButtons/__tests__/index.test.tsx
    SimpleComponent (fn)
  src/components/columnFiltersButtons/index.tsx
    ColumnFiltersButtons (const)
  src/components/columnFiltersButtonsBase/__tests__/index.test.tsx
    SimpleComponent (fn)
  src/components/columnFiltersButtonsBase/index.tsx
    IColumnFiltersButtonsBaseProps (interface), ColumnFiltersButtonsBase (const)
  src/components/columnFiltersButtonsBase/styles/styles.ts
    useStyles (const)
  src/components/columnItemFilter/__tests__/index.test.tsx
    SimpleComponent (fn)
  src/components/columnItemFilter/index.tsx
    getFilterOptions (const), IColumnItemFilterProps (interface), ColumnItemFilter (const)
  src/components/columnItemFilter/styles/styles.ts
    useStyles (const)
  src/components/columnsFilterSelect/__tests__/index.test.tsx
    SimpleComponent (fn)
  src/components/columnsFilterSelect/index.tsx
    ColumnsFilterSelect (const)
  src/components/columnsFilterSelectBase/__tests__/index.test.tsx
    SimpleComponent (fn)
  src/components/columnsFilterSelectBase/index.tsx
    IColumnsFilterSelectBaseProps (interface), ColumnsFilterSelectBase (const)
  src/components/columnsFilterSelectBase/styles/styles.ts
    useStyles (const)
  src/components/componentErrors/errorIconPopover.tsx
    IErrorIconPopoverProps (type), ErrorIconPopover (const)
  src/components/componentErrors/index.tsx
    IComponentErrorProps (interface)
  src/components/componentErrors/styles/errorIconPopoverStyles.ts
    useStyles (const)
  src/components/componentErrors/styles/styles.ts
    useStyles (const)
  src/components/conditionalWrapper/index.tsx
    IConditionalWrapProps (interface), ConditionalWrap (const)
  src/components/configurableComponent/index.tsx
    IComponentStateProps (interface), IOverlayProps (interface)
    ConfigurableComponentChildrenFn (type), ISettingsEditorProps (interface)
    ISettingsEditor (interface), ComponentSettingsMigrationContext (type)
    ComponentSettingsMigrator (type), IConfigurableApplicationComponentProps (interface)
    IBlockOverlayProps (interface), ConfigurableApplicationComponent (const)
  src/components/configurableComponentRenderer/componentSettingsModal.tsx
    IProps (interface), ComponentSettingsModal (const)
  src/components/configurableComponentRenderer/index.tsx
    IComponentStateProps (interface), IOverlayProps (interface)
    ConfigurableComponentChildrenFn (type), IConfigurableComponentRendererProps (interface)
    IBlockOverlayProps (interface), ConfigurableComponentRenderer (const)
  src/components/configurableComponentRenderer/styles/styles.ts
    useStyles (const)
  src/components/configurableForm/__tests__/index.test.tsx
    SimpleComponent (fn)
  src/components/configurableForm/configurableFormRenderer.tsx
    ConfigurableFormRenderer (const)
  src/components/configurableForm/dataLoadingError.tsx
    DataLoadingError (const)
  src/components/configurableForm/formInfo.tsx
    FormInfoProps (interface), FormInfo (const)
  src/components/configurableForm/formWithFlatMarkup.tsx
    IFormWithFlatMarkupProps (type), FormWithFlatMarkup (const)
    FormWithFlatMarkupMemo (const)
  src/components/configurableForm/index.tsx
    ConfigurableFormProps (type), ConfigurableForm (const)
  src/components/configurableForm/markupLoadingError.tsx
    MarkupLoadingError (const)
  src/components/configurableForm/models.ts
    IConfigurableFormRendererProps (interface), IConfigurableFormRuntimeProps (type)
    MarkupLoadingErrorRenderProps (type), DataLoadingErrorRenderProps (type)
    IConfigurableFormRenderingProps (type), IConfigurableFormProps (type)
    IDataSourceComponent (interface), SheshaFormProps (type)
  src/components/configurableForm/styles/styles.ts
    useStyles (const), ShaFormStyles (const)
  src/components/configurableForm/useActionEndpoint.tsx
    GetDefaultActionUrlPayload (interface), GetFormActionUrlPayload (interface)
    IEntityEndpointsEvaluator (interface), useModelApiHelper (const)
    UseEntityEndpointArguments (interface), useModelApiEndpoint (const)
  src/components/configurableItemAutocomplete/entityTypeAutocomplete.tsx
    EntityIdentifier (type), EntityTypeAutocompleteType (type), isEntityByEntityId (const)
    getDisplayText (const), getEntityIdentifier (const), getListFetcherQueryParams (const)
    EntityTypeAutocomplete (const)
  src/components/configurableItemAutocomplete/formAutocomplete.tsx
    IFormAutocompleteRuntimeProps (type), FormAutocomplete (const)
  src/components/configurableItemAutocomplete/generic.tsx
    StandardAutocompleteProps (type), ConfigurableItemAutocompleteRuntimeProps (type)
    getFilter (const), itemIdsEqual (const), getListFetcherQueryParams (const)
    getSelectedValueQueryParams (const), getItemValue (const), getDisplayText (const)
    GenericConfigurableItemAutocompleteInternal (const)
    GenericConfigItemAutocomplete (const)
