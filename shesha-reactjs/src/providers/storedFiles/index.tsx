import React, { FC, useReducer, useContext, PropsWithChildren, useEffect } from 'react';
import { storedFilesReducer } from './reducer';
import {
  StoredFilesActionsContext,
  StoredFilesStateContext,
  STORED_FILES_CONTEXT_INITIAL_STATE,
  IStoredFile,
  IUploadFilePayload,
  IDownloadZipPayload,
  IDownloadFilePayload,
} from './contexts';
import { getFlagSetters } from '../utils/flagsSetters';
import {
  uploadFileSuccessAction,
  uploadFileErrorAction,
  deleteFileRequestAction,
  deleteFileSuccessAction,
  deleteFileErrorAction,
  fetchFileListSuccessAction,
  fetchFileListErrorAction,
  uploadFileRequestAction,
  downloadZipRequestAction,
  downloadZipSuccessAction,
  downloadZipErrorAction,
  onFileAddedAction,
  onFileDeletedAction,
  /* NEW_ACTION_IMPORT_GOES_HERE */
} from './actions';
import axios from 'axios';
import FileSaver from 'file-saver';
import qs from 'qs';
import { useGet, useMutate } from 'hooks';
import { useSignalR } from '../signalR';
import { useApplicationConfiguration } from '../../hooks';
import { useSheshaApplication } from '../sheshaApplication';
import { useDelayedUpdate } from 'providers/delayedUpdateProvider';
import { STORED_FILES_DELAYED_UPDATE } from 'providers/delayedUpdateProvider/models';
import { IApiEndpoint } from 'interfaces/metadata';
import { useDeleteFileById } from 'apis/storedFile';
export interface IStoredFilesProviderProps {
  ownerId: string;
  ownerType: string;
  ownerName?: string;
  filesCategory?: string;
  propertyName?: string;
  allCategories?: boolean;
  baseUrl?: string;
}

const fileReducer = (data: IStoredFile): IStoredFile => {
  return { ...data, uid: data.id };
};

const filesReducer = (data: IStoredFile[]): IStoredFile[] => data.map(file => fileReducer(file));

const uploadFileEndpoint: IApiEndpoint = { url: '/api/StoredFile/Upload', httpVerb: 'POST' };
const filesListEndpoint: IApiEndpoint = { url: '/api/StoredFile/FilesList', httpVerb: 'GET' };


