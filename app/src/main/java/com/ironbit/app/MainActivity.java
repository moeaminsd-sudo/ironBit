package com.ironbit.app;

import android.Manifest;
import android.annotation.SuppressLint;
import android.app.Activity;
import android.content.ActivityNotFoundException;
import android.content.ComponentName;
import android.content.Context;
import android.content.Intent;
import android.media.MediaMetadata;
import android.media.session.MediaController;
import android.media.session.MediaSessionManager;
import android.media.session.PlaybackState;
import android.provider.Settings;
import android.os.SystemClock;
import android.view.KeyEvent;
import org.json.JSONObject;
import java.util.List;
import android.content.pm.PackageManager;
import android.net.Uri;
import android.os.Build;
import android.os.Bundle;
import android.os.VibrationEffect;
import android.os.Vibrator;
import android.os.VibratorManager;
import android.view.DisplayCutout;
import android.view.WindowInsets;
import android.view.WindowManager;
import android.webkit.JavascriptInterface;
import android.webkit.PermissionRequest;
import android.webkit.ValueCallback;
import android.webkit.WebChromeClient;
import android.webkit.WebResourceRequest;
import android.webkit.WebResourceResponse;
import android.webkit.WebSettings;
import android.webkit.WebView;
import android.webkit.WebViewClient;

import androidx.core.view.WindowCompat;
import androidx.core.view.WindowInsetsCompat;
import androidx.core.view.WindowInsetsControllerCompat;
import androidx.webkit.WebViewAssetLoader;

/** Hosts the IronBit UI from bundled assets over a local https origin (needed for the camera). */
public class MainActivity extends Activity {
    private static final String HOST = "appassets.androidplatform.net";
    private static final int REQ_CAMERA = 7, REQ_FILE = 8, REQ_SAVE = 9, REQ_NOTIF = 10;
    private String pendingSave;
    private WebView web;
    private PermissionRequest pendingCamera;
    private ValueCallback<Uri[]> fileCallback;

    @SuppressLint("SetJavaScriptEnabled")
    @Override
    protected void onCreate(Bundle state) {
        super.onCreate(state);
        if (Build.VERSION.SDK_INT >= 28) getWindow().getAttributes().layoutInDisplayCutoutMode = WindowManager.LayoutParams.LAYOUT_IN_DISPLAY_CUTOUT_MODE_SHORT_EDGES;
        WindowCompat.setDecorFitsSystemWindows(getWindow(), false);
        final WebViewAssetLoader loader = new WebViewAssetLoader.Builder()
                .setDomain(HOST)
                .addPathHandler("/assets/", new WebViewAssetLoader.AssetsPathHandler(this))
                .build();
        web = new WebView(this);
        web.setBackgroundColor(0xFF1A1433);
        WebSettings s = web.getSettings();
        s.setJavaScriptEnabled(true);
        s.setDomStorageEnabled(true);          // profile, progress, club posts and settings stay on the phone
        s.setMediaPlaybackRequiresUserGesture(false);
        s.setTextZoom(100);
        web.setWebViewClient(new WebViewClient() {
            @Override
            public WebResourceResponse shouldInterceptRequest(WebView v, WebResourceRequest req) {
                return loader.shouldInterceptRequest(req.getUrl());
            }
            @Override
            public void onPageFinished(WebView v, String url) { pushSafeTop(); }
            @Override
            public boolean shouldOverrideUrlLoading(WebView v, WebResourceRequest req) {
                Uri u = req.getUrl();
                if (HOST.equals(u.getHost())) return false;
                openExternal(u);                // Play Store / donation links leave the app
                return true;
            }
        });
        web.setWebChromeClient(new WebChromeClient() {
            @Override
            public void onPermissionRequest(final PermissionRequest req) {
                runOnUiThread(() -> {
                    if (checkSelfPermission(Manifest.permission.CAMERA) == PackageManager.PERMISSION_GRANTED) {
                        req.grant(new String[]{PermissionRequest.RESOURCE_VIDEO_CAPTURE});
                    } else {
                        pendingCamera = req;
                        requestPermissions(new String[]{Manifest.permission.CAMERA}, REQ_CAMERA);
                    }
                });
            }
            @Override
            public boolean onShowFileChooser(WebView v, ValueCallback<Uri[]> cb, FileChooserParams params) {
                if (fileCallback != null) fileCallback.onReceiveValue(null);
                fileCallback = cb;
                Intent pick = new Intent(Intent.ACTION_GET_CONTENT);
                pick.addCategory(Intent.CATEGORY_OPENABLE);
                String[] acc = params.getAcceptTypes();
                boolean json = false;
                for (String t : acc) if (t != null && (t.contains("json") || t.equals(".json"))) json = true;
                pick.setType(json ? "*/*" : "image/*");   // backups are .json, photos are images
                try { startActivityForResult(Intent.createChooser(pick, json ? "Choose an IronBit backup" : "Choose a photo"), REQ_FILE); }
                catch (ActivityNotFoundException e) { fileCallback = null; return false; }
                return true;
            }
        });
        web.addJavascriptInterface(new Bridge(), "IronBitNative");
        if (state != null) web.restoreState(state);
        else web.loadUrl("https://" + HOST + "/assets/index.html");
        setContentView(web);
        hideSystemBars();
    }

