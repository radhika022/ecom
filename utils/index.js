class Unwrap {
  constructor(pass = false) {
    this.pass = pass;
    this.data = null;
    this.error = new Error("failed to unwrap!!");

    this._done = false;
    this._doPass = false;
    this._ = () => {
      this._done = !this._done;
      return this._doPass == this.pass && this._done;
    };

    Object.seal(this);
  }

  get end() {
    this._done = false;
    return this._;
  }

  // panic in case of failure
  unwrap() {
    if (this.pass) {
      return this.data;
    } else {
      throw this.error;
    }
  }

  // instead of panic returns alt data
  unwrapOr(data) {
    if (this.pass) {
      data = this.data;
    }
    return data;
  }
}

class Option extends Unwrap {
  static Some(data) {
    const option = new Option(true);
    option.data = data;
    return option;
  }

  static None = new Option();

  get Some() {
    this._doPass = true;
    return this.data;
  }

  get None() {
    this._doPass = false;
    return this;
  }

  isSome() {
    return this.pass;
  }

  toString() {
    if (this.pass) {
      return `Some(${this.data})`;
    } else {
      return "None";
    }
  }
}

class Result extends Unwrap {
  static Ok(data) {
    const result = new Result(true);
    result.data = data;
    return result;
  }

  static Err(error) {
    const result = new Result();
    result.error = error;
    return result;
  }

  get Ok() {
    this._doPass = true;
    return this.data;
  }

  get Err() {
    this._doPass = false;
    return this.error;
  }

  isOk() {
    return this.pass;
  }

  toString() {
    if (this.pass) {
      return `Ok(${this.data})`;
    } else {
      return `Err(${this.error})`;
    }
  }
}

module.exports = {
  Option,
  Result,
};
