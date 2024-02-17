import PushNotification, { Importance } from 'react-native-push-notification';

// Bildirim kanalı yapılandırması
const CHANNEL_ID = "messages";
const CHANNEL_NAME = "Mesaj Bildirimleri";
const CHANNEL_DESCRIPTION = "Yeni mesaj bildirimleri için kanal.";

class NotificationService {
  constructor() {
    // PushNotification modülü yüklüyse kanalı oluştur
    if (PushNotification && PushNotification.createChannel) {
      this.createChannel();
    } else {
      console.error('PushNotification modülü yüklenemedi veya createChannel metodu bulunamadı.');
    }
  }

  // Bildirim kanalı oluşturma
  public createChannel() {
    PushNotification.createChannel(
      {
        channelId: CHANNEL_ID,
        channelName: CHANNEL_NAME,
        channelDescription: CHANNEL_DESCRIPTION,
        importance: Importance.HIGH,
        vibrate: true,
      },
      (created) => console.log(`CreateChannel returned '${created}'`)
    );
  }

  // Yerel bildirim gösterme
  public showNotification(title: string, message: string) {
    // PushNotification modülü yüklüyse bildirimi göster
    if (PushNotification && PushNotification.localNotification) {
      PushNotification.localNotification({
        channelId: CHANNEL_ID,
        title,
        message,
        playSound: true,
        soundName: "default",
      });
    } else {
      console.error('PushNotification modülü yüklenemedi veya localNotification metodu bulunamadı.');
    }
  }

  // Planlanmış yerel bildirim gösterme
  public scheduleNotification(title: string, message: string, date: Date) {
    // PushNotification modülü yüklüyse bildirimi planla
    if (PushNotification && PushNotification.localNotificationSchedule) {
      PushNotification.localNotificationSchedule({
        channelId: CHANNEL_ID,
        title,
        message,
        date,
        allowWhileIdle: true, // Cihaz uyku modundayken bile çalışır
      });
    } else {
      console.error('PushNotification modülü yüklenemedi veya localNotificationSchedule metodu bulunamadı.');
    }
  }

  // Belirli bir bildirimi iptal etme
  public cancelNotification(notificationId: string) {
    // PushNotification modülü yüklüyse bildirimi iptal et
    if (PushNotification && PushNotification.cancelLocalNotifications) {
      PushNotification.cancelLocalNotifications({ id: notificationId });
    } else {
      console.error('PushNotification modülü yüklenemedi veya cancelLocalNotifications metodu bulunamadı.');
    }
  }
}

export default new NotificationService();
