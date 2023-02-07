import messaging from "@react-native-firebase/messaging";
// import notifee, { AndroidColor } from '@notifee/react-native';

// notifee.displayNotification({
//   title: 'Foreground service',
//   body: 'This notification will exist for the lifetime of the service runner',
//   android: {
//     channelId,
//     asForegroundService: true,
//     color: AndroidColor.RED,
//     colorized: true,
//   },
// });

export async function requestUserPermission() {
  const authStatus = await messaging().requestPermission();
  const enabled =
    authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
    authStatus === messaging.AuthorizationStatus.PROVISIONAL;

  if (enabled) {
    GetFCMToken();
  }
}

export async function GetFCMToken() {
    const  fcmtoken = await messaging().getToken();
    console.log("🚀 ~ file: pushnotification_helper.js:18 ~ GetFCMToken ~ fcmtoken", fcmtoken)
   

}


export const NotificationListener = () => {
  
  // background
  messaging().onNotificationOpenedApp((remoteMessage) => {
  });

  //fore
  messaging().onMessage(async (remoteMessage) => {
    console.log(remoteMessage);
    if(remoteMessage){
       createNotification(remoteMessage?.notification?.title||"", 
        remoteMessage?.notification?.body||""
      )
    }
   
  });
};

export const NotificationListenerOnQuitState = () => {
  // Check whether an initial notification is available
  messaging()
    .getInitialNotification()
    .then((remoteMessage) => {
      if (remoteMessage) {
      }
    });

}