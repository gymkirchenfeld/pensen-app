/**
 * Provides a Vue plugin for accessing an API.
 **/

/* https://gist.github.com/devloco/5f779216c988438777b76e7db113d05c */
function extractFileName(header) {
  if (!header) return 'download.pdf';
  let contentDispostion = header.split(';');
  const fileNameToken = `filename=`;
  let fileName = 'download.pdf';
  for (let thisValue of contentDispostion) {
    if (thisValue.trim().indexOf(fileNameToken) === 0) {
      fileName = decodeURIComponent(
        thisValue.trim().replace(fileNameToken, ''),
      );
      break;
    }
  }

  return fileName;
}

export default {
  install(Vue) {
    Vue.mixin({
      methods: {
        async apiDelete(params) {
          let path = `${params.resource}/${params.id}`;
          if (params.query) path += `?${params.query}`;
          return await this.apiRequest({
            method: 'DELETE',
            onError: params.onError,
            path: path,
          });
        },
        async apiGet(params) {
          let path = `${params.resource}/${params.id}`;
          if (params.query) path += `?${params.query}`;
          return await this.apiRequest({
            defaultValue: params.defaultValue || {},
            method: 'GET',
            onError: params.onError,
            path: path,
          });
        },
        async apiList(params) {
          let path = params.resource;
          if (params.query) path += `?${params.query}`;
          return await this.apiRequest({
            defaultValue: params.defaultValue || [],
            method: 'GET',
            onError: params.onError,
            path: path,
          });
        },
        async apiPost(params) {
          return await this.apiRequest({
            method: 'POST',
            onError: params.onError,
            path: params.resource,
            body: params.data,
          });
        },
        async apiPut(params) {
          const path = `${params.resource}/${params.data.id}`;
          return await this.apiRequest({
            method: 'PUT',
            onError: params.onError,
            path: path,
            body: params.data,
          });
        },
        async apiSave(params) {
          return params.add
            ? await this.apiPost(params)
            : await this.apiPut(params);
        },
        async apiDownload(id) {
          return await this.apiRequest({
            path: `file/${id}`,
            method: 'GET',
            id: id,
          });
        },
        async apiRequest(params) {
          const headers = new Headers();
          const onError = params.onError || this.handleError;
          const accessToken = await this.$auth.getToken();
          if (!accessToken) {
            return params.defaultValue;
          }

          headers.append('Authorization', `Bearer ${accessToken}`);
          headers.append('Content-Type', `application/json`);
          const options = {
            cache: 'no-cache',
            headers: headers,
            method: params.method,
          };
          if (params.body) options.body = JSON.stringify(params.body);
          const url = `${this.$auth.backendServer}${params.path}`;
          try {
            const response = await fetch(url, options);
            if (!response.ok) {
              onError(response);
              return params.defaultValue;
            }
            if (response.status === 204) return;
            const contentType = response.headers.get('content-type');
            if (contentType === 'application/json') {
              return (await response.json()).result;
            } else {
              const fileName = extractFileName(
                response.headers.get('content-disposition'),
              );
              return {
                blob: await response.blob(),
                name: fileName,
              };
            }
          } catch (error) {
            this.$root.noConnection();
            return params.defaultValue;
          }
        },
        handleError(response) {
          this.$root.showError(`Fehler ${response.status}.`);
        },
      },
    });
  },
};
