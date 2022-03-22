import React from "react";

const LensContext = React.createContext({
  isLensReady: false,
  setIsLensReady: () => {},
  defaultProfile: "",
  setDefaultProfile: () => {},
  defaultHandle: "",
  setDefaultHandle: () => { },
  fetchDefaultProfileCount: 0,
  setFetchDefaultPofileCount: () => { }
});

export const LensProvider = LensContext.Provider;

export default LensContext;
