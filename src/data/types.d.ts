import {StateItemNames} from "./dictionary";

export type ExtnStorage = {
  [StateItemNames.HIDDEN_CONTACTS]: Chat[];
  [StateItemNames.RELEASE_NOTES_VIEWED]: boolean;
  [StateItemNames.ZEN_MODE_STATUS]: boolean;
};

export type ReleaseNotes = {
  version: string;
  changes: string[];
}[];
