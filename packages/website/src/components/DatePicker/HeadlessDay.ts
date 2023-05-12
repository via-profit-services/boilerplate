class HeadlessDay {
  #date: Date;

  constructor(date: Date) {
    this.#date = new Date(date);
  }

  public getDate() {
    return new Date(this.#date);
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