const StoredFilesProvider: FC<PropsWithChildren<IStoredFilesProviderProps>> = ({
  children,
  ownerId,
  ownerType,
  ownerName,
  filesCategory,
  propertyName,
  baseUrl,
  allCategories = true,
}) => {
  const [state, dispatch] = useReducer(storedFilesReducer, {
    ...STORED_FILES_CONTEXT_INITIAL_STATE,
    ownerId,
    ownerType,
    ownerName,
    filesCategory,
    propertyName,
    allCategories,
  });

  const { connection } = useSignalR(false) ?? {};
  const { httpHeaders: headers } = useSheshaApplication();
  const { config } = useApplicationConfiguration();
  const { addItem: addDelayedUpdate, removeItem: removeDelayedUpdate } = useDelayedUpdate(false) ?? {};

  const { loading: isFetchingFileList, refetch: fetchFileListHttp, data: fileListResponse } = useGet(
    {
      path: filesListEndpoint.url,
      queryParams: {
        ownerId,
        ownerType,
        ownerName,
        filesCategory,
        propertyName,
        allCategories,
      },
      lazy: true,
    });

  const { mutate: uploadFileHttp } = useMutate();

  useEffect(() => {
    if ((ownerId || '') !== '' && (ownerType || '') !== '') {
      fetchFileListHttp();
    }
  }, [ownerId, ownerType, filesCategory, propertyName, allCategories]);

  useEffect(() => {
    if (!isFetchingFileList) {
      if (fileListResponse) {
        // @ts-ignore
        const { result } = fileListResponse;
        const fileList = filesReducer(result as IStoredFile[]);

        dispatch(fetchFileListSuccessAction(fileList));
      } else {
        dispatch(fetchFileListErrorAction());
      }
    }
  }, [isFetchingFileList]);

  //#region Register signal r events
  useEffect(() => {
    connection?.on('OnFileAdded', (eventData: IStoredFile | string) => {
      const patient = typeof eventData === 'object' ? eventData : (JSON.parse(eventData) as IStoredFile);

      dispatch(onFileAddedAction(patient));
    });

    connection?.on('OnFileDeleted', (eventData: IStoredFile | string) => {
      const patient = typeof eventData === 'object' ? eventData : (JSON.parse(eventData) as IStoredFile);

      dispatch(onFileDeletedAction(patient?.id));
    });
  }, []);
  //#endregion

  const uploadFile = (payload: IUploadFilePayload) => {
    const formData = new FormData();

    const { file } = payload;

    formData.append('ownerId', payload.ownerId || state.ownerId);
    formData.append('ownerType', payload.ownerType || state.ownerType);
    formData.append('ownerName', payload.ownerName || state.ownerName);
    formData.append('file', file);
    formData.append('filesCategory', `${filesCategory}`);
    formData.append('propertyName', '');

    // @ts-ignore
    const newFile: IStoredFile = { uid: '', ...file, status: 'uploading', name: file.name };

    if (!(Boolean(payload.ownerId || state.ownerId)) && typeof addDelayedUpdate !== 'function') {
      console.error('File list component is not configured');
      dispatch(uploadFileErrorAction({ ...newFile, uid: '-1', status: 'error', error: 'File list component is not configured' }));
      return;
    }

    dispatch(uploadFileRequestAction(newFile));

    uploadFileHttp(uploadFileEndpoint, formData)
      .then(response => {
        const responseFile = response.result as IStoredFile;
        responseFile.uid = newFile.uid;
        dispatch(uploadFileSuccessAction({ ...responseFile }));

        if (responseFile.temporary && typeof addDelayedUpdate === 'function')
          addDelayedUpdate(STORED_FILES_DELAYED_UPDATE, responseFile.id, { ownerName: payload.ownerName || state.ownerName });
      })
      .catch(e => {
        console.error(e);
        dispatch(uploadFileErrorAction({ ...newFile, status: 'error' }));
      });
  };

  const { mutate: deleteFileHttp } = useDeleteFileById();

  //#region delete file
  const deleteFile = (fileIdToDelete: string) => {
    dispatch(deleteFileRequestAction(fileIdToDelete));

    deleteFileHttp({ id: fileIdToDelete })
      .then(() => {
        deleteFileSuccess(fileIdToDelete);
        if (typeof addDelayedUpdate === 'function')
          removeDelayedUpdate(STORED_FILES_DELAYED_UPDATE, fileIdToDelete);
      })
      .catch(() => deleteFileError());
  };

  const deleteFileSuccess = (fileIdToDelete: string) => {
    dispatch(deleteFileSuccessAction(fileIdToDelete));
  };

  const deleteFileError = () => {
    dispatch(deleteFileErrorAction());
  };
  //#endregion

  const downloadZipFile = (payload: IDownloadZipPayload = null) => {
    dispatch(downloadZipRequestAction());
    axios({
      url: `${baseUrl ?? config?.baseUrl}/api/StoredFile/DownloadZip?${qs.stringify(
        payload || { ownerId: state.ownerId, ownerType: state.ownerType }
      )}`,
      method: 'GET',
      responseType: 'blob',
      headers,
    })
      .then(response => {
        dispatch(downloadZipSuccessAction());
        FileSaver.saveAs(new Blob([response.data]), `Files.zip`);
      })
      .catch(() => {
        dispatch(downloadZipErrorAction());
      });
  };

  const downloadFile = (payload: IDownloadFilePayload) => {
    const url = `${baseUrl}/api/StoredFile/Download?${qs.stringify({
      id: payload.fileId,
    })}`;
    axios({
      url,
      method: 'GET',
      responseType: 'blob',
      headers,
    })
      .then(response => {
        FileSaver.saveAs(new Blob([response.data]), payload.fileName);
      })
      .catch(e => {
        console.error(e);
      });
  };

  /* NEW_ACTION_DECLARATION_GOES_HERE */

  return (
    <StoredFilesStateContext.Provider value={state}>
      <StoredFilesActionsContext.Provider
        value={{
          ...getFlagSetters(dispatch),
          uploadFile,
          deleteFile,
          downloadZipFile,
          downloadFile,
          /* NEW_ACTION_GOES_HERE */
        }}
      >
        {children}
      </StoredFilesActionsContext.Provider>
    </StoredFilesStateContext.Provider>
  );
};

function useStoredFilesState() {
  const context = useContext(StoredFilesStateContext);

  if (context === undefined) {
    throw new Error('useStoredFilesState must be used within a StoredFilesProvider');
  }

  return context;
}

function useStoredFilesActions() {
  const context = useContext(StoredFilesActionsContext);

  if (context === undefined) {
    throw new Error('useStoredFilesActions must be used within a StoredFilesProvider');
  }

  return context;
}

function useStoredFilesStore() {
  return { ...useStoredFilesState(), ...useStoredFilesActions() };
}

export default StoredFilesProvider;

/**
 * @deprecated - use useStoredFilesStore
 */
const useStoredFiles = useStoredFilesStore;

export { StoredFilesProvider, useStoredFilesState, useStoredFilesActions, useStoredFiles, useStoredFilesStore };