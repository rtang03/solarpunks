import React from "react";

const LensContext = React.createContext({ isLensReady: false, setIsLensReady: () => {} });

export const LensProvider = LensContext.Provider;

export default LensContext;
