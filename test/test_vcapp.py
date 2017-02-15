import os
import vcapp
import unittest
import tempfile


class VCAppTestCase(unittest.TestCase):

    def setUp(self):
        self.db_fd, vcapp.app.config['DATABASE'] = tempfile.mkstemp()
        vcapp.app.config['TESTING'] = True
        self.app = vcapp.app.test_client()
        with vcapp.app.app_context():
            vcapp.init_db()

    def tearDown(self):
        os.close(self.db_fd)
        os.unlink(vcapp.app.config['DATABASE'])


if __name__ == '__main__':
    unittest.main()
