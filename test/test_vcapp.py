import os
import unittest
import tempfile

from vcapp import vcapp


class VCAppTestCase(unittest.TestCase):

    def setUp(self):
        self.db_fd, vcapp.app.config['DATABASE'] = tempfile.mkstemp()
        vcapp.app.config['TESTING'] = True
        self.app = vcapp.app.test_client()
        with vcapp.app.app_context():
            print dir(vcapp)
            vcapp.init_db()

    def tearDown(self):
        os.close(self.db_fd)
        os.unlink(vcapp.app.config['DATABASE'])

    def test_empty_db(self):
        result = self.app.get("/")
        assert b'No entries here so far' in result.data


if __name__ == '__main__':
    unittest.main()