    /** Full screen: hide status and navigation bars; a swipe from the edge shows them briefly. */
    private void hideSystemBars() {
        WindowInsetsControllerCompat c = WindowCompat.getInsetsController(getWindow(), getWindow().getDecorView());
        c.hide(WindowInsetsCompat.Type.systemBars());
        c.setSystemBarsBehavior(WindowInsetsControllerCompat.BEHAVIOR_SHOW_TRANSIENT_BARS_BY_SWIPE);
    }

    @Override
    public void onWindowFocusChanged(boolean hasFocus) {
        super.onWindowFocusChanged(hasFocus);
        if (hasFocus) hideSystemBars();
    }

    /** Tell the page how tall the camera cutout is, so the header clears it. */
    private void pushSafeTop() {
        int top = 0;
        if (Build.VERSION.SDK_INT >= 28) {
            WindowInsets wi = getWindow().getDecorView().getRootWindowInsets();
            if (wi != null) { DisplayCutout dc = wi.getDisplayCutout(); if (dc != null) top = dc.getSafeInsetTop(); }
        }
        float css = top / getResources().getDisplayMetrics().density;
        web.evaluateJavascript("document.documentElement.style.setProperty('--safe-top','" + css + "px')", null);
    }

    /** Haptics called from the page: kind = tap|tick|click|success|level, level = 1..3. */
    private class Bridge {
        @JavascriptInterface
        public void haptic(String kind, int level) {
            if (level <= 0) return;
            Vibrator v;
            if (Build.VERSION.SDK_INT >= 31) {
                VibratorManager vm = (VibratorManager) getSystemService(VIBRATOR_MANAGER_SERVICE);
                v = vm == null ? null : vm.getDefaultVibrator();
            } else v = (Vibrator) getSystemService(VIBRATOR_SERVICE);
            if (v == null || !v.hasVibrator()) return;
            int amp = level == 1 ? 60 : level == 2 ? 140 : 255;
            if (Build.VERSION.SDK_INT >= 29 && ("tap".equals(kind) || "tick".equals(kind))) {
                v.vibrate(VibrationEffect.createPredefined(level >= 3 ? VibrationEffect.EFFECT_CLICK : VibrationEffect.EFFECT_TICK));
                return;
            }
            if (Build.VERSION.SDK_INT >= 26) {
                VibrationEffect e;
                switch (kind) {
                    case "success": e = VibrationEffect.createWaveform(new long[]{0, 18, 60, 28}, new int[]{0, amp, 0, amp}, -1); break;
                    case "level": e = VibrationEffect.createWaveform(new long[]{0, 20, 40, 20, 40, 60}, new int[]{0, amp, 0, amp, 0, 255}, -1); break;
                    case "click": e = VibrationEffect.createOneShot(14, amp); break;
                    case "tick": e = VibrationEffect.createOneShot(6, Math.max(1, amp / 2)); break;
                    default: e = VibrationEffect.createOneShot(9, amp);
                }
                v.vibrate(e);
            } else v.vibrate(level * 8L);
        }

