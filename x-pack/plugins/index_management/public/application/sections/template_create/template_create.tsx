/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

import React, { useEffect, useState } from 'react';
import { RouteComponentProps } from 'react-router-dom';
import { FormattedMessage } from '@kbn/i18n-react';
import { EuiPageContentBody_Deprecated as EuiPageContentBody } from '@elastic/eui';
import { useLocation } from 'react-router-dom';
import { parse } from 'query-string';
import { ScopedHistory } from '@kbn/core/public';

import { TemplateDeserialized } from '../../../../common';
import { TemplateForm } from '../../components';
import { breadcrumbService } from '../../services/breadcrumbs';
import { saveTemplate } from '../../services/api';
import { getTemplateDetailsLink } from '../../services/routing';
import { useAppContext } from '../../app_context';

export const TemplateCreate: React.FunctionComponent<RouteComponentProps> = ({ history }) => {
  const [isSaving, setIsSaving] = useState<boolean>(false);
  const [saveError, setSaveError] = useState<any>(null);
  const {
    config: { enableLegacyTemplates },
  } = useAppContext();
  const search = parse(useLocation().search.substring(1));
  // We don't expect the `legacy` query to be used when legacy templates are disabled, however, we add the `enableLegacyTemplates` check as a safeguard
  const isLegacy = enableLegacyTemplates && Boolean(search.legacy);

  const onSave = async (template: TemplateDeserialized) => {
    const { name } = template;

    setIsSaving(true);
    setSaveError(null);

    const { error } = await saveTemplate(template);

    setIsSaving(false);

    if (error) {
      setSaveError(error);
      return;
    }

    history.push(getTemplateDetailsLink(name, template._kbnMeta.isLegacy));
  };

  const clearSaveError = () => {
    setSaveError(null);
  };

  useEffect(() => {
    breadcrumbService.setBreadcrumbs('templateCreate');
  }, []);

  return (
    <EuiPageContentBody restrictWidth style={{ width: '100%' }}>
      <TemplateForm
        title={
          isLegacy ? (
            <FormattedMessage
              id="xpack.idxMgmt.createTemplate.createLegacyTemplatePageTitle"
              defaultMessage="Create legacy template"
            />
          ) : (
            <FormattedMessage
              id="xpack.idxMgmt.createTemplate.createTemplatePageTitle"
              defaultMessage="Create template"
            />
          )
        }
        onSave={onSave}
        isSaving={isSaving}
        saveError={saveError}
        clearSaveError={clearSaveError}
        isLegacy={isLegacy}
        history={history as ScopedHistory}
      />
    </EuiPageContentBody>
  );
};
