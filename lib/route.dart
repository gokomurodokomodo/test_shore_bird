import 'package:get/get.dart';
import 'package:test_shore_bird/home/home_controller.dart';
import 'package:test_shore_bird/home/home_page.dart';

class AppRoute{
  static const String homePage = '/home_page';

  static List<GetPage> getPages = [
    GetPage(
        name: homePage,
        page: () => HomePage(),
        binding: BindingsBuilder((){
          Get.put(SuperAppHomeController());
        })
    ),
  ];
}