        private boolean hasAccess() {
            String flat = Settings.Secure.getString(getContentResolver(), "enabled_notification_listeners");
            return flat != null && flat.contains(getPackageName());
        }

        private MediaController active() {
            if (!hasAccess()) return null;
            try {
                MediaSessionManager m = (MediaSessionManager) getSystemService(Context.MEDIA_SESSION_SERVICE);
                List<MediaController> list = m.getActiveSessions(new ComponentName(MainActivity.this, MusicListener.class));
                if (list == null || list.isEmpty()) return null;
                for (MediaController c : list) {
                    PlaybackState st = c.getPlaybackState();
                    if (st != null && st.getState() == PlaybackState.STATE_PLAYING) return c;
                }
                return list.get(0);
            } catch (Exception e) { return null; }
        }

        @JavascriptInterface
        public String musicState() {
            JSONObject o = new JSONObject();
            try {
                o.put("access", hasAccess());
                MediaController c = active();
                if (c != null) {
                    MediaMetadata md = c.getMetadata();
                    if (md != null) {
                        o.put("title", md.getString(MediaMetadata.METADATA_KEY_TITLE));
                        String ar = md.getString(MediaMetadata.METADATA_KEY_ARTIST);
                        o.put("artist", ar != null ? ar : "");
                    }
                    PlaybackState st = c.getPlaybackState();
                    o.put("playing", st != null && st.getState() == PlaybackState.STATE_PLAYING);
                    String app = c.getPackageName();
                    try { app = getPackageManager().getApplicationLabel(getPackageManager().getApplicationInfo(app, 0)).toString(); } catch (Exception ignored) {}
                    o.put("app", app);
                }
            } catch (Exception ignored) {}
            return o.toString();
        }

        @JavascriptInterface
        public void musicCmd(String cmd) {
            MediaController c = active();
            if (c != null) {
                MediaController.TransportControls t = c.getTransportControls();
                PlaybackState st = c.getPlaybackState();
                boolean playing = st != null && st.getState() == PlaybackState.STATE_PLAYING;
                switch (cmd) {
                    case "prev": t.skipToPrevious(); break;
                    case "next": t.skipToNext(); break;
                    default: if (playing) t.pause(); else t.play();
                }
                return;
            }
            // No session visible: send a media key so the last music app reacts.
            int code = "prev".equals(cmd) ? KeyEvent.KEYCODE_MEDIA_PREVIOUS : "next".equals(cmd) ? KeyEvent.KEYCODE_MEDIA_NEXT : KeyEvent.KEYCODE_MEDIA_PLAY_PAUSE;
            android.media.AudioManager am = (android.media.AudioManager) getSystemService(Context.AUDIO_SERVICE);
            long now = SystemClock.uptimeMillis();
            am.dispatchMediaKeyEvent(new KeyEvent(now, now, KeyEvent.ACTION_DOWN, code, 0));
            am.dispatchMediaKeyEvent(new KeyEvent(now, now, KeyEvent.ACTION_UP, code, 0));
        }

        @JavascriptInterface
        public void musicAccess() {
            runOnUiThread(() -> {
                try { startActivity(new Intent(Settings.ACTION_NOTIFICATION_LISTENER_SETTINGS)); } catch (Exception ignored) {}
            });
        }

        @JavascriptInterface
        public void saveFile(String name, String text) {
            pendingSave = text;
            runOnUiThread(() -> {
                Intent i = new Intent(Intent.ACTION_CREATE_DOCUMENT).addCategory(Intent.CATEGORY_OPENABLE)
                        .setType("application/json").putExtra(Intent.EXTRA_TITLE, name);
                try { startActivityForResult(i, REQ_SAVE); } catch (Exception e) { pendingSave = null; }
            });
        }

