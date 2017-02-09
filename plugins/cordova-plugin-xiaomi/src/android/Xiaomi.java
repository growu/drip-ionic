package com.jasonz.xiaomi;

import android.accounts.OperationCanceledException;
import android.util.Log;

import com.xiaomi.account.openauth.XMAuthericationException;
import com.xiaomi.account.openauth.XiaomiOAuthConstants;
import com.xiaomi.account.openauth.XiaomiOAuthFuture;
import com.xiaomi.account.openauth.XiaomiOAuthResults;
import com.xiaomi.account.openauth.XiaomiOAuthorize;

import org.apache.cordova.CallbackContext;
import org.apache.cordova.CordovaArgs;
import org.apache.cordova.CordovaPlugin;
import org.apache.cordova.PluginResult;
import org.json.JSONException;

import java.io.IOException;

import static xu.li.cordova.wechat.Wechat.instance;

public class Xiaomi extends CordovaPlugin {

    public static final String TAG = "Cordova.Plugin.Xiaomi";

    private static final String XIAOMI_USER_CANCLE = "cancelled by user";
    private static final String XIAOMI_IO_ERROR = "xiaomi io error";
    private static final String XIAOMI_GET_TOKEN_FAIL = "xiaomi get token fail";
    private static final String XIAOMI_AUTH_ERROR = "xiaomi AUTH error";
    private static final String XIAOMI_NO_TOKEN = "xiaomi no token";


    protected CallbackContext currentCallbackContext;
    public static String mXiaomiAppId;
    public static String mXiaomiRedirectUrl;
    XiaomiOAuthResults results;


    @Override
    protected void pluginInitialize() {

        super.pluginInitialize();
        Log.d(TAG, "plugin initialized.");
    }

    public CallbackContext getCurrentCallbackContext() {
        return currentCallbackContext;
    }

    @Override
    public boolean execute(String action, CordovaArgs args, CallbackContext callbackContext) throws JSONException {
        Log.d(TAG, String.format("%s is called. Callback ID: %s.", action, callbackContext.getCallbackId()));

        if (action.equals("getAccessToken")) {
            return getAccessToken(args, callbackContext);
        } else if (action.equals("getOpenId")) {
            return getOpenId(args, callbackContext);
        } else if (action.equals("getProfile")) {
            return getProfile(args, callbackContext);
        }
        return false;
    }


    protected boolean getAccessToken(CordovaArgs args, final CallbackContext callbackContext) {


        final XiaomiOAuthFuture<XiaomiOAuthResults> future = new XiaomiOAuthorize()
                .setAppId(getAppId())
                .setRedirectUrl(getRedirectUri())
                .setScope(getScope())
                .startGetAccessToken(cordova.getActivity());


        // run in background
        cordova.getThreadPool().execute(new Runnable() {

            @Override
            public void run() {
                try {
                    results = future.getResult();

                    if (results.hasError()) {
                        int errorCode = results.getErrorCode();
                        String errorMessage = results.getErrorMessage();
                        callbackContext.error(errorMessage);
                    } else {
                        String accessToken = results.getAccessToken();
                        String macKey = results.getMacKey();
                        String macAlgorithm = results.getMacAlgorithm();
                        PluginResult result = new PluginResult(PluginResult.Status.OK, results.toString());
                        callbackContext.sendPluginResult(result);
                    }
                } catch (IOException e1) {
                    // error
                    currentCallbackContext = null;

                    // send error
                    callbackContext.error(XIAOMI_IO_ERROR);
                } catch (OperationCanceledException e1) {
                    // user cancel
                    // clear callback context
                    currentCallbackContext = null;

                    // send json exception error
                    callbackContext.error(XIAOMI_USER_CANCLE);
                } catch (XMAuthericationException e1) {
                    // error
                    callbackContext.error(XIAOMI_AUTH_ERROR);
                }
            }
        });

        sendNoResultPluginResult(callbackContext);


        return true;
    }

    protected boolean getOpenId(CordovaArgs args,final CallbackContext callbackContext) {

        if (results == null) {
            currentCallbackContext = null;
            callbackContext.error(XIAOMI_NO_TOKEN);
            return false;
        }

        final XiaomiOAuthFuture<String> future = new XiaomiOAuthorize()
                .callOpenApi(webView.getContext(),
                        getAppId(),
                        XiaomiOAuthConstants.OPEN_API_PATH_OPEN_ID,
                        results.getAccessToken(),
                        results.getMacKey(),
                        results.getMacAlgorithm());

        // run in background
        cordova.getThreadPool().execute(new Runnable() {

            @Override
            public void run() {
                try {
                    String ret = future.getResult();

                    PluginResult result = new PluginResult(PluginResult.Status.OK, ret);

                    callbackContext.sendPluginResult(result);

                } catch (IOException e1) {
                    // error
                } catch (OperationCanceledException e1) {
                    // user cancel
                } catch (XMAuthericationException e1) {
                    // error
                }
            }
        });

        sendNoResultPluginResult(callbackContext);
        return true;
    }

    protected boolean getProfile(CordovaArgs args,final CallbackContext callbackContext) {

        if (results == null) {
            currentCallbackContext = null;
            callbackContext.error(XIAOMI_NO_TOKEN);
            return false;
        }

        final XiaomiOAuthFuture<String> future = new XiaomiOAuthorize()
                .callOpenApi(webView.getContext(),
                        getAppId(),
                        XiaomiOAuthConstants.OPEN_API_PATH_PROFILE,
                        results.getAccessToken(),
                        results.getMacKey(),
                        results.getMacAlgorithm());

        // run in background
        cordova.getThreadPool().execute(new Runnable() {

            @Override
            public void run() {
                try {
                    String ret = future.getResult();

                    PluginResult result = new PluginResult(PluginResult.Status.OK, ret);

                    callbackContext.sendPluginResult(result);

                } catch (IOException e1) {
                    // error
                } catch (OperationCanceledException e1) {
                    // user cancel
                } catch (XMAuthericationException e1) {
                    // error
                }
            }
        });

        sendNoResultPluginResult(callbackContext);
        return true;
    }

    protected long getAppId() {
        if (this.mXiaomiAppId == null) {
            this.mXiaomiAppId = preferences.getString("XIAOMIAPPID", "");
        }

        return Long.parseLong(this.mXiaomiAppId);

    }

    protected String getRedirectUri() {
        if (this.mXiaomiRedirectUrl == null) {
            this.mXiaomiRedirectUrl = preferences.getString("REDIRECTURI", "");
        }

        return this.mXiaomiRedirectUrl;
    }

    protected int[] getScope() {
        int[] scopes = {XiaomiOAuthConstants.SCOPE_PROFILE,XiaomiOAuthConstants.SCOPE_OPEN_ID};
        return scopes;
    }

    private void sendNoResultPluginResult(CallbackContext callbackContext) {
        // save current callback context
        currentCallbackContext = callbackContext;

        // send no result and keep callback
        PluginResult result = new PluginResult(PluginResult.Status.NO_RESULT);
        result.setKeepCallback(true);
        callbackContext.sendPluginResult(result);
    }
}
