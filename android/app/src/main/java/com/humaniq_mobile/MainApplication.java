package com.humaniq_mobile;

import android.app.Application;

import com.facebook.react.ReactApplication;
import com.zmxv.RNSound.RNSoundPackage;
import com.rnim.rn.audio.ReactNativeAudioPackage;
import com.humaniq.libsignals.SignalReactPackage;
import com.centaurwarchief.smslistener.SmsListenerPackage;
import com.pusherman.networkinfo.RNNetworkInfoPackage;
import codes.simen.IMEI.IMEI;
import com.learnium.RNDeviceInfo.RNDeviceInfo;
import com.BV.LinearGradient.LinearGradientPackage;
import com.brentvatne.react.ReactVideoPackage;
import com.RNFetchBlob.RNFetchBlobPackage;
import com.lwansbrough.RCTCamera.RCTCameraPackage;
import com.facebook.react.ReactNativeHost;
import com.facebook.react.ReactPackage;
import com.facebook.react.shell.MainReactPackage;
import com.facebook.soloader.SoLoader;
import android.support.multidex.MultiDexApplication;
import com.humaniq.libsignals.GreenDaoDatabase;

import java.util.Arrays;
import java.util.List;

public class MainApplication extends MultiDexApplication implements ReactApplication {

  private final ReactNativeHost mReactNativeHost = new ReactNativeHost(this) {
    @Override
    public boolean getUseDeveloperSupport() {
      return BuildConfig.DEBUG;
    }

    @Override
    protected List<ReactPackage> getPackages() {
      return Arrays.<ReactPackage>asList(
          new MainReactPackage(),
            new RNSoundPackage(),
            new ReactNativeAudioPackage(),
            new SignalReactPackage(),
            new SmsListenerPackage(),
            new RNNetworkInfoPackage(),
            new IMEI(),
            new RNDeviceInfo(),
            new LinearGradientPackage(),
            new ReactVideoPackage(),
            new RNFetchBlobPackage(),
            new RCTCameraPackage()
      );
    }
  };

  @Override
  public ReactNativeHost getReactNativeHost() {
    return mReactNativeHost;
  }

  @Override
  public void onCreate() {
    super.onCreate();
    SoLoader.init(this, /* native exopackage */ false);
    GreenDaoDatabase.createEncryptedInstance(this, "super-secret");
  }
}
