import type HeadlessDay from './HeadlessDay';

class HeadlessWeek {
  #days: HeadlessDay[] = [];
  #weekNumber: number;
  constructor(days: HeadlessDay[]) {
    this.#days = days;
    this.#weekNumber = this.#calculateWeekNumber(days[0].getDate());
  }

  public getWeekNumber() {
    return this.#weekNumber;
  }

  public getDays() {
    return this.#days;
  }

  #calculateWeekNumber(dt: Date) {
    const tdt = new Date(dt.valueOf());
    const dayn = (dt.getDay() + 6) % 7;
    tdt.setDate(tdt.getDate() - dayn + 3);

    const firstThursday = tdt.valueOf();
    tdt.setMonth(0, 1);
    if (tdt.getDay() !== 4) {
      tdt.setMonth(0, 1 + ((4 - tdt.getDay() + 7) % 7));
    }

    return 1 + Math.ceil((firstThursday - tdt.getTime()) / 604800000);
  }
}

export default HeadlessWeek;
