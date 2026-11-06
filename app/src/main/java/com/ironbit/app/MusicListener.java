package com.ironbit.app;

import android.service.notification.NotificationListenerService;

/** Exists only so Android lets IronBit see and control the music app that is playing. IronBit doesn't read or store notifications. */
public class MusicListener extends NotificationListenerService {}
