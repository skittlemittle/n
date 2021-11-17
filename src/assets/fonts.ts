import { createGlobalStyle } from "styled-components";

import jetbrainsRegular from "./jetbrains_mono/JetBrainsMono-Regular.woff2";
import interRegular from "./Inter/Inter-Regular.woff2";
import interItalic from "./Inter/Inter-ExtraLightItalic.woff2";
import interBlack from "./Inter/Inter-Black.woff2";
import interSemiBold from "./Inter/Inter-SemiBold.woff2";
import interMedium from "./Inter/Inter-Medium.woff2";

export default createGlobalStyle`
  @font-face {
    font-family: 'JetBrains Mono';
    src: local('JetBrains Mono'), url(${jetbrainsRegular}) format('woff2'); 
    font-weight: 400;
    font-style: normal;
    font-display: swap;
  }

  @font-face {
    font-family: 'Inter';
    src: local('Inter'), url(${interRegular}) format('woff2');
    font-style:  normal;
    font-weight: 400;
    font-display: swap;
  }

  @font-face {
    font-family: 'Inter';
    src: local('Inter'), url(${interItalic}) format('woff2');
    font-style:  italic;
    font-weight: 200;
    font-display: swap;
  }

  @font-face {
    font-family: 'Inter';
    src: local('Inter'), url(${interBlack}) format('woff2');
    font-style:  normal;
    font-weight: 900;
    font-display: swap;
  }

  @font-face {
    font-family: 'Inter';
    src: local('Inter'), url(${interSemiBold}) format('woff2');
    font-style:  normal;
    font-weight: 600;
    font-display: swap;
  }

  @font-face {
    font-family: 'Inter';
    src: local('Inter'), url(${interMedium}) format('woff2');
    font-style:  normal;
    font-weight: 500;
    font-display: swap;
  }
`;
