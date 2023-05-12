export interface HeadlessDayProps {
  readonly displayLeadingZero?: boolean;
}

class HeadlessDay {
  #date: Date;
  #displayLeadingZero: boolean;

  constructor(date: Date, params?: HeadlessDayProps) {
    const { displayLeadingZero } = params || {};
    this.#date = new Date(date);
    this.#displayLeadingZero = Boolean(displayLeadingZero);
  }

  public getDate() {
    return new Date(this.#date);
  }

  public getLabel(): string {
    const dateNum = this.#date.getDate();
    if (!this.#displayLeadingZero) {
      return dateNum.toString();
    }

    const numStr = `0${dateNum}`;

    return numStr.substring(numStr.length - 2);
  }

  public isToday() {
    return this.#isSameDay(this.#date, new Date());
  }

  #isSameDay(a: Date, b: Date) {
    return (
      a.getFullYear() === b.getFullYear() &&
      a.getMonth() === b.getMonth() &&
      a.getDate() === b.getDate()
    );
  }
}

export default HeadlessDay;
