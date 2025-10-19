import { RHFRating } from './rhf-rating';
import { RHFEditor } from './rhf-editor';
import { RHFSlider } from './rhf-slider';
import { RHFTextField } from './rhf-text-field';
import { RHFSwitch, RHFMultiSwitch } from './rhf-switch';
import { RHFSelect, RHFMultiSelect } from './rhf-select';
import { RHFCheckbox, RHFMultiCheckbox } from './rhf-checkbox';
import RHFImage from './rhf-image';
import { RHFMonacoCodeEditor } from './rhf-code-editor';
import RHFFile from './rhf-file';

// ----------------------------------------------------------------------

export const Field = {
  Editor: RHFEditor,
  Select: RHFSelect,
  Switch: RHFSwitch,
  Slider: RHFSlider,
  Rating: RHFRating,
  Text: RHFTextField,
  Checkbox: RHFCheckbox,
  MultiSelect: RHFMultiSelect,
  MultiSwitch: RHFMultiSwitch,
  MultiCheckbox: RHFMultiCheckbox,
  Image: RHFImage,
  Code: RHFMonacoCodeEditor,
  File: RHFFile
};
