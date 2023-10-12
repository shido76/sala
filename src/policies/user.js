import { Policy } from 'pundit/dist/pundit.mjs';

export default class UserPolicy extends Policy {
  constructor(user, record) {
    super(user, record);
    this.setup.apply(this);
  }

  show() {
    return true;
  }

  create() {
    return this.user.profiles.includes('manager');
  }

  update() {
    if (this.user.profiles.includes('admin')) {
      return true;
    } else if (this.user.profiles.includes('manager')) {
      return !this.record.profiles.includes('admin');
    } else {
      return this.record.id === this.user.id
    }
  }

  destroy() {
    return this.user.profiles.includes('admin');
  }

  permittedAttributes() {
    if (this.user.profiles.includes('admin')) {
      return ['email', 'password', 'name', 'numusp', 'phone', 'profiles', 'active'];
    } else {
      return ['email', 'password', 'name', 'numusp', 'phone'];
    }
  }
}