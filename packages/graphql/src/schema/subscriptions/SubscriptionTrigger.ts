/**
 * Pubsub subscription trigger
 */
enum SubscriptionTrigger {
  /**
   * New User was created right now
   */
  USER_WAS_UPDATED = 'user-was-updated',

  /**
   * Notifications counter will be updated
   */
  NOTIFICATION_COUNTER_UPDATED = 'notification-counter-updated',

  /**
   * New Notification was created right now
   */
  NOTIFICATION_CREATED = 'notification-created',

  /**
   * Notification was updated right now
   */
  NOTIFICATION_UPDATED = 'notification-updated',
}

export default SubscriptionTrigger;
