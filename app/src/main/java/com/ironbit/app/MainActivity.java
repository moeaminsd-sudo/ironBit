package com.ironbit.app;

import android.annotation.SuppressLint;
import android.app.Activity;
import android.content.ActivityNotFoundException;
import android.content.Intent;
import android.net.Uri;
import android.os.Bundle;
import android.webkit.WebResourceRequest;
import android.webkit.WebSettings;
import android.webkit.WebView;
import android.webkit.WebViewClient;

/** Hosts the IronBit UI from bundled assets. No network access is used. */
public class MainActivity extends Activity {
    private WebView web;

    @SuppressLint("SetJavaScriptEnabled")
    @Override
    protected void onCreate(Bundle state) {
        super.onCreate(state);
        web = new WebView(this);
        web.setBackgroundColor(0xFF1A1433);
        WebSettings s = web.getSettings();
        s.setJavaScriptEnabled(true);
        s.setDomStorageEnabled(true);          // saves profile, progress and settings on the phone
        s.setAllowFileAccess(true);
        s.setMediaPlaybackRequiresUserGesture(false);
        s.setTextZoom(100);
        web.setWebViewClient(new WebViewClient() {
            @Override
            public boolean shouldOverrideUrlLoading(WebView v, WebResourceRequest req) {
                Uri u = req.getUrl();
                if ("file".equals(u.getScheme())) return false;
                openExternal(u);                // Play Store / donation links leave the app
                return true;
            }
        });
        if (state != null) web.restoreState(state);
        else web.loadUrl("file:///android_asset/index.html");
        setContentView(web);
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
