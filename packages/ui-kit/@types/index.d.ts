import "@emotion/react";

declare module "@emotion/react" {
  import { Theme as BoilerplateTheme } from "@boilerplate/ui-kit";
  export interface Theme extends BoilerplateTheme {}
}

// declare module "@emotion/react" {
//   import {Theme as BoilerplateTheme} from '@boilerplate/ui-kit';

//   export interface Theme extends BoilerplateTheme {}
// }
