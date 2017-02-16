import json
import os
import tempfile
import unittest

from vcapp import vcapp


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

    def login(self, username, password):
        return self.app.post(
            '/login', data=dict(
                username=username,
                password=password
            ), 
            follow_redirects=True)

    def logout(self):
        return self.app.get('/logout', follow_redirects=True)

    def test_empty_db(self):
        result = self.app.get("/")
        assert b'No entries here so far' in result.data

    def test_has_zero_variants_initially(self):
        result = self.app.get("/num_variants")
        self.assertEqual(result.status_code, 200)
        self.assertEqual(result.content_type, "application/json")
        data = json.loads(result.data)
        self.assertEqual(data['num_variants'], 0)

    def test_login_logout(self):
        rv = self.login('admin', 'default')
        self.assertEqual(rv.status_code, 200)
        assert b'You were logged in' in rv.data
        rv = self.logout()
        self.assertEqual(rv.status_code, 200)
        assert b'You were logged out' in rv.data

    def test_invalid_username(self):
        rv = self.login('adminx', 'default')
        self.assertEqual(rv.status_code, 200)
        assert b'Invalid username' in rv.data

    def test_invalid_password(self):
        rv = self.login('admin', 'defaultx')
        self.assertEqual(rv.status_code, 200)
        assert b'Invalid password' in rv.data

    def test_adding_single_variant(self):
        self.login('admin', 'default')

        rv = self.app.post('/add_variant', data=dict(
            chrom='1',
            pos=1000,
            ref='A',
            alt='C'
        ), follow_redirects=True)

        self.assertEqual(rv.status_code, 200)

        result = self.app.get("/num_variants")
        self.assertEqual(result.status_code, 200)
        self.assertEqual(result.content_type, "application/json")
        data = json.loads(result.data)
        self.assertEqual(data['num_variants'], 1)
        assert b'No entries here so far' not in rv.data


if __name__ == '__main__':
    unittest.main()
