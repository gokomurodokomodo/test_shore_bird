import 'package:base_connect/base_connect.dart';

class APIImplement implements BaseAPI{
  @override
  String getAccessToken() {
    return 'accessTokenHolder';
  }
}