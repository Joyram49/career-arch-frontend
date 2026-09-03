import client from './client';
import admin from './modules/admin.api';
import applications from './modules/applications.api';
import auth from './modules/auth.api';
import jobs from './modules/jobs.api';
import notifications from './modules/notifications.api';
import org from './modules/org.api';
import subscription from './modules/subscription.api';
import user from './modules/user.api';

export const APIKit = {
  auth,
  user,
  jobs,
  applications,
  subscription,
  notifications,
  org,
  admin,
};

export { client };
