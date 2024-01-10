import 'package:get/get.dart';
import 'package:restart_app/restart_app.dart';
import 'package:shorebird_code_push/shorebird_code_push.dart';

class SuperAppHomeController extends GetxController {
  final shoreBird = ShorebirdCodePush();

  Future<void> checkUpdate({
    Function? onSuccess,
    Function? onError,
  }) async {
    if (await shoreBird.isNewPatchAvailableForDownload()) {
      onSuccess?.call();
    } else{
      onError?.call();
    }
  }

  Future<void> downloadUpdate({
    Function? onSuccess,
    Function? onError,
}) async{
    try{
      await shoreBird.downloadUpdateIfAvailable();
      Restart.restartApp();
    } catch(e) {
      print(e);
    }
  }
}
