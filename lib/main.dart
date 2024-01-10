import 'package:flutter/material.dart';
import 'package:get/get.dart';
import 'package:package1/package1.dart' as package;
import 'package:test_shore_bird/route.dart';

void main() {
  List<GetPage> pages = [];
  pages.addAll(AppRoute.getPages);
  pages.addAll(package.PackageEntryPoint().getPage());
  runApp(MyApp(pages: pages));
}

class MyApp extends StatelessWidget {
  final List<GetPage> pages;

  const MyApp({Key? key, required this.pages}) : super(key: key);

  @override
  Widget build(BuildContext context) {
    return GetMaterialApp(
      getPages: pages,
      initialRoute: '/home_page',
      defaultTransition: Transition.cupertino,
    );
  }
}