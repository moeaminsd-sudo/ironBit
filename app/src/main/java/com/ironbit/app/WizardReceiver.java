package com.ironbit.app;

import android.app.AlarmManager;
import android.app.NotificationChannel;
import android.app.NotificationManager;
import android.app.PendingIntent;
import android.content.BroadcastReceiver;
import android.content.Context;
import android.content.Intent;
import android.content.SharedPreferences;
import android.graphics.BitmapFactory;
import android.os.Build;

import androidx.core.app.NotificationCompat;
import androidx.core.app.NotificationManagerCompat;

import org.json.JSONArray;
import org.json.JSONObject;

/** Shows Merlift's rare reminders and tips. Alarms are re-created after a reboot. */
public class WizardReceiver extends BroadcastReceiver {
    static final String CHANNEL = "merlift";
    static final String PREFS = "merlift";

    @Override
    public void onReceive(Context ctx, Intent intent) {
        String action = intent.getAction();
        if (Intent.ACTION_BOOT_COMPLETED.equals(action) || "android.intent.action.MY_PACKAGE_REPLACED".equals(action)) {
            schedule(ctx, ctx.getSharedPreferences(PREFS, Context.MODE_PRIVATE).getString("list", "[]"));
            return;
        }
        show(ctx, intent.getIntExtra("id", 0), intent.getStringExtra("title"), intent.getStringExtra("text"));
    }

    static void show(Context ctx, int id, String title, String text) {
        NotificationManager nm = (NotificationManager) ctx.getSystemService(Context.NOTIFICATION_SERVICE);
        if (Build.VERSION.SDK_INT >= 26 && nm.getNotificationChannel(CHANNEL) == null) {
            NotificationChannel ch = new NotificationChannel(CHANNEL, "Merlift the wizard", NotificationManager.IMPORTANCE_DEFAULT);
            ch.setDescription("Rare reminders, tips and jokes from Merlift");
            nm.createNotificationChannel(ch);
        }
        Intent open = new Intent(ctx, MainActivity.class).setFlags(Intent.FLAG_ACTIVITY_NEW_TASK | Intent.FLAG_ACTIVITY_CLEAR_TOP);
        PendingIntent pi = PendingIntent.getActivity(ctx, id, open, PendingIntent.FLAG_IMMUTABLE | PendingIntent.FLAG_UPDATE_CURRENT);
        NotificationCompat.Builder b = new NotificationCompat.Builder(ctx, CHANNEL)
                .setSmallIcon(R.drawable.ic_stat_wizard)
                .setLargeIcon(BitmapFactory.decodeResource(ctx.getResources(), R.drawable.wizard_face))
                .setColor(0xFF6C3FC4)
                .setContentTitle(title)
                .setContentText(text)
                .setStyle(new NotificationCompat.BigTextStyle().bigText(text))
                .setContentIntent(pi)
                .setAutoCancel(true);
        try { NotificationManagerCompat.from(ctx).notify(1000 + id, b.build()); } catch (SecurityException ignored) {}
    }

    /** list = JSON array of {at: epoch ms, title, text}. An empty list cancels everything. */
    static void schedule(Context ctx, String list) {
        AlarmManager am = (AlarmManager) ctx.getSystemService(Context.ALARM_SERVICE);
        SharedPreferences sp = ctx.getSharedPreferences(PREFS, Context.MODE_PRIVATE);
        int old = sp.getInt("count", 0);
        for (int i = 0; i < old; i++) am.cancel(pending(ctx, i, null, null));
        int n = 0;
        try {
            JSONArray arr = new JSONArray(list);
            long now = System.currentTimeMillis();
            for (int i = 0; i < arr.length() && i < 8; i++) {
                JSONObject o = arr.getJSONObject(i);
                long at = o.getLong("at");
                if (at <= now) continue;
                am.set(AlarmManager.RTC_WAKEUP, at, pending(ctx, n, o.optString("title"), o.optString("text")));
                n++;
            }
        } catch (Exception ignored) {}
        sp.edit().putString("list", list).putInt("count", n).apply();
    }

    private static PendingIntent pending(Context ctx, int i, String title, String text) {
        Intent it = new Intent(ctx, WizardReceiver.class).setAction("com.ironbit.app.MERLIFT_" + i).putExtra("id", i);
        if (title != null) it.putExtra("title", title).putExtra("text", text);
        return PendingIntent.getBroadcast(ctx, i, it, PendingIntent.FLAG_IMMUTABLE | PendingIntent.FLAG_UPDATE_CURRENT);
    }
}
