// Basic smoke test for the Cakna app.
import 'package:flutter_test/flutter_test.dart';
import 'package:cakna/theme.dart';

void main() {
  test('themes build with the teal identity', () {
    expect(caknaLight().colorScheme.primary, CaknaColors.teal);
    expect(caknaDark().brightness.name, 'dark');
  });
}
