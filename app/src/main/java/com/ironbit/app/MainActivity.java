package com.ironbit.app;

import android.Manifest;
import android.annotation.SuppressLint;
import android.app.Activity;
import android.content.ActivityNotFoundException;
import android.content.Intent;
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
    private static final int REQ_CAMERA = 7, REQ_FILE = 8;
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
                pick.setType("image/*");
                try { startActivityForResult(Intent.createChooser(pick, "Choose a photo"), REQ_FILE); }
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
    protected void onActivityResult(int code, int result, Intent data) {
        super.onActivityResult(code, result, data);
        if (code == REQ_FILE && fileCallback != null) {
            fileCallback.onReceiveValue(WebChromeClient.FileChooserParams.parseResult(result, data));
            fileCallback = null;
        }
    }

    private void openExternal(Uri u) {
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
