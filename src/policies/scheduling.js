import { Policy } from 'pundit/dist/pundit.mjs';

export default class SchedulingPolicy extends Policy {
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
    return this.user.profiles.includes('manager');
  }

  destroy() {
    return this.user.profiles.includes('manager');
  }

  permittedAttributes() {
    return ['description', 'startAt', 'endAt', 'obs', 'userId', 'locationId'];
  }
}