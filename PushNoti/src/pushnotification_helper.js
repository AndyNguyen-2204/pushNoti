import notifee, { AndroidImportance } from '@notifee/react-native';
import AsyncStorage from "@react-native-async-storage/async-storage";
import messaging from "@react-native-firebase/messaging";

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
  let fcmtoken = await AsyncStorage.getItem("fcmtoken");
  console.log("🚀 ~ file: pushnotification_helper.js:18 ~ GetFCMToken ~ fcmtoken", fcmtoken)
  if (!fcmtoken) {
    try {
      fcmtoken = await messaging().getToken();
      if (fcmtoken) {
        AsyncStorage.setItem("fcmtoken", fcmtoken);
        
      }
    } catch (error) {
      console.log("🚀 ~ file: pushnotification_helper.js:27 ~ GetFCMToken ~ error", error)
      
    }
  }
}

const createNotification= async(title, body)=>{
  try {
    // Request permissions (required for iOS)
    await notifee.requestPermission()

    // Create a channel (required for Android)
    const channelId = await notifee.createChannel({
      id: 'default',
      name: 'Default Channel',
      importance: AndroidImportance.HIGH
    });

    // Display a notification
    await notifee.displayNotification({
      title,
      body,
      android: {
        channelId,
        smallIcon:"ic_noti_icon",
        color:"#000000"
      },
    });
  } catch (error) {
  console.log("🚀 ~ file: pushnotification_helper.js:56 ~ createNotification ~ error", error)
  
  }
}

export const NotificationListener = () => {
  
  // background
  messaging().onNotificationOpenedApp((remoteMessage) => {
  
  });
  messaging().setBackgroundMessageHandler(async remoteMessage => {
    console.log('Message handled in the background!', remoteMessage);
  });
  //fore
  messaging().onMessage(async (remoteMessage) => {
  console.log("🚀 ~ file: pushnotification_helper.js:71 ~ messaging ~ remoteMessage", remoteMessage)

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