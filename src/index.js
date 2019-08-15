import has from "lodash/has";
import isEmpty from "lodash/isEmpty";
import axios from "axios";

const pending = (type, meta) => ({
  type,
  payload: null,
  meta: { isPending: true, ...meta }
});

const AxiosFlow = dispatch => {
  const getTokenHeader = () => {
    const token = localStorage.getItem(AxiosFlow.TOKEN_LABEL)
      ? localStorage.getItem(AxiosFlow.TOKEN_LABEL)
      : sessionStorage.getItem(AxiosFlow.TOKEN_LABEL);

    if (token) {
      return { Authorization: `Bearer ${token}` };
    }
    return null;
  };

  const onSuccess = (type, response, onSuccessCallback, meta, params) => {
    const { data, headers } = response;
    if (typeof AxiosFlow.onSuccessHandler === "function") {
      AxiosFlow.onSuccessHandler(dispatch, response);
    }
    if (type) {
      dispatch({
        type,
        payload: data,
        meta: { headers, isPending: false, params, ...meta }
      });
    }

    if (typeof onSuccessCallback === "function") {
      onSuccessCallback(response);
    }
  };

  const onError = (type, error, onErrorCallback) => {
    if (has(error, "response.status") && error.response.status === 401) {
      sessionStorage.removeItem(AxiosFlow.TOKEN_LABEL);
      localStorage.removeItem(AxiosFlow.TOKEN_LABEL);
    }
    if (typeof AxiosFlow.onErrorHandler === "function") {
      AxiosFlow.onErrorHandler(dispatch, error);
    }
    if (type) {
      dispatch({ type, error: true });
    }
    if (typeof onErrorCallback === "function") {
      onErrorCallback(error);
    }
  };

  // here
  function Api() {
    if (typeof dispatch !== "function") {
      throw Error("Please provide a valid dispatch.");
    }

    if (AxiosFlow.TOKEN_LABEL === null) {
      AxiosFlow.TOKEN_LABEL = "achromex-auth-token";
    }

    const that = this;
    that.config = {};

    // that.instance = _dispatch => new Api(_dispatch);

    Api.prototype.url = url => {
      that.config.url = url;
      return that;
    };

    Api.prototype.meta = meta => {
      that.config.meta = meta;
      return that;
    };

    Api.prototype.action = type => {
      that.config.actionType = type;
      return that;
    };

    Api.prototype.params = _params => {
      if (!isEmpty(_params)) {
        that.config.params = _params;
      }
      return that;
    };

    Api.prototype.data = data => {
      that.config.data = data;
      return that;
    };

    Api.prototype.headers = headers => {
      that.config.headers = headers;
      return that;
    };

    Api.prototype.onSuccess = onSuccessCallback => {
      that.config.onSuccessCallback = onSuccessCallback;
      return that;
    };

    Api.prototype.onError = onErrorCallback => {
      that.config.onErrorCallback = onErrorCallback;
      return that;
    };

    Api.prototype.post = async () => {
      dispatch(pending(that.config.actionType));
      try {
        const response = await axios.post(that.config.url, that.config.data, {
          headers: { ...getTokenHeader(), ...that.config.headers },
          params: that.config.params
        });
        onSuccess(
          that.config.actionType,
          response,
          that.config.onSuccessCallback,
          that.config.meta,
          that.config.params
        );
      } catch (error) {
        onError(that.config.actionType, error, that.config.onErrorCallback);
      }
    };

    Api.prototype.get = async () => {
      if (that.config.actionType) {
        dispatch(pending(that.config.actionType, that.config.meta));
      }
      try {
        const response = await axios.get(that.config.url, {
          headers: { ...getTokenHeader(), ...that.config.headers },
          params: that.config.params || null
        });
        onSuccess(
          that.config.actionType,
          response,
          that.config.onSuccessCallback,
          that.config.meta,
          that.config.params
        );
      } catch (error) {
        onError(that.config.actionType, error, that.config.onErrorCallback);
      }
    };

    Api.prototype.update = async () => {
      dispatch(pending(that.config.actionType));
      try {
        const response = await axios.put(that.config.url, that.config.data, {
          headers: { ...getTokenHeader(), ...that.config.headers },
          params: that.config.params
        });
        onSuccess(
          that.config.actionType,
          response,
          that.config.onSuccessCallback,
          that.config.meta,
          that.config.params
        );
      } catch (error) {
        onError(that.config.actionType, error, that.config.onErrorCallback);
      }
    };

    Api.prototype.delete = async () => {
      dispatch(pending(that.config.actionType));
      try {
        const response = await axios.delete(that.config.url, {
          headers: { ...getTokenHeader(), ...that.config.headers },
          params: that.config.params || null
        });
        onSuccess(
          that.config.actionType,
          response,
          that.config.onSuccessCallback,
          that.config.meta,
          that.config.params
        );
      } catch (error) {
        onError(that.config.actionType, error, that.config.onErrorCallback);
      }
    };
  }

  return new Api();
};

AxiosFlow.setTokenLabel = token => {
  AxiosFlow.TOKEN_LABEL = token;
  return AxiosFlow;
};

AxiosFlow.setSuccessHandler = handler => {
  if (typeof handler === "function") {
    AxiosFlow.onSuccessHandler = handler;
  } else {
    throw new Error("successHandler must be a function");
  }
  return AxiosFlow;
};

AxiosFlow.setFailureHandler = handler => {
  if (typeof handler === "function") {
    AxiosFlow.onErrorHandler = handler;
  } else {
    throw new Error("failureHandler must be a function");
  }
  return AxiosFlow;
};

export default AxiosFlow;
