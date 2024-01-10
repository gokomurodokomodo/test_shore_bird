import 'package:base_connect/base_connect.dart';
import 'package:flutter/material.dart';
import 'package:flutter/src/widgets/framework.dart';
import 'package:get/get.dart';
import 'package:package1/package1.dart' as package;
import 'package:test_shore_bird/core.dart';
import 'package:test_shore_bird/home/home_controller.dart' as rootcontroller;

class HomePage extends GetView<rootcontroller.SuperAppHomeController> {
  @override
  Widget build(BuildContext context) {
    return Scaffold(
      body: Center(
        child: Column(
          mainAxisAlignment: MainAxisAlignment.center,
          children: [
            GestureDetector(
                onTap: () async {
                  await controller.checkUpdate(
                      onError: () {
                        Get.snackbar('No Update', 'Updater');
                      },
                      onSuccess: () {
                        Get.snackbar('Update Available', 'Update now please',
                            mainButton: TextButton(onPressed: () async {
                              await controller.downloadUpdate(
                                onSuccess: () {
                                  Get.closeAllSnackbars();
                                  Get.snackbar(
                                      'Downloaded', 'Update downloaded successfully');
                                },
                                onError: () {
                                  Get.closeAllSnackbars();
                                  Get.snackbar('Failed', 'Update download failed');
                                }
                              );
                            }, child: Icon(Icons.download)));
                      }
                  );
                },
                child: Text('Kiểm tra cập nhập')),
            GestureDetector(
              onTap: () {
                Get.put(APIImplement() as BaseAPI);
                package.PackageEntryPoint().entryPoint();
              },
              child: Text('miniapp'),
            ),
          ],
        ),
      ),
    );
  }

}