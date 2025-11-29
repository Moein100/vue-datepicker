import { useSingleSelection } from './strategies/useSingleSelection.js';
import { useRangeSelection } from './strategies/useRangeSelection.js';
import { useMultipleSelection } from './strategies/useMultipleSelection.js';
import { SELECTION_MODES } from '../../constants/datepicker.js';

const SELECTION_STRATEGIES = {
  [SELECTION_MODES.SINGLE]: useSingleSelection,
  [SELECTION_MODES.RANGE]: useRangeSelection,
  [SELECTION_MODES.MULTIPLE]: useMultipleSelection,
};

export function createSelection(mode, initialValue = null) {
  const strategy = SELECTION_STRATEGIES[mode];

  if (!strategy) {
    const validModes = Object.keys(SELECTION_STRATEGIES).join(', ');
    throw new Error(`Unknown selection mode: "${mode}". Valid modes: ${validModes}`);
  }

  return strategy(initialValue);
}

export function isValidSelectionMode(mode) {
  return Object.values(SELECTION_MODES).includes(mode);
}
