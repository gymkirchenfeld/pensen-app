/**
 * Provides a Vue plugin for accessing an API.
 **/

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
            method: 'GET',
            onError: params.onError,
            path: path,
          });
        },
        async apiList(params) {
          let path = params.resource;
          if (params.query) path += `?${params.query}`;
          return await this.apiRequest({
            method: 'GET',
            onError: params.onError,
            path: path,
            defaultValue: params.defaultValue || [],
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
        async apiRequest(params) {
          const headers = new Headers();
          const onError = params.onError || this.handleError;
          const accessToken = await this.$auth.getToken();
          if (!accessToken) {
            return params.defaultValue;
          }

          headers.append('Authorization', `Bearer ${accessToken}`);
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
            return (await response.json()).result;
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