        @JavascriptInterface
        public void updateWidget(String json) { IronBitWidget.save(MainActivity.this, json); }

        @JavascriptInterface
        public void wizardSchedule(String json) { WizardReceiver.schedule(MainActivity.this, json); }

        @JavascriptInterface
        public void notifPermission() {
            if (Build.VERSION.SDK_INT >= 33 && checkSelfPermission(Manifest.permission.POST_NOTIFICATIONS) != PackageManager.PERMISSION_GRANTED)
                runOnUiThread(() -> requestPermissions(new String[]{Manifest.permission.POST_NOTIFICATIONS}, REQ_NOTIF));
        }

        @JavascriptInterface
        public void openSpotify() {
            runOnUiThread(() -> {
                Intent i = getPackageManager().getLaunchIntentForPackage("com.spotify.music");
                if (i == null) i = new Intent(Intent.ACTION_VIEW, Uri.parse("https://play.google.com/store/apps/details?id=com.spotify.music"));
                try { startActivity(i); } catch (Exception ignored) {}
            });
        }
    }

    @Override
    public void onRequestPermissionsResult(int code, String[] perms, int[] results) {
        if (code == REQ_CAMERA && pendingCamera != null) {
            if (results.length > 0 && results[0] == PackageManager.PERMISSION_GRANTED)
                pendingCamera.grant(new String[]{PermissionRequest.RESOURCE_VIDEO_CAPTURE});
            else pendingCamera.deny();
            pendingCamera = null;
        }
    }

    @Override
    protected void onPause() { super.onPause(); if (web != null) web.onPause(); }      // lets the page stop the camera

    @Override
    protected void onResume() { super.onResume(); if (web != null) web.onResume(); }   // the page restarts the camera

    @Override
    protected void onActivityResult(int code, int result, Intent data) {
        super.onActivityResult(code, result, data);
        if (code == REQ_FILE && fileCallback != null) {
            fileCallback.onReceiveValue(WebChromeClient.FileChooserParams.parseResult(result, data));
            fileCallback = null;
        }
        if (code == REQ_SAVE) {   // write the exported backup to the file the user picked
            boolean ok = false;
            if (result == RESULT_OK && data != null && data.getData() != null && pendingSave != null) {
                try (java.io.OutputStream os = getContentResolver().openOutputStream(data.getData())) {
                    os.write(pendingSave.getBytes(java.nio.charset.StandardCharsets.UTF_8));
                    ok = true;
                } catch (Exception ignored) {}
            }
            pendingSave = null;
            web.evaluateJavascript("window.ibSaved&&ibSaved(" + ok + ")", null);
        }
    }

    private void openExternal(Uri u) {
        if ("mailto".equals(u.getScheme())) {   // bug reports + feature ideas open the email app
            try { startActivity(Intent.createChooser(new Intent(Intent.ACTION_SENDTO, u), "Send with")); } catch (Exception ignored) {}
            return;
        }
        Uri target = u;
        if ("play.google.com".equals(u.getHost()) && u.getQueryParameter("id") != null)
            target = Uri.parse("market://details?id=" + u.getQueryParameter("id"));
        try { startActivity(new Intent(Intent.ACTION_VIEW, target)); }
        catch (ActivityNotFoundException e) {
            try { startActivity(new Intent(Intent.ACTION_VIEW, u)); } catch (ActivityNotFoundException ignored) {}
        }
    }

    @Override
    public void onBackPressed() {
        web.evaluateJavascript("window.ibBack?ibBack():false", result -> {
            if (!"true".equals(result)) finish();
        });
    }

    @Override
    protected void onSaveInstanceState(Bundle out) {
        super.onSaveInstanceState(out);
        web.saveState(out);
    }
}
