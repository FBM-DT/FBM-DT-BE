import { WEEKDAYS } from '@BE/core/constants';

export interface IShift {
  id?: number;
  startTime?: string;
  endTime?: string;
  repeatDays?: WEEKDAYS[];
  department?: {
    id?: number;
    name?: string;
    address?: string;
  };
}
