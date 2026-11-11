abstract interface class NodApiTransport {
  Future<Object?> requestJson(
    String method,
    String path, {
    Map<String, Object?>? body,
  });
}